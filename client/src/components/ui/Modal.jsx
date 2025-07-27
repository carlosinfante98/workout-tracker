import React from "react";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  canClose = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && canClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden ${sizeClasses[size]} animate-slide-up border border-gray-200 dark:border-gray-700`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={() => {
              if (canClose) {
                onClose();
              }
            }}
            className={`p-2 rounded-xl transition-all duration-200 ${
              canClose
                ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
            }`}
            disabled={!canClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-white dark:bg-gray-800 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
