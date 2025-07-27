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
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
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
            <p className="text-sm font-medium text-gray-600">
              No data available
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Start logging workouts to see your distribution
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Modern gradient color palette
  const workoutTypeColors = {
    cardio: {
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      solid: "#667eea",
      light: "#f0f3ff",
    },
    strength: {
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      solid: "#f093fb",
      light: "#fef7ff",
    },
    flexibility: {
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      solid: "#4facfe",
      light: "#f0fdff",
    },
    sports: {
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      solid: "#43e97b",
      light: "#f0fff4",
    },
    yoga: {
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      solid: "#fa709a",
      light: "#fff9f0",
    },
    gym: {
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      solid: "#a8edea",
      light: "#f8ffff",
    },
    run: {
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      solid: "#fcb69f",
      light: "#fff8f0",
    },
    cycling: {
      gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
      solid: "#84fab0",
      light: "#f8fffe",
    },
    swimming: {
      gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
      solid: "#a18cd1",
      light: "#faf8ff",
    },
    other: {
      gradient: "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
      solid: "#fad0c4",
      light: "#fffaff",
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
    const colors = labels.map(
      (label) => workoutTypeColors[label]?.solid || "#6b7280"
    );

    return {
      labels: labels.map(
        (label) => label.charAt(0).toUpperCase() + label.slice(1)
      ),
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: "#ffffff",
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
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "#3b82f6",
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: "Duration (hours)",
          data: data.map((item) => Math.round(item.duration / 60)),
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderColor: "#10b981",
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
          font: {
            size: 13,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
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
            font: {
              size: 12,
              weight: "500",
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
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
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{totalWorkouts}</p>
            <p className="text-sm text-gray-500">Total Workouts</p>
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
                  <p className="text-3xl font-bold text-gray-900">
                    {totalWorkouts}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">Workouts</p>
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
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colorConfig.solid }}
                    ></div>
                    <span className="text-2xl">{getWorkoutIcon(type)}</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">{percentage}%</p>
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
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
      <div className="chart-container-modern">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default WorkoutChart;
