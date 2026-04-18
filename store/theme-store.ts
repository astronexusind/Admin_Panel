"use client";

import { create } from "zustand";

import { defaultTheme, isThemeName, themeOptions, type ThemeName } from "@/lib/theme";

const STORAGE_KEY = "astronexus-admin-theme";

function applyTheme(theme: ThemeName) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "light" ? "light" : "dark";
}

function getStoredTheme(): ThemeName {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isThemeName(stored) ? stored : defaultTheme;
}

function persistTheme(theme: ThemeName) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, theme);
}

type ThemeState = {
  theme: ThemeName;
  hydrated: boolean;
  setTheme: (theme: ThemeName) => void;
  cycleTheme: () => void;
  syncFromStorage: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: defaultTheme,
  hydrated: false,
  setTheme: (theme) => {
    persistTheme(theme);
    applyTheme(theme);
    set({
      theme,
      hydrated: true
    });
  },
  cycleTheme: () => {
    const currentIndex = themeOptions.findIndex((option) => option.id === get().theme);
    const nextTheme = themeOptions[(currentIndex + 1) % themeOptions.length]?.id ?? defaultTheme;
    get().setTheme(nextTheme);
  },
  syncFromStorage: () => {
    const theme = getStoredTheme();
    applyTheme(theme);
    set({
      theme,
      hydrated: true
    });
  }
}));
