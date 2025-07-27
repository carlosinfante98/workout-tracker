import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode: false,

      toggleTheme: () => {
        set((state) => {
          const newMode = !state.isDarkMode;
          // Update the HTML class for Tailwind dark mode
          if (newMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { isDarkMode: newMode };
        });
      },

      setDarkMode: (isDark) => {
        set({ isDarkMode: isDark });
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },

      initializeTheme: () => {
        const { isDarkMode } = get();
        if (isDarkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        // Initialize theme when store rehydrates
        if (state) {
          state.initializeTheme();
        }
      },
    }
  )
);
