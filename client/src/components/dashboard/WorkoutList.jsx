import React from "react";
import { Activity, Plus, Calendar, Clock, FileText } from "lucide-react";
import { format } from "date-fns";
import Button from "../ui/Button";

const WorkoutList = ({
  workouts,
  filteredWorkouts,
  getWorkoutTypeIcon,
  getWorkoutTypeColor,
  onNewWorkout,
  filters,
}) => {
  const workoutsToShow = filteredWorkouts || workouts;
  const isFiltered =
    filteredWorkouts && filteredWorkouts.length !== workouts.length;

  const formatWorkoutDate = (workoutDate) => {
    if (!workoutDate) return "Invalid date";
    try {
      // Extract just the date part to avoid timezone issues
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-gray-400" />
          </div>

          {isFiltered ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No workouts found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your filters to see more workouts
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={onNewWorkout}
                  className="bg-primary-500 hover:bg-primary-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log New Workout
                </Button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No workouts yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start your fitness journey by logging your first workout
              </p>
              <Button
                onClick={onNewWorkout}
                className="bg-primary-500 hover:bg-primary-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Your First Workout
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary-500" />
              <span className="font-medium text-gray-900">
                {isFiltered
                  ? `${workoutsToShow.length} of ${workouts.length} workouts`
                  : `${workoutsToShow.length} workouts`}
              </span>
            </div>
            {isFiltered && (
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                Filtered
              </span>
            )}
          </div>
          <Button
            onClick={onNewWorkout}
            size="sm"
            className="bg-primary-500 hover:bg-primary-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>
      </div>

      {/* Workout List */}
      <div className="divide-y divide-gray-200">
        {workoutsToShow.slice(0, 20).map((workout, index) => (
          <div
            key={workout.id || index}
            className="p-6 hover:bg-gray-50 transition-colors duration-200 group"
          >
            <div className="flex items-start justify-between">
              {/* Left side - Icon and details */}
              <div className="flex items-start space-x-4 flex-1">
                {/* Workout Type Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-sm ${getWorkoutTypeColor(
                    workout.workoutType
                  )} group-hover:shadow-md transition-shadow`}
                >
                  {getWorkoutTypeIcon(workout.workoutType)}
                </div>

                {/* Workout Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900 capitalize text-lg">
                      {workout.workoutType}
                    </h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {workout.durationMinutes} min
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatWorkoutDate(workout.workoutDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{workout.durationMinutes} minutes</span>
                    </div>
                  </div>

                  {workout.notes && (
                    <div className="flex items-start space-x-1 text-sm text-gray-600">
                      <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="line-clamp-2 break-words">
                        {workout.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right side - Duration badge */}
              <div className="text-right ml-4 flex-shrink-0">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1 rounded-lg shadow-sm">
                  <span className="font-bold text-lg">
                    {workout.durationMinutes}
                  </span>
                  <span className="text-xs ml-1 opacity-90">min</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show more indicator */}
      {workoutsToShow.length > 20 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-sm text-gray-500">
            Showing first 20 workouts of {workoutsToShow.length} total
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
