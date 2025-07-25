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

        try {
          // Get initial session
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error("Auth initialization error:", error);
            set({ error: error.message, loading: false });
            return;
          }

          set({
            session,
            user: session?.user || null,
            loading: false,
          });

          // Listen for auth changes
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state changed:", event, session);
            set({
              session,
              user: session?.user || null,
              loading: false,
            });
          });

          // Store subscription for cleanup
          set({ subscription });
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({ error: error.message, loading: false });
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
            set({ error: error.message, loading: false });
            return { success: false, error: error.message };
          }

          set({
            user: data.user,
            session: data.session,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          console.error("Login error:", error);
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Logout user
      logout: async () => {
        set({ loading: true });

        try {
          const { error } = await supabase.auth.signOut();

          if (error) {
            console.error("Logout error:", error);
            set({ error: error.message, loading: false });
            return;
          }

          set({
            user: null,
            session: null,
            loading: false,
          });
        } catch (error) {
          console.error("Logout error:", error);
          set({ error: error.message, loading: false });
        }
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
