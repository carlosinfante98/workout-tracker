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

const WorkoutFilters = ({ filters, onFiltersChange, workoutTypeStats }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const workoutTypes = [
    { value: "", label: "All Types", icon: "🏃‍♂️" },
    { value: "gym", label: "Gym", icon: "🏋️‍♂️" },
    { value: "run", label: "Running", icon: "🏃‍♂️" },
    { value: "cardio", label: "Cardio", icon: "💓" },
    { value: "strength", label: "Strength", icon: "💪" },
    { value: "yoga", label: "Yoga", icon: "🧘‍♀️" },
    { value: "cycling", label: "Cycling", icon: "🚴‍♂️" },
    { value: "swimming", label: "Swimming", icon: "🏊‍♂️" },
    { value: "sports", label: "Sports", icon: "⚽" },
    { value: "other", label: "Other", icon: "🏃‍♂️" },
  ];

  const durationOptions = [
    { value: "", label: "Any Duration" },
    { value: "0-30", label: "Under 30 min" },
    { value: "30-60", label: "30-60 min" },
    { value: "60-90", label: "60-90 min" },
    { value: "90+", label: "90+ min" },
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      type: "",
      duration: "",
      dateFrom: "",
      dateTo: "",
      dateMode: "all", // all, single, range
    });
    setIsExpanded(false);
  };

  const hasActiveFilters =
    filters.type || filters.duration || filters.dateFrom || filters.dateTo;

  return (
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Workouts</h3>
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isExpanded || hasActiveFilters
                ? "bg-primary-100 text-primary-700 border border-primary-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
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
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-4 animate-in slide-in-from-top-1 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Workout Type Filter */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Dumbbell className="w-4 h-4" />
                <span>Workout Type</span>
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {workoutTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4" />
                <span>Duration</span>
              </label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange("duration", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {durationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </label>

              {/* Date Mode Selection */}
              <div className="flex space-x-2 mb-3">
                <button
                  onClick={() => handleFilterChange("dateMode", "all")}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filters.dateMode === "all"
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All Time
                </button>
                <button
                  onClick={() => handleFilterChange("dateMode", "single")}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filters.dateMode === "single"
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Single Day
                </button>
                <button
                  onClick={() => handleFilterChange("dateMode", "range")}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    placeholder="To date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                    {filters.dateMode === "single"
                      ? `Date: ${format(
                          new Date(filters.dateFrom),
                          "MMM d, yyyy"
                        )}`
                      : `From: ${format(
                          new Date(filters.dateFrom),
                          "MMM d, yyyy"
                        )}`}
                  </span>
                )}
                {filters.dateTo && filters.dateMode === "range" && (
                  <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    To: {format(new Date(filters.dateTo), "MMM d, yyyy")}
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
