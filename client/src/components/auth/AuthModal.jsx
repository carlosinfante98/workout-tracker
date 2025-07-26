import React, { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const { login, register, loading } = useAuthStore();

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

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Register-specific validation
    if (mode === "register") {
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    try {
      if (mode === "login") {
        const result = await login(formData.email, formData.password);

        if (result.success) {
          // Clear errors and close modal on success
          setErrors({});
          onClose();
          resetForm();
        } else {
          // Show user-friendly error message
          const errorMessage =
            result.error ||
            "Login failed. Please check your credentials and try again.";
          setErrors({ submit: errorMessage });
        }
      } else {
        const result = await register(
          formData.email,
          formData.password,
          formData.fullName
        );

        if (result.success) {
          setErrors({});

          if (result.message) {
            // Email confirmation required
            setErrors({ submit: result.message });
          } else {
            // Auto-login successful
            localStorage.setItem("showWelcome", "true");
            localStorage.setItem("welcomeUserName", formData.fullName);
            onClose();
            resetForm();
          }
        } else {
          setErrors({
            submit: result.error || "Registration failed. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrors({
        submit:
          "Something went wrong. Please check your connection and try again.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    resetForm();
    setMode("login");
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "login" ? "Sign In" : "Create Account"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
        />

        {mode === "register" && (
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            error={errors.fullName}
            required
          />
        )}

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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 animate-shake">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                {mode === "login" ? "Sign in failed" : "Sign up failed"}
              </h3>
              <div className="mt-1">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
              {mode === "login" &&
                !errors.submit.includes("check your email") && (
                  <div className="mt-2">
                    <p className="text-xs text-red-600">
                      💡 <strong>Tip:</strong> Make sure your email and password
                      are correct, or try creating a new account.
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
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
          onClick={switchMode}
          className="ml-2 text-primary-500 hover:text-primary-600 font-medium"
        >
          {mode === "login" ? "Sign Up" : "Sign In"}
        </button>
      </div>
    </Modal>
  );
};

export default AuthModal;
