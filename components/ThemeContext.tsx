import {
  SyntaxHighlighterTheme,
  syntaxHighlighterThemes,
} from "@/types/SyntaxHighlighterThemes";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Keys used in localStorage
const LOCAL_STORAGE_KEY = "preferred_theme";

// Set up context shape
interface ThemeContextProps {
  theme: SyntaxHighlighterTheme;
  setTheme: (theme: SyntaxHighlighterTheme) => void;
}

// Create context with default values (will be overridden by provider)
const ThemeContext = createContext<ThemeContextProps>({
  theme: "docco",
  setTheme: () => {},
});

// Helper to get initial theme from localStorage or default
function getInitialTheme(): SyntaxHighlighterTheme {
  if (typeof window === "undefined") return "docco";
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (
    stored &&
    (syntaxHighlighterThemes as readonly string[]).includes(stored)
  ) {
    return stored as SyntaxHighlighterTheme;
  }
  return "docco";
}

// Provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] =
    useState<SyntaxHighlighterTheme>(getInitialTheme);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: SyntaxHighlighterTheme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy usage
export const useTheme = () => useContext(ThemeContext);
