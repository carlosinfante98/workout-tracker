import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useWorkoutStore } from "../../store/workoutStore";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import { format } from "date-fns";

const WorkoutForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    workoutType: "gym",
    durationMinutes: "",
    notes: "",
    workoutDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [errors, setErrors] = useState({});

  const { createWorkout, isLoading } = useWorkoutStore();

  const workoutTypes = [
    { value: "gym", label: "🏋️‍♂️ Gym" },
    { value: "run", label: "🏃‍♂️ Running" },
    { value: "cardio", label: "💓 Cardio" },
    { value: "strength", label: "💪 Strength" },
    { value: "yoga", label: "🧘‍♀️ Yoga" },
    { value: "cycling", label: "🚴‍♂️ Cycling" },
    { value: "swimming", label: "🏊‍♂️ Swimming" },
    { value: "sports", label: "⚽ Sports" },
    { value: "other", label: "🏃‍♂️ Other" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Log New Workout">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Workout Type <span className="text-red-500">*</span>
          </label>
          <select
            name="workoutType"
            value={formData.workoutType}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            {workoutTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.workoutType && (
            <p className="mt-1 text-sm text-red-600">{errors.workoutType}</p>
          )}
        </div>

        <Input
          label="Duration (minutes)"
          type="number"
          name="durationMinutes"
          value={formData.durationMinutes}
          onChange={handleInputChange}
          error={errors.durationMinutes}
          min="1"
          max="600"
          required
        />

        <Input
          label="Date"
          type="date"
          name="workoutDate"
          value={formData.workoutDate}
          onChange={handleInputChange}
          error={errors.workoutDate}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
            className="input-field resize-none"
            placeholder="Add any notes about your workout..."
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            className="flex-1"
            loading={isLoading}
            disabled={isLoading}
          >
            Log Workout
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default WorkoutForm;
