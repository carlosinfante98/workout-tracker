import React, { useState, useEffect } from "react";
import { Plus, Activity, Clock, Zap, Target, Calendar } from "lucide-react";
import { useWorkoutStore } from "../store/workoutStore";
import useAuthStore from "../store/authStore";
import Navbar from "../components/dashboard/Navbar";
import StatsCard from "../components/dashboard/StatsCard";
import WorkoutForm from "../components/dashboard/WorkoutForm";
import WorkoutChart from "../components/dashboard/WorkoutChart";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import WelcomeDialog from "../components/ui/WelcomeDialog";
import { format } from "date-fns";

const Dashboard = () => {
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeUserName, setWelcomeUserName] = useState("");
  const { user } = useAuthStore();
  const {
    workouts,
    stats,
    monthlyData,
    isLoading,
    error,
    fetchDashboardData,
    getWorkoutTypeIcon,
    getWorkoutTypeColor,
  } = useWorkoutStore();

  useEffect(() => {
    fetchDashboardData();

    // Check for welcome message after registration
    const shouldShowWelcome = localStorage.getItem("showWelcome");
    const userName = localStorage.getItem("welcomeUserName");

    if (shouldShowWelcome === "true" && userName) {
      setWelcomeUserName(userName);
      setShowWelcome(true);

      // Clear the flags so we don't show it again
      localStorage.removeItem("showWelcome");
      localStorage.removeItem("welcomeUserName");
    }
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    setWelcomeUserName("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchDashboardData()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.fullName}!
            </p>
          </div>
          <Button
            onClick={() => setShowWorkoutForm(true)}
            className="mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Workout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Workouts"
            value={stats?.totalWorkouts || 0}
            icon={<Activity className="w-6 h-6" />}
            color="primary"
          />
          <StatsCard
            title="Total Duration"
            value={stats?.totalDuration || 0}
            subtitle="minutes"
            icon={<Clock className="w-6 h-6" />}
            color="secondary"
          />
          <StatsCard
            title="Current Streak"
            value={stats?.currentStreak || 0}
            subtitle="days"
            icon={<Zap className="w-6 h-6" />}
            color="accent"
          />
          <StatsCard
            title="Longest Streak"
            value={stats?.longestStreak || 0}
            subtitle="days"
            icon={<Target className="w-6 h-6" />}
            color="info"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <WorkoutChart
            data={stats?.workoutTypes}
            type="doughnut"
            title="Workout Distribution"
          />
          <WorkoutChart
            data={monthlyData}
            type="bar"
            title="Monthly Progress"
          />
        </div>

        {/* Recent Workouts */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Workouts
            </h3>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>

          {workouts && workouts.length > 0 ? (
            <div className="space-y-4">
              {workouts.slice(0, 10).map((workout, index) => (
                <div
                  key={workout.id || index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl ${getWorkoutTypeColor(
                        workout.workoutType
                      )}`}
                    >
                      {getWorkoutTypeIcon(workout.workoutType)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 capitalize">
                        {workout.workoutType}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {format(new Date(workout.workoutDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {workout.durationMinutes} min
                    </p>
                    {workout.notes && (
                      <p className="text-sm text-gray-600 max-w-xs truncate">
                        {workout.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No workouts yet</p>
              <Button onClick={() => setShowWorkoutForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Log Your First Workout
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Workout Form Modal */}
      <WorkoutForm
        isOpen={showWorkoutForm}
        onClose={() => setShowWorkoutForm(false)}
      />

      {/* Welcome Dialog */}
      <WelcomeDialog
        isOpen={showWelcome}
        onClose={handleWelcomeClose}
        userName={welcomeUserName}
      />
    </div>
  );
};

export default Dashboard;
