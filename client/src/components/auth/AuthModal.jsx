import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const { login, register, isLoading } = useAuthStore();

  // Debug modal lifecycle (can be removed in production)
  useEffect(() => {
    console.log("AuthModal mounted/re-rendered, isOpen:", isOpen);
    return () => {
      console.log("AuthModal unmounting");
    };
  }, [isOpen]);

  // Debug errors state changes (can be removed in production)
  useEffect(() => {
    console.log("AuthModal errors state changed:", errors);
  }, [errors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name] || errors.submit) {
      setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === "register") {
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (mode === "login") {
      const result = await login({
        username: formData.username,
        password: formData.password,
      });

      if (result.success) {
        // Clear errors only on success
        setErrors({});
        onClose();
        resetForm();
      } else {
        // Show error in form only
        const errorMessage =
          result.error ||
          "Login failed. Please check your credentials and try again.";
        setErrors({
          submit: errorMessage,
        });
      }
    } else {
      const result = await register({
        email: formData.email,
        username: formData.username,
        fullName: formData.fullName,
        password: formData.password,
      });

      if (result.success) {
        // Clear errors and prepare for welcome on dashboard
        setErrors({});

        // Store welcome info for dashboard
        localStorage.setItem("showWelcome", "true");
        localStorage.setItem(
          "welcomeUserName",
          formData.fullName || formData.username
        );

        // Auto-login with the credentials they just registered with
        const loginResult = await login({
          username: formData.username,
          password: formData.password,
        });

        if (loginResult.success) {
          // Close modal and redirect - welcome will show on dashboard
          onClose();
          resetForm();
        } else {
          // If auto-login fails, switch to login mode
          setMode("login");
          resetForm();
        }
      } else {
        // Show error in form only
        setErrors({
          submit: result.error || "Registration failed. Please try again.",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      username: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    // Always allow closing, but clear errors when closing
    onClose();
    resetForm();
    setMode("login");
  };

  const canCloseModal = true; // Always allow closing

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "login" ? "Sign In" : "Create Account"}
      canClose={canCloseModal}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {mode === "register" && (
          <>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
            />
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              error={errors.fullName}
              required
            />
          </>
        )}

        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          error={errors.username}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
        />

        {mode === "register" && (
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            required
          />
        )}

        {/* Display submission errors */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600 font-medium">
              {errors.submit === "Invalid credentials"
                ? "That username and password don't match. Double-check your login details and try again."
                : errors.submit}
            </p>
            <p className="text-xs text-red-500 mt-1">
              Forgot your password? You can reset it once we add that feature.
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          {mode === "login" ? "Sign In" : "Create Account"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-gray-600">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
        </span>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setErrors({}); // Clear any errors when switching modes
          }}
          className="ml-2 text-primary-500 hover:text-primary-600 font-medium"
        >
          {mode === "login" ? "Sign Up" : "Sign In"}
        </button>
      </div>
    </Modal>
  );
};

export default AuthModal;
