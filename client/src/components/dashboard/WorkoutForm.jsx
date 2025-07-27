import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useWorkoutStore } from "../../store/workoutStore";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Calendar from "../ui/Calendar";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  FileText,
  Activity,
  ChevronDown,
  X,
} from "lucide-react";

const WorkoutForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    workoutType: "gym",
    durationMinutes: "",
    notes: "",
    workoutDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [errors, setErrors] = useState({});
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { createWorkout, isLoading } = useWorkoutStore();

  const workoutTypes = [
    {
      value: "gym",
      label: "Gym",
      icon: "🏋️‍♂️",
      color: "from-purple-500 to-purple-600",
    },
    {
      value: "run",
      label: "Running",
      icon: "🏃‍♂️",
      color: "from-blue-500 to-blue-600",
    },
    {
      value: "cardio",
      label: "Cardio",
      icon: "💓",
      color: "from-red-500 to-red-600",
    },
    {
      value: "strength",
      label: "Strength",
      icon: "💪",
      color: "from-orange-500 to-orange-600",
    },
    {
      value: "yoga",
      label: "Yoga",
      icon: "🧘‍♀️",
      color: "from-green-500 to-green-600",
    },
    {
      value: "cycling",
      label: "Cycling",
      icon: "🚴‍♂️",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      value: "swimming",
      label: "Swimming",
      icon: "🏊‍♂️",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      value: "sports",
      label: "Sports",
      icon: "⚽",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      value: "other",
      label: "Other",
      icon: "🏃‍♂️",
      color: "from-gray-500 to-gray-600",
    },
  ];

  const selectedType = workoutTypes.find(
    (type) => type.value === formData.workoutType
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, workoutType: type.value }));
    setIsTypeDropdownOpen(false);
    if (errors.workoutType) {
      setErrors((prev) => ({ ...prev, workoutType: "" }));
    }
  };

  const handleDateSelect = (date) => {
    setFormData((prev) => ({
      ...prev,
      workoutDate: format(date, "yyyy-MM-dd"),
    }));
    if (errors.workoutDate) {
      setErrors((prev) => ({ ...prev, workoutDate: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.workoutType)
      newErrors.workoutType = "Workout type is required";
    if (!formData.durationMinutes || formData.durationMinutes <= 0) {
      newErrors.durationMinutes = "Duration must be greater than 0";
    }
    if (!formData.workoutDate)
      newErrors.workoutDate = "Workout date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await createWorkout({
      ...formData,
      durationMinutes: parseInt(formData.durationMinutes),
      workoutDate: new Date(
        formData.workoutDate + "T00:00:00.000Z"
      ).toISOString(),
    });

    if (result.success) {
      toast.success("Workout logged successfully!");
      onClose();
      resetForm();
    } else {
      toast.error(result.error);
    }
  };

  const resetForm = () => {
    setFormData({
      workoutType: "gym",
      durationMinutes: "",
      notes: "",
      workoutDate: format(new Date(), "yyyy-MM-dd"),
    });
    setErrors({});
    setIsTypeDropdownOpen(false);
    setIsCalendarOpen(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Log New Workout">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Workout Type Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              Workout Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                  errors.workoutType
                    ? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 focus:border-primary-500 dark:focus:border-primary-400"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${selectedType.color} rounded-lg flex items-center justify-center text-white text-lg shadow-sm`}
                  >
                    {selectedType.icon}
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {selectedType.label}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isTypeDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {isTypeDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-xl max-h-60 overflow-auto">
                  {workoutTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleTypeSelect(type)}
                      className={`w-full flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                        formData.workoutType === type.value
                          ? "bg-primary-50 dark:bg-primary-900/30 border-l-4 border-primary-500"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center text-white text-lg shadow-sm`}
                      >
                        {type.icon}
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.workoutType && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <X className="w-4 h-4" />
                <span>{errors.workoutType}</span>
              </p>
            )}
          </div>

          {/* Duration Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              Duration <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="number"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleInputChange}
                min="1"
                max="600"
                placeholder="Enter duration in minutes"
                className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 ${
                  errors.durationMinutes
                    ? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                required
              />
            </div>
            {errors.durationMinutes && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <X className="w-4 h-4" />
                <span>{errors.durationMinutes}</span>
              </p>
            )}
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              <button
                type="button"
                onClick={() => setIsCalendarOpen(true)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  errors.workoutDate
                    ? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                } text-gray-900 dark:text-white`}
              >
                {formData.workoutDate
                  ? format(new Date(formData.workoutDate), "MMMM d, yyyy")
                  : "Select a date"}
              </button>
            </div>
            {errors.workoutDate && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <X className="w-4 h-4" />
                <span>{errors.workoutDate}</span>
              </p>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              Notes{" "}
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                (optional)
              </span>
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
                placeholder="Add any notes about your workout..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              type="submit"
              className="flex-1 order-2 sm:order-1"
              loading={isLoading}
              disabled={isLoading}
            >
              <Activity className="w-4 h-4 mr-2" />
              Log Workout
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
              className="order-1 sm:order-2"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Custom Calendar */}
      <Calendar
        selectedDate={
          formData.workoutDate ? new Date(formData.workoutDate) : null
        }
        onDateSelect={handleDateSelect}
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
    </>
  );
};

export default WorkoutForm;
