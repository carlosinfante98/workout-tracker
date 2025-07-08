import React from "react";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

const WelcomeDialog = ({ isOpen, onClose, userName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" canClose={true}>
      <div className="text-center py-4">
        {/* Success Animation Area */}
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
          <div className="relative flex items-center justify-center w-full h-full bg-green-500 rounded-full">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          {/* Sparkle decorations */}
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
          <Sparkles className="absolute -bottom-1 -left-2 w-4 h-4 text-blue-400 animate-bounce delay-150" />
        </div>

        {/* Welcome Message */}
        <div className="space-y-3 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            🎉 Welcome aboard{userName ? `, ${userName}` : ""}!
          </h2>
          <p className="text-gray-600 text-lg">
            Your account has been created successfully!
          </p>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            You're all set to start tracking your workouts and achieving your
            fitness goals. Let's get you started on your fitness journey!
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </Button>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeDialog;
