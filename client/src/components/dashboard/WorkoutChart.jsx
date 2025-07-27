import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const WorkoutChart = ({ data, type = "doughnut", title }) => {
  if (
    !data ||
    (Array.isArray(data) && data.length === 0) ||
    (typeof data === "object" && Object.keys(data).length === 0)
  ) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {title}
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              No data available
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Start logging workouts to see your distribution
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Modern soft color palette for light and dark modes
  const workoutTypeColors = {
    cardio: {
      gradient: "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)",
      solid: "#818cf8",
      light: "#f0f3ff",
      dark: "#6366f1",
    },
    strength: {
      gradient: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
      solid: "#f472b6",
      light: "#fef7ff",
      dark: "#db2777",
    },
    flexibility: {
      gradient: "linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%)",
      solid: "#60a5fa",
      light: "#f0fdff",
      dark: "#2563eb",
    },
    sports: {
      gradient: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
      solid: "#34d399",
      light: "#f0fff4",
      dark: "#059669",
    },
    yoga: {
      gradient: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
      solid: "#f97316",
      light: "#fff9f0",
      dark: "#ea580c",
    },
    gym: {
      gradient: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
      solid: "#a78bfa",
      light: "#f8ffff",
      dark: "#7c3aed",
    },
    run: {
      gradient: "linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)",
      solid: "#fb7185",
      light: "#fff8f0",
      dark: "#e11d48",
    },
    cycling: {
      gradient: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
      solid: "#4ade80",
      light: "#f8fffe",
      dark: "#16a34a",
    },
    swimming: {
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      solid: "#06b6d4",
      light: "#faf8ff",
      dark: "#0e7490",
    },
    other: {
      gradient: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
      solid: "#94a3b8",
      light: "#fffaff",
      dark: "#475569",
    },
  };

  const getWorkoutIcon = (type) => {
    const icons = {
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
    return icons[type] || "🏃‍♂️";
  };

  const getDoughnutData = () => {
    if (typeof data !== "object" || Array.isArray(data)) {
      return { labels: [], datasets: [{ data: [] }] };
    }

    const labels = Object.keys(data);
    const values = Object.values(data);
    const colors = labels.map((label) => {
      const colorConfig = workoutTypeColors[label];
      return isDarkMode
        ? colorConfig?.dark || "#6b7280"
        : colorConfig?.solid || "#6b7280";
    });

    return {
      labels: labels.map(
        (label) => label.charAt(0).toUpperCase() + label.slice(1)
      ),
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: isDarkMode ? "#374151" : "#ffffff",
          borderWidth: 3,
          hoverBackgroundColor: colors.map((color) => color + "E6"),
          hoverBorderWidth: 4,
          cutout: "65%",
        },
      ],
    };
  };

  const getBarData = () => {
    if (!Array.isArray(data)) {
      return { labels: [], datasets: [{ data: [] }] };
    }

    const labels = data.map((item) => {
      const date = new Date(item.month + "-01");
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    });

    return {
      labels,
      datasets: [
        {
          label: "Workouts",
          data: data.map((item) => item.workouts),
          backgroundColor: isDarkMode
            ? "rgba(129, 140, 248, 0.8)"
            : "rgba(99, 102, 241, 0.8)",
          borderColor: isDarkMode ? "#818cf8" : "#6366f1",
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: "Duration (hours)",
          data: data.map((item) => Math.round(item.duration / 60)),
          backgroundColor: isDarkMode
            ? "rgba(52, 211, 153, 0.8)"
            : "rgba(34, 197, 94, 0.8)",
          borderColor: isDarkMode ? "#34d399" : "#22c55e",
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  };

  const getTotalWorkouts = () => {
    if (typeof data === "object" && !Array.isArray(data)) {
      return Object.values(data).reduce((sum, count) => sum + count, 0);
    }
    return 0;
  };

  // Check if dark mode is active
  const isDarkMode = document.documentElement.classList.contains("dark");

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: window.devicePixelRatio || 2,
    plugins: {
      legend: {
        display: type !== "doughnut",
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          color: isDarkMode ? "#d1d5db" : "#374151",
          font: {
            size: 13,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: isDarkMode
          ? "rgba(31, 41, 55, 0.95)"
          : "rgba(0, 0, 0, 0.8)",
        titleColor: isDarkMode ? "#f9fafb" : "white",
        bodyColor: isDarkMode ? "#d1d5db" : "white",
        borderColor: isDarkMode
          ? "rgba(75, 85, 99, 0.3)"
          : "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            if (type === "doughnut") {
              const total = getTotalWorkouts();
              const percentage =
                total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
              return `${context.label}: ${context.parsed} workouts (${percentage}%)`;
            }
            const value = context.parsed.y || context.parsed;
            if (context.dataset.label.includes("Duration")) {
              return `${context.dataset.label}: ${value} hours`;
            }
            return `${context.dataset.label}: ${value} workouts`;
          },
        },
      },
    },
    ...(type === "bar" && {
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: isDarkMode ? "#9ca3af" : "#6b7280",
            font: {
              size: 12,
              weight: "500",
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: isDarkMode
              ? "rgba(156, 163, 175, 0.1)"
              : "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            color: isDarkMode ? "#9ca3af" : "#6b7280",
            font: {
              size: 12,
              weight: "500",
            },
          },
        },
      },
    }),
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  const chartData = type === "doughnut" ? getDoughnutData() : getBarData();

  if (type === "doughnut") {
    const totalWorkouts = getTotalWorkouts();
    const dataEntries = Object.entries(data || {});

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalWorkouts}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Workouts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Chart */}
          <div className="relative">
            <div className="chart-container-modern">
              <Doughnut data={chartData} options={chartOptions} />

              {/* Center Label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {totalWorkouts}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Workouts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {dataEntries.map(([type, count]) => {
              const percentage =
                totalWorkouts > 0
                  ? ((count / totalWorkouts) * 100).toFixed(1)
                  : 0;
              const colorConfig =
                workoutTypeColors[type] || workoutTypeColors.other;

              return (
                <div
                  key={type}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colorConfig.solid }}
                    ></div>
                    <span className="text-2xl">{getWorkoutIcon(type)}</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {count}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {title}
      </h3>
      <div className="chart-container-modern">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default WorkoutChart;
