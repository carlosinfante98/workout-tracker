import React, { useState } from "react";
import { Activity, Users, Trophy, TrendingUp, Play } from "lucide-react";
import useAuthStore from "../store/authStore";
import AuthModal from "../components/auth/AuthModal";
import ThemeToggle from "../components/ui/ThemeToggle";
import Button from "../components/ui/Button";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuthStore();

  const features = [
    {
      icon: <Activity className="w-8 h-8 text-primary-500" />,
      title: "Track Your Workouts",
      description:
        "Log multiple workout types with duration and notes. Keep track of your fitness journey.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-secondary-500" />,
      title: "Monitor Progress",
      description:
        "View detailed analytics, charts, and statistics to track your fitness improvements.",
    },
    {
      icon: <Trophy className="w-8 h-8 text-accent-500" />,
      title: "Build Streaks",
      description:
        "Stay motivated with streak tracking and achieve your fitness goals consistently.",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Personal Dashboard",
      description:
        "Access your personalized dashboard with insights and workout history.",
    },
  ];

  const workoutTypes = [
    { type: "gym", icon: "🏋️‍♂️", name: "Gym", color: "bg-red-500" },
    { type: "run", icon: "🏃‍♂️", name: "Running", color: "bg-blue-500" },
    { type: "yoga", icon: "🧘‍♀️", name: "Yoga", color: "bg-green-500" },
    { type: "cycling", icon: "🚴‍♂️", name: "Cycling", color: "bg-yellow-500" },
    { type: "swimming", icon: "🏊‍♂️", name: "Swimming", color: "bg-cyan-500" },
    { type: "sports", icon: "⚽", name: "Sports", color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-primary-500 dark:text-primary-400 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                FitTracker
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 dark:text-gray-300">
                    Welcome, {user.fullName}!
                  </span>
                  <Button
                    variant="primary"
                    onClick={() => (window.location.href = "/dashboard")}
                  >
                    Dashboard
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setShowAuthModal(true)}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Transform Your{" "}
              <span className="text-primary-500 dark:text-primary-400">
                Fitness Journey
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Track your workouts, monitor your progress, and achieve your
              fitness goals with our comprehensive workout tracking platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-4"
                onClick={() => setShowAuthModal(true)}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Tracking
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Stay Fit
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Powerful features to help you track, analyze, and improve your
              fitness routine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-600 rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workout Types Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Support for All Workout Types
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Track any type of exercise with our flexible workout logging
              system
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {workoutTypes.map((workout, index) => (
              <div key={index} className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${workout.color} rounded-lg mb-3 text-white text-2xl animate-bounce-subtle`}
                >
                  {workout.icon}
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {workout.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-500 dark:bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-primary-100 dark:text-primary-200">
                Workouts Tracked
              </div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100 dark:text-primary-200">
                Active Users
              </div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-primary-100 dark:text-primary-200">
                Goal Achievement
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Start Your Fitness Journey?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of users who are already tracking their workouts and
            achieving their fitness goals.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-4"
            onClick={() => setShowAuthModal(true)}
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12 border-t border-gray-700 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Activity className="w-8 h-8 text-primary-500 dark:text-primary-400 mr-2" />
              <span className="text-xl font-bold">FitTracker</span>
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-sm">
              © 2024 FitTracker. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default LandingPage;
