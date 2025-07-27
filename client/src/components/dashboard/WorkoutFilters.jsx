import React, { useState } from "react";
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
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Workouts</h3>
        <div className="flex items-center space-x-2 sm:space-x-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
            >
              <X className="w-3 h-3" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
              isExpanded || hasActiveFilters
                ? "bg-primary-100 text-primary-700 border border-primary-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm mb-4 animate-in slide-in-from-top-1 duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Workout Type Filter */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Dumbbell className="w-4 h-4" />
                <span>Workout Type</span>
              </label>
              <CustomSelect
                value={filters.type}
                onChange={(value) => handleFilterChange("type", value)}
                options={workoutTypes}
                placeholder="Select workout type"
              />
            </div>

            {/* Duration Filter */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4" />
                <span>Duration</span>
              </label>
              <CustomSelect
                value={filters.duration}
                onChange={(value) => handleFilterChange("duration", value)}
                options={durationOptions}
                placeholder="Select duration"
              />
            </div>

            {/* Date Filter */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </label>

              {/* Date Mode Selection */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => handleFilterChange("dateMode", "all")}
                  className={`px-2 sm:px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                    filters.dateMode === "all"
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All Time
                </button>
                <button
                  onClick={() => handleFilterChange("dateMode", "single")}
                  className={`px-2 sm:px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                    filters.dateMode === "single"
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Single Day
                </button>
                <button
                  onClick={() => handleFilterChange("dateMode", "range")}
                  className={`px-2 sm:px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                    filters.dateMode === "range"
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                  className="w-full py-3 pl-3 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                    className="w-full py-3 pl-3 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    placeholder="To date"
                    className="w-full py-3 pl-3 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Active filters:</p>
              <div className="flex flex-wrap gap-2">
                {filters.type && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Type:{" "}
                    {workoutTypes.find((t) => t.value === filters.type)?.label}
                  </span>
                )}
                {filters.duration && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Duration:{" "}
                    {
                      durationOptions.find((d) => d.value === filters.duration)
                        ?.label
                    }
                  </span>
                )}
                {filters.dateFrom && (
                  <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
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
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.type && (
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {workoutTypes.find((t) => t.value === filters.type)?.icon}{" "}
              {workoutTypes.find((t) => t.value === filters.type)?.label}
            </span>
          )}
          {filters.duration && (
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              ⏱️{" "}
              {durationOptions.find((d) => d.value === filters.duration)?.label}
            </span>
          )}
          {filters.dateFrom && (
            <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
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
