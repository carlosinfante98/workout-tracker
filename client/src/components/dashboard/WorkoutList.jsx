import React, { useState } from "react";
import {
  Activity,
  Plus,
  Calendar,
  Clock,
  FileText,
  Zap,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import Button from "../ui/Button";
import WorkoutFilters from "./WorkoutFilters";
import MobileFilterSheet from "./MobileFilterSheet";

const WorkoutList = ({
  workouts,
  filteredWorkouts,
  getWorkoutTypeIcon,
  getWorkoutTypeColor,
  onNewWorkout,
  filters,
  onFiltersChange,
  workoutTypeStats,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const workoutsToShow = filteredWorkouts || workouts;
  const isFiltered =
    filteredWorkouts && filteredWorkouts.length !== workouts.length;

  const hasActiveFilters =
    filters.type || filters.duration || filters.dateFrom || filters.dateTo;

  // Modern softer gradient color palette (matching the chart)
  const getModernWorkoutColor = (type) => {
    const colors = {
      cardio: {
        gradient: "from-indigo-300 to-purple-400",
        bg: "bg-gradient-to-br from-indigo-50 to-purple-50",
        border: "border-indigo-200",
        text: "text-indigo-700",
        icon: "bg-gradient-to-br from-indigo-300 to-purple-400",
      },
      strength: {
        gradient: "from-pink-300 to-rose-400",
        bg: "bg-gradient-to-br from-pink-50 to-rose-50",
        border: "border-pink-200",
        text: "text-pink-700",
        icon: "bg-gradient-to-br from-pink-300 to-rose-400",
      },
      flexibility: {
        gradient: "from-blue-300 to-cyan-400",
        bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
        border: "border-blue-200",
        text: "text-blue-700",
        icon: "bg-gradient-to-br from-blue-300 to-cyan-400",
      },
      sports: {
        gradient: "from-emerald-300 to-teal-400",
        bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        icon: "bg-gradient-to-br from-emerald-300 to-teal-400",
      },
      yoga: {
        gradient: "from-violet-300 to-purple-400",
        bg: "bg-gradient-to-br from-violet-50 to-purple-50",
        border: "border-violet-200",
        text: "text-violet-700",
        icon: "bg-gradient-to-br from-violet-300 to-purple-400",
      },
      gym: {
        gradient: "from-amber-300 to-orange-400",
        bg: "bg-gradient-to-br from-amber-50 to-orange-50",
        border: "border-amber-200",
        text: "text-amber-700",
        icon: "bg-gradient-to-br from-amber-300 to-orange-400",
      },
      run: {
        gradient: "from-orange-300 to-red-400",
        bg: "bg-gradient-to-br from-orange-50 to-red-50",
        border: "border-orange-200",
        text: "text-orange-700",
        icon: "bg-gradient-to-br from-orange-300 to-red-400",
      },
      cycling: {
        gradient: "from-green-300 to-emerald-400",
        bg: "bg-gradient-to-br from-green-50 to-emerald-50",
        border: "border-green-200",
        text: "text-green-700",
        icon: "bg-gradient-to-br from-green-300 to-emerald-400",
      },
      swimming: {
        gradient: "from-purple-300 to-indigo-400",
        bg: "bg-gradient-to-br from-purple-50 to-indigo-50",
        border: "border-purple-200",
        text: "text-purple-700",
        icon: "bg-gradient-to-br from-purple-300 to-indigo-400",
      },
      other: {
        gradient: "from-gray-300 to-slate-400",
        bg: "bg-gradient-to-br from-gray-50 to-slate-50",
        border: "border-gray-200",
        text: "text-gray-700",
        icon: "bg-gradient-to-br from-gray-300 to-slate-400",
      },
    };
    return colors[type] || colors.other;
  };

  const getWorkoutEmoji = (type) => {
    const emojis = {
      cardio: "🏃",
      strength: "💪",
      flexibility: "🧘",
      sports: "⚽",
      yoga: "🧘‍♀️",
      gym: "🏋️",
      run: "🏃‍♂️",
      cycling: "🚴",
      swimming: "🏊",
      other: "🏃‍♂️",
    };
    return emojis[type] || "🏃‍♂️";
  };

  const formatWorkoutDate = (workoutDate) => {
    if (!workoutDate) return "Invalid date";
    try {
      const dateOnly = workoutDate.split("T")[0];
      const [year, month, day] = dateOnly.split("-");
      const localDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
      return format(localDate, "MMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  if (!workoutsToShow || workoutsToShow.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        {/* Mobile-Friendly Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {/* Mobile Header */}
          <div className="sm:hidden px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Title & Icon */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Recent Workouts
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {workouts.length}{" "}
                    {workouts.length === 1 ? "workout" : "workouts"}
                  </p>
                </div>
              </div>

              {/* Right: Icon Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                    hasActiveFilters
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  {hasActiveFilters && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-500 dark:bg-primary-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </button>

                <Button
                  onClick={onNewWorkout}
                  variant="success"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:block px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Left: Title & Stats */}
              <div className="flex items-center space-x-4 min-w-0 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <Activity className="w-6 h-6 text-white relative z-10" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Recent Workouts
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-1">
                    {workouts.length}{" "}
                    {workouts.length === 1 ? "workout" : "workouts"}
                  </p>
                </div>
              </div>

              {/* Right: Controls */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <WorkoutFilters
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  workoutTypeStats={workoutTypeStats}
                />
                <Button
                  onClick={onNewWorkout}
                  variant="success"
                  className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Workout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Activity className="w-10 h-10 text-gray-500 dark:text-gray-400" />
          </div>

          {isFiltered ? (
            <>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                No workouts found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Try adjusting your filters to see more workouts, or log a new
                one to get started
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={onNewWorkout} variant="success" size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Log New Workout
                </Button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                No workouts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Start your fitness journey by logging your first workout and
                track your progress
              </p>
              <Button onClick={onNewWorkout} variant="success" size="lg">
                <Zap className="w-5 h-5 mr-2" />
                Log Your First Workout
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Mobile-Friendly Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {/* Mobile Header */}
        <div className="sm:hidden px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Title & Icon */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recent Workouts
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isFiltered
                    ? `${workoutsToShow.length} of ${workouts.length} workouts`
                    : `${workoutsToShow.length} ${
                        workoutsToShow.length === 1 ? "workout" : "workouts"
                      }`}
                </p>
              </div>
            </div>

            {/* Right: Icon Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                  hasActiveFilters
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Filter className="w-5 h-5" />
                {hasActiveFilters && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-500 dark:bg-primary-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </button>

              <Button
                onClick={onNewWorkout}
                variant="success"
                size="sm"
                className="w-10 h-10 p-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Left: Title & Stats */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <Activity className="w-6 h-6 text-white relative z-10" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Recent Workouts
                  </h2>
                  {isFiltered && (
                    <span className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full border border-primary-200 dark:border-primary-800">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                      Filtered
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-1 sm:mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {isFiltered
                      ? `${workoutsToShow.length} of ${workouts.length} workouts`
                      : `${workoutsToShow.length} ${
                          workoutsToShow.length === 1 ? "workout" : "workouts"
                        }`}
                  </p>
                  {workoutsToShow.length > 0 && (
                    <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                      <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                      <span>
                        Last updated: {format(new Date(), "MMM d, h:mm a")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <WorkoutFilters
                filters={filters}
                onFiltersChange={onFiltersChange}
                workoutTypeStats={workoutTypeStats}
              />
              <Button
                onClick={onNewWorkout}
                variant="success"
                className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Workout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Column Headers */}
      <div className="hidden sm:flex items-center justify-between px-4 sm:px-6 py-3 bg-gray-50/80 dark:bg-gray-700/40 backdrop-blur-sm border-t border-gray-100 dark:border-gray-600/50">
        <div className="flex items-center space-x-4">
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            Activity
          </span>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Type & Details
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            Duration
          </span>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Minutes
          </span>
        </div>
      </div>

      {/* Workout List */}
      <div className="divide-y divide-gray-100">
        {workoutsToShow.slice(0, 20).map((workout, index) => {
          const colorConfig = getModernWorkoutColor(workout.workoutType);

          return (
            <div
              key={workout.id || index}
              className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left side - Icon and details */}
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  {/* Workout Type Icon */}
                  <div
                    className={`w-14 h-14 ${colorConfig.icon} rounded-2xl flex items-center justify-center text-white text-2xl shadow-md group-hover:shadow-lg transition-all duration-300 flex-shrink-0 relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <span className="relative z-10">
                      {getWorkoutEmoji(workout.workoutType)}
                    </span>
                  </div>

                  {/* Workout Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white capitalize text-lg group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                          {workout.workoutType}
                        </h4>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="font-medium">
                            {formatWorkoutDate(workout.workoutDate)}
                          </span>
                        </div>
                      </div>

                      {/* Duration badge - mobile version */}
                      <div className="sm:hidden">
                        <div className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-500">
                          <div className="text-center">
                            <div className="font-semibold text-sm">
                              {workout.durationMinutes}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              min
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {workout.notes && (
                      <div className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-xl group-hover:bg-white/70 dark:group-hover:bg-gray-600/70 transition-colors">
                        <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                        <p className="line-clamp-2 break-words leading-relaxed">
                          {workout.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - Duration badge - desktop version */}
                <div className="hidden sm:block text-right flex-shrink-0">
                  <div className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                    <div className="text-center">
                      <div className="font-semibold text-lg">
                        {workout.durationMinutes}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        minutes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more indicator */}
      {workoutsToShow.length > 20 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium text-gray-600">
              Showing first 20 workouts of {workoutsToShow.length} total
            </p>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFiltersChange={onFiltersChange}
        workoutTypeStats={workoutTypeStats}
      />
    </div>
  );
};

export default WorkoutList;
