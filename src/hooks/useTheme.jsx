import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'freshfind_theme';
const DARK = 'dark';
const LIGHT = 'light';

const ThemeContext = createContext(null);

/* The matching one-liner also lives inline in index.html so the correct
   theme is on <html> before the first paint; this only re-reads it so the
   React tree agrees with what is already painted. */
function load() {
  try {
    return localStorage.getItem(STORAGE_KEY) === DARK ? DARK : LIGHT;
  } catch {
    return LIGHT;
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(load);

  /* paint the chosen theme — runs on mount too, so the markup and the
     attribute can never disagree even if index.html was cached. */
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === DARK ? '#172D25' : '#faf7ef');
  }, [theme]);

  /* only written when the visitor actually picks one, so a first-time
     visitor still just gets the light default */
  const selectTheme = useCallback((next) => {
    const value = next === DARK ? DARK : LIGHT;
    setThemeState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* private mode — the theme still applies for this session */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const value = current === DARK ? LIGHT : DARK;
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch {
        /* private mode — the theme still applies for this session */
      }
      return value;
    });
  }, []);

  const value = { theme, isDark: theme === DARK, setTheme: selectTheme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
