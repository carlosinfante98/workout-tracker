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
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const workoutTypeColors = {
    gym: "#ef4444",
    run: "#3b82f6",
    cardio: "#ec4899",
    strength: "#8b5cf6",
    yoga: "#10b981",
    cycling: "#f59e0b",
    swimming: "#06b6d4",
    sports: "#f97316",
    other: "#6b7280",
  };

  const getDoughnutData = () => {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const colors = labels.map((label) => workoutTypeColors[label] || "#6b7280");

    return {
      labels: labels.map(
        (label) => label.charAt(0).toUpperCase() + label.slice(1)
      ),
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: colors.map((color) => color + "80"),
          borderWidth: 2,
        },
      ],
    };
  };

  const getBarData = () => {
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
          backgroundColor: "#3b82f6",
          borderColor: "#2563eb",
          borderWidth: 1,
        },
        {
          label: "Duration (hours)",
          data: data.map((item) => Math.round(item.duration / 60)),
          backgroundColor: "#10b981",
          borderColor: "#059669",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (type === "doughnut") {
              return `${context.label}: ${context.parsed} workouts`;
            }
            return `${context.dataset.label}: ${context.parsed}`;
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
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
      },
    }),
  };

  const chartData = type === "doughnut" ? getDoughnutData() : getBarData();

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="chart-container">
        {type === "doughnut" ? (
          <Doughnut data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default WorkoutChart;
