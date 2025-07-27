import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Dumbbell,
  Filter,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import Button from "../ui/Button";

const MobileFilterSheet = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  workoutTypeStats,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Prevent body scrolling when filter sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters = {
      type: "",
      duration: "",
      dateMode: "all",
      dateFrom: "",
      dateTo: "",
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    localFilters.type ||
    localFilters.duration ||
    localFilters.dateFrom ||
    localFilters.dateTo;

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.type) count++;
    if (localFilters.duration) count++;
    if (localFilters.dateFrom) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="relative w-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out max-h-[90vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2 flex-shrink-0">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Filter Workouts
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getActiveFilterCount()} active filters
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 min-h-0">
          {/* Workout Type Filter */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Dumbbell className="w-5 h-5 text-primary-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Workout Type
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {workoutTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleFilterChange("type", type.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    localFilters.type === type.value
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Filter */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Duration
              </h4>
            </div>
            <div className="space-y-2">
              {durationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange("duration", option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    localFilters.duration === option.value
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    {localFilters.duration === option.value && (
                      <Check className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Date Range
              </h4>
            </div>

            {/* Date Mode Selection */}
            <div className="flex space-x-2">
              {[
                { value: "all", label: "All Time" },
                { value: "single", label: "Single Day" },
                { value: "range", label: "Date Range" },
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => handleFilterChange("dateMode", mode.value)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    localFilters.dateMode === mode.value
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Date Inputs */}
            {localFilters.dateMode === "single" && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Date
                </label>
                <input
                  type="date"
                  value={localFilters.dateFrom}
                  onChange={(e) => {
                    handleFilterChange("dateFrom", e.target.value);
                    handleFilterChange("dateTo", e.target.value);
                  }}
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}

            {localFilters.dateMode === "range" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={localFilters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={localFilters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
          <div className="flex space-x-3">
            <Button
              onClick={clearFilters}
              variant="ghost"
              className="flex-1"
              disabled={!hasActiveFilters}
            >
              Clear All
            </Button>
            <Button onClick={applyFilters} variant="primary" className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterSheet;
