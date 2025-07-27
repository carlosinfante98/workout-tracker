import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Clock,
  Dumbbell,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import CustomSelect from "../ui/CustomSelect";

const WorkoutFilters = ({ filters, onFiltersChange, workoutTypeStats }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isExpanded]);

  const workoutTypes = [
    { value: "", label: "All Types", icon: "🏃" },
    { value: "cardio", label: "Cardio", icon: "🏃" },
    { value: "strength", label: "Strength", icon: "💪" },
    { value: "flexibility", label: "Flexibility", icon: "🧘" },
    { value: "sports", label: "Sports", icon: "⚽" },
    { value: "other", label: "Other", icon: "🏋️" },
  ];

  const durationOptions = [
    { value: "", label: "Any Duration" },
    { value: "0-30", label: "0-30 minutes" },
    { value: "30-60", label: "30-60 minutes" },
    { value: "60-90", label: "60-90 minutes" },
    { value: "90+", label: "90+ minutes" },
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      type: "",
      duration: "",
      dateMode: "all",
      dateFrom: "",
      dateTo: "",
    });
  };

  const hasActiveFilters =
    filters.type || filters.duration || filters.dateFrom || filters.dateTo;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-end gap-2 sm:gap-3">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Clear filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-md transition-all duration-200 text-sm ${
              isExpanded || hasActiveFilters
                ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Filter</span>
            {hasActiveFilters && (
              <div className="w-1.5 h-1.5 bg-primary-500 dark:bg-primary-400 rounded-full ml-1"></div>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Filters Dropdown */}
      {isExpanded && (
        <div className="absolute right-0 sm:right-0 left-0 sm:left-auto top-full mt-2 w-full sm:w-72 lg:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg z-50 animate-in slide-in-from-top-1 duration-200">
          <div className="space-y-4">
            {/* Workout Type Filter */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Dumbbell className="w-4 h-4" />
                <span>Workout Type</span>
              </label>
              <CustomSelect
                value={filters.type}
                onChange={(value) => handleFilterChange("type", value)}
                options={workoutTypes}
                placeholder="Select workout type"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Duration Filter */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Clock className="w-4 h-4" />
                <span>Duration</span>
              </label>
              <CustomSelect
                value={filters.duration}
                onChange={(value) => handleFilterChange("duration", value)}
                options={durationOptions}
                placeholder="Select duration"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Date Filter */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </label>

              {/* Date Mode Selection */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                <button
                  onClick={() => handleFilterChange("dateMode", "all")}
                  className={`px-2 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                    filters.dateMode === "all"
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  All Time
                </button>
                <button
                  onClick={() => handleFilterChange("dateMode", "single")}
                  className={`px-2 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                    filters.dateMode === "single"
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Single Day
                </button>
                <button
                  onClick={() => handleFilterChange("dateMode", "range")}
                  className={`px-2 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                    filters.dateMode === "range"
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Date Range
                </button>
              </div>

              {/* Date Inputs */}
              {filters.dateMode === "single" && (
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => {
                    handleFilterChange("dateFrom", e.target.value);
                    handleFilterChange("dateTo", e.target.value);
                  }}
                  className="w-full py-3 pl-3 pr-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              )}

              {filters.dateMode === "range" && (
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                    placeholder="From date"
                    className="w-full py-3 pl-3 pr-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    placeholder="To date"
                    className="w-full py-3 pl-3 pr-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Active filters:</p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {filters.type && (
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Type:{" "}
                    {workoutTypes.find((t) => t.value === filters.type)?.label}
                  </span>
                )}
                {filters.duration && (
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Duration:{" "}
                    {
                      durationOptions.find((d) => d.value === filters.duration)
                        ?.label
                    }
                  </span>
                )}
                {filters.dateFrom && (
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    📅{" "}
                    {filters.dateMode === "single"
                      ? format(new Date(filters.dateFrom), "MMM d")
                      : `${format(new Date(filters.dateFrom), "MMM d")} - ${
                          filters.dateTo
                            ? format(new Date(filters.dateTo), "MMM d")
                            : "..."
                        }`}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Filter Chips (always visible) */}
      {!isExpanded && hasActiveFilters && (
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
          {filters.type && (
            <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {workoutTypes.find((t) => t.value === filters.type)?.icon}{" "}
              {workoutTypes.find((t) => t.value === filters.type)?.label}
            </span>
          )}
          {filters.duration && (
            <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              ⏱️{" "}
              {durationOptions.find((d) => d.value === filters.duration)?.label}
            </span>
          )}
          {filters.dateFrom && (
            <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              📅{" "}
              {filters.dateMode === "single"
                ? format(new Date(filters.dateFrom), "MMM d")
                : `${format(new Date(filters.dateFrom), "MMM d")} - ${
                    filters.dateTo
                      ? format(new Date(filters.dateTo), "MMM d")
                      : "..."
                  }`}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutFilters;
