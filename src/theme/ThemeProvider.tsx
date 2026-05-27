import React, { createContext, useContext, useMemo, type ReactNode } from 'react';

import {
  C,
  radii,
  shadows,
  spacing,
  typography,
  bracketThemes,
  type AgeBracket,
  type BracketTheme,
} from './tokens';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  C: typeof C;
  radii: typeof radii;
  shadows: typeof shadows;
  spacing: typeof spacing;
  typography: typeof typography;
  bracketThemes: typeof bracketThemes;
  bracketFor: (bracket: AgeBracket) => BracketTheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({ children, initialMode = 'light' }: ThemeProviderProps) {
  const value = useMemo<ThemeContextValue>(
    () => ({
      mode: initialMode,
      C,
      radii,
      shadows,
      spacing,
      typography,
      bracketThemes,
      bracketFor: (bracket) => bracketThemes[bracket],
    }),
    [initialMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
}
