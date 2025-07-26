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

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-primary-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">FitTracker</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">
                {user?.user_metadata?.full_name || user?.email}
              </span>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
