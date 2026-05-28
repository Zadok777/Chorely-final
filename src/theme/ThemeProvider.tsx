import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

import { useSettingsStore } from '../store/settingsStore';
import {
  darkC,
  lightC,
  radii,
  shadows,
  spacing,
  typography,
  bracketThemes,
  type AgeBracket,
  type BracketTheme,
  type Palette,
} from './tokens';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  C: Palette;
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
}

// The active palette is driven by the persisted `darkMode` flag in
// settingsStore, so the whole tree recolors the instant the Settings toggle
// flips (and dark mode is already applied at launch, before sign-in, since the
// store rehydrates from AsyncStorage). radii/spacing/typography/shadows are
// mode-invariant and stay constant.
export function ThemeProvider({ children }: ThemeProviderProps) {
  const darkMode = useSettingsStore((s) => s.darkMode);
  const mode: ThemeMode = darkMode ? 'dark' : 'light';
  const palette: Palette = darkMode ? darkC : lightC;

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      C: palette,
      radii,
      shadows,
      spacing,
      typography,
      bracketThemes,
      bracketFor: (bracket) => bracketThemes[bracket],
    }),
    [mode, palette]
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

// Builds a StyleSheet from the active palette and memoizes it per palette.
// Define the factory at module scope (stable identity) so the memo only
// recomputes when the theme actually changes:
//
//   const makeStyles = (C: Palette) => StyleSheet.create({ ... });
//   function MyComponent() {
//     const styles = useThemedStyles(makeStyles);
//   }
export function useThemedStyles<T>(factory: (c: Palette) => T): T {
  const { C } = useTheme();
  return useMemo(() => factory(C), [factory, C]);
}
