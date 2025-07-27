import React from "react";
import { Activity, LogOut, User } from "lucide-react";
import useAuthStore from "../../store/authStore";
import Button from "../ui/Button";

const Navbar = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    console.log("🖱️ Logout button clicked");
    try {
      await logout();
      console.log("✅ Logout completed - auth state will handle redirect");
      // Let the auth state change trigger the redirect naturally
      // The ProtectedRoute will redirect to "/" when user becomes null
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      // On mobile, show first name only
      return user.user_metadata.full_name.split(" ")[0];
    }
    if (user?.email) {
      // On mobile, show part before @ and truncate if too long
      const emailName = user.email.split("@")[0];
      return emailName.length > 10
        ? emailName.substring(0, 10) + "..."
        : emailName;
    }
    return "User";
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo Section */}
          <div className="flex items-center min-w-0 flex-shrink-0">
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500 mr-1.5 sm:mr-2" />
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
              FitTracker
            </h1>
          </div>

          {/* Profile Section */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            {/* Profile Info - Mobile Optimized */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 bg-gray-50 rounded-lg px-2 py-1.5 sm:bg-transparent sm:px-0 sm:py-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[80px] sm:max-w-none">
                {getDisplayName()}
              </span>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-1.5 sm:px-3 sm:py-1.5"
            >
              <LogOut className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
