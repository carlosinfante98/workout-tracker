import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false,
      error: null,

      // Initialize auth listener
      initialize: async () => {
        set({ loading: true });

        // Check for forced logout flag
        if (localStorage.getItem("FORCE_LOGOUT")) {
          console.log("🚫 Force logout flag detected, staying logged out");
          localStorage.removeItem("FORCE_LOGOUT");
          set({
            session: null,
            user: null,
            loading: false,
            error: null,
          });
          return;
        }

        console.log("🔄 Starting auth initialization...");

        try {
          // Get initial session
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error("❌ Auth initialization error:", error);
            console.error("❌ Error details:", JSON.stringify(error, null, 2));
            // If there's an auth error, clear everything and start fresh
            localStorage.removeItem("auth-storage");
            set({
              session: null,
              user: null,
              error: null,
              loading: false,
            });
            return;
          }

          // Double-check session validity
          if (
            session &&
            session.expires_at &&
            session.expires_at < Date.now() / 1000
          ) {
            console.log("🚫 Session expired during init, clearing...");
            localStorage.removeItem("auth-storage");
            set({
              session: null,
              user: null,
              loading: false,
            });
            return;
          }

          console.log("✅ Auth initialization complete", {
            hasSession: !!session,
            hasUser: !!session?.user,
            userEmail: session?.user?.email,
          });

          set({
            session,
            user: session?.user || null,
            loading: false,
          });

          // Listen for auth changes
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(
              "🔄 Auth state changed:",
              event,
              session?.user?.email || "no user"
            );
            set({
              session,
              user: session?.user || null,
              loading: false,
            });
          });

          // Store subscription for cleanup
          set({ subscription });
        } catch (error) {
          console.error("❌ Auth initialization failed:", error);
          console.error(
            "❌ Caught error details:",
            JSON.stringify(error, null, 2)
          );
          set({
            session: null,
            user: null,
            error: error.message,
            loading: false,
          });
        }
      },

      // Register new user
      register: async (email, password, fullName) => {
        set({ loading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          });

          if (error) {
            set({ error: error.message, loading: false });
            return { success: false, error: error.message };
          }

          // If email confirmation is required
          if (data.user && !data.session) {
            set({ loading: false });
            return {
              success: true,
              message: "Please check your email to confirm your account",
            };
          }

          set({
            user: data.user,
            session: data.session,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          console.error("Registration error:", error);
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Login user
      login: async (email, password) => {
        set({ loading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error("❌ Supabase login error:", error);

            set({ error: error.message, loading: false });

            // Use Supabase error codes for reliable error handling (best practice)
            let errorMessage;
            if (
              error.code === "invalid_credentials" ||
              error.message === "Invalid login credentials"
            ) {
              errorMessage =
                "The email and password you entered don't match our records. Please double-check and try again.";
            } else if (error.code === "email_not_confirmed") {
              errorMessage =
                "Please check your email and click the confirmation link before signing in.";
            } else if (
              error.code === "too_many_requests" ||
              error.status === 429
            ) {
              errorMessage =
                "Too many login attempts. Please wait a few minutes before trying again.";
            } else if (error.code === "signup_disabled") {
              errorMessage = "New account creation is currently disabled.";
            } else {
              errorMessage =
                "Sign in failed. Please check your connection and try again.";
            }

            return { success: false, error: errorMessage };
          }

          set({
            user: data.user,
            session: data.session,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          console.error("❌ Login exception:", error);
          set({ error: error.message, loading: false });

          return {
            success: false,
            error: "Login failed. Please check your connection and try again.",
          };
        }
      },

      // Logout user (using proper Supabase scopes)
      logout: async () => {
        try {
          // Try local scope first (current session only)
          console.log("🔐 Attempting local scope signout...");
          const { error } = await supabase.auth.signOut({ scope: "local" });

          if (error) {
            console.log("❌ Local signout failed, trying global...");
            // If local fails, try global scope
            const { error: globalError } = await supabase.auth.signOut({
              scope: "global",
            });

            if (globalError) {
              console.log("❌ Both signout methods failed, going nuclear...");
              get().nuclearLogout();
              return;
            }
          }

          console.log("✅ Supabase signout successful, clearing state...");
          // Clear local state and redirect
          get().clearAuthAndRedirect();
        } catch (error) {
          console.log("❌ Signout exception, going nuclear...");
          get().nuclearLogout();
        }
      },

      // Clear auth state (let React Router handle navigation)
      clearAuthAndRedirect: () => {
        console.log(
          "🧹 Clearing auth state - Router will handle navigation..."
        );

        // Clear storage first
        localStorage.removeItem("auth-storage");

        // Clear state - this will trigger ProtectedRoute to redirect
        set({
          user: null,
          session: null,
          loading: false,
          error: null,
        });

        console.log(
          "✅ Auth state cleared - ProtectedRoute will redirect to /"
        );
      },

      // Nuclear logout - only when Supabase fails completely
      nuclearLogout: () => {
        console.log(
          "💥 Nuclear logout - Supabase signout failed, doing full cleanup..."
        );

        // Set a flag to prevent any restoration
        localStorage.setItem("FORCE_LOGOUT", "true");

        // Clear absolutely everything
        localStorage.clear();
        sessionStorage.clear();

        // Clear cookies
        document.cookie.split(";").forEach(function (c) {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });

        // Only use window.location as last resort when Supabase completely fails
        console.log("🔄 Force reloading page due to Supabase failure...");
        window.location.replace("/");
      },

      // Clear auth state (shared cleanup logic)
      clearAuthState: async () => {
        console.log("🧹 Clearing auth state...");
        set({
          user: null,
          session: null,
          loading: false,
          error: null,
        });

        console.log("🗑️ Clearing localStorage...");
        localStorage.removeItem("auth-storage");

        console.log("✅ Auth state cleared!");
      },

      // Get auth header for API calls
      getAuthHeader: () => {
        const session = get().session;
        if (session?.access_token) {
          return { Authorization: `Bearer ${session.access_token}` };
        }
        return {};
      },

      // Reset password
      resetPassword: async (email) => {
        set({ loading: true, error: null });

        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });

          if (error) {
            set({ error: error.message, loading: false });
            return { success: false, error: error.message };
          }

          set({ loading: false });
          return {
            success: true,
            message: "Password reset email sent",
          };
        } catch (error) {
          console.error("Reset password error:", error);
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Update profile
      updateProfile: async (updates) => {
        set({ loading: true, error: null });

        try {
          const { data, error } = await supabase.auth.updateUser({
            data: updates,
          });

          if (error) {
            set({ error: error.message, loading: false });
            return { success: false, error: error.message };
          }

          set({
            user: data.user,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          console.error("Update profile error:", error);
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Cleanup (for component unmount)
      cleanup: () => {
        const subscription = get().subscription;
        if (subscription) {
          subscription.unsubscribe();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);

export default useAuthStore;
