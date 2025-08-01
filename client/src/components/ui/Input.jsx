import React from "react";

const Input = ({
  label,
  error,
  type = "text",
  className = "",
  required = false,
  ...props
}) => {
  const inputClasses = `input-field ${
    error ? "border-red-500 focus:ring-red-500" : ""
  } ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && (
            <span className="text-red-500 dark:text-red-400 ml-1">*</span>
          )}
        </label>
      )}
      <input type={type} className={inputClasses} {...props} />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
