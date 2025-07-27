import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/" replace />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { user } = useAuthStore();
  return !user ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  const { initialize, user, loading } = useAuthStore();
  const { initializeTheme } = useThemeStore();
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    // Initialize auth state from Supabase
    const initAuth = async () => {
      await initialize();
      setIsInitialized(true);
    };

    // Initialize theme
    initializeTheme();

    initAuth();
  }, [initialize, initializeTheme]);

  // Show loading spinner during auth initialization
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              style: {
                background: "#10b981",
              },
            },
            error: {
              style: {
                background: "#ef4444",
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
