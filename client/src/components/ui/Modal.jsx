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
    console.log("Modal backdrop clicked, canClose:", canClose);
    if (e.target === e.currentTarget && canClose) {
      console.log("Modal closing via backdrop");
      onClose();
    } else if (e.target === e.currentTarget && !canClose) {
      console.log("Modal close blocked by canClose=false");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} animate-slide-up`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={() => {
              console.log("Modal X button clicked, canClose:", canClose);
              if (canClose) {
                console.log("Modal closing via X button");
                onClose();
              } else {
                console.log("Modal close blocked by canClose=false");
              }
            }}
            className={`p-2 rounded-full transition-colors ${
              canClose
                ? "hover:bg-gray-100 text-gray-500"
                : "text-gray-300 cursor-not-allowed"
            }`}
            disabled={!canClose}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
