import React, { useState, useEffect, useMemo } from "react";
import { Plus, Activity, Clock, Zap, Target, Calendar } from "lucide-react";
import { useWorkoutStore } from "../store/workoutStore";
import useAuthStore from "../store/authStore";
import Navbar from "../components/dashboard/Navbar";
import StatsCard from "../components/dashboard/StatsCard";
import WorkoutForm from "../components/dashboard/WorkoutForm";
import WorkoutChart from "../components/dashboard/WorkoutChart";
import WorkoutFilters from "../components/dashboard/WorkoutFilters";
import WorkoutList from "../components/dashboard/WorkoutList";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import WelcomeDialog from "../components/ui/WelcomeDialog";
import { format, parseISO } from "date-fns";

const Dashboard = () => {
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeUserName, setWelcomeUserName] = useState("");

  // Workout filters state
  const [filters, setFilters] = useState({
    type: "",
    duration: "",
    dateFrom: "",
    dateTo: "",
    dateMode: "all", // all, single, range
  });

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

  // Filter workouts based on current filters
  const filteredWorkouts = useMemo(() => {
    if (!workouts) return [];

    return workouts.filter((workout) => {
      // Type filter
      if (filters.type && workout.workoutType !== filters.type) {
        return false;
      }

      // Duration filter
      if (filters.duration) {
        const duration = workout.durationMinutes;
        switch (filters.duration) {
          case "0-30":
            if (duration > 30) return false;
            break;
          case "30-60":
            if (duration <= 30 || duration > 60) return false;
            break;
          case "60-90":
            if (duration <= 60 || duration > 90) return false;
            break;
          case "90+":
            if (duration <= 90) return false;
            break;
        }
      }

      // Date filter
      if (filters.dateMode !== "all" && (filters.dateFrom || filters.dateTo)) {
        const workoutDate = workout.workoutDate
          ? workout.workoutDate.split("T")[0]
          : null;
        if (!workoutDate) return false;

        if (filters.dateMode === "single" && filters.dateFrom) {
          if (workoutDate !== filters.dateFrom) return false;
        } else if (filters.dateMode === "range") {
          if (filters.dateFrom && workoutDate < filters.dateFrom) return false;
          if (filters.dateTo && workoutDate > filters.dateTo) return false;
        }
      }

      return true;
    });
  }, [workouts, filters]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-8 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="pr-4 w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 sm:mt-1 text-sm sm:text-base">
              Welcome back,{" "}
              <span className="break-words">
                {user?.user_metadata?.full_name?.split(" ")[0] ||
                  user?.email?.split("@")[0] ||
                  "there"}
              </span>
              !
            </p>
          </div>
          <Button
            onClick={() => setShowWorkoutForm(true)}
            variant="success"
            className="mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Log Workout</span>
            <span className="sm:hidden">Add</span>
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

        {/* Recent Workouts with Filters */}
        <WorkoutList
          workouts={workouts}
          filteredWorkouts={filteredWorkouts}
          getWorkoutTypeIcon={getWorkoutTypeIcon}
          getWorkoutTypeColor={getWorkoutTypeColor}
          onNewWorkout={() => setShowWorkoutForm(true)}
          filters={filters}
          onFiltersChange={setFilters}
          workoutTypeStats={stats?.workoutTypes}
        />
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
