// Single source of truth for Chorely design tokens.
// See DESIGN.md for the rationale behind each value.

import type { ViewStyle } from 'react-native';

// ---------------------------------------------------------------------------
// Colors (C)
// ---------------------------------------------------------------------------

export const lightC = {
  // Brand palette
  pink: '#FF4D8D',
  orange: '#FF8C42',
  green: '#00A92A',
  bg: '#FAF9FB', // warm near-white canvas (was lavender glass ground)

  // Text
  textDark: '#22222B',
  textMid: '#6B6B80',
  textLight: '#A8A8B8',
  textWhite: '#FFFFFF',

  // Surface — now SOLID surfaces with a hairline, not frosted glass.
  glass: '#FFFFFF', // primary card surface
  glassLight: '#F3F1F7', // recessed / subtle container
  border: 'rgba(24, 20, 40, 0.06)', // real hairline for definition on near-white
  borderPink: 'rgba(255, 77, 141, 0.30)',

  // Tinted alphas
  pinkAlpha15: 'rgba(255, 77, 141, 0.15)',
  pinkAlpha10: 'rgba(255, 77, 141, 0.10)',
  orangeAlpha15: 'rgba(255, 140, 66, 0.15)',
  orangeAlpha10: 'rgba(255, 140, 66, 0.10)',
  greenAlpha15: 'rgba(0, 169, 42, 0.15)',
  greenAlpha20: 'rgba(0, 169, 42, 0.20)',
  mutedAlpha20: 'rgba(168, 168, 184, 0.20)',
  redAlpha15: 'rgba(220, 38, 38, 0.15)',
} as const;

// Public palette shape — every themed color the app consumes. Both the light
// and dark palettes satisfy this; themed components receive it as `Palette`
// (string-typed values) from useTheme().C.
export type Palette = {
  pink: string;
  orange: string;
  green: string;
  bg: string;
  textDark: string;
  textMid: string;
  textLight: string;
  textWhite: string;
  glass: string;
  glassLight: string;
  border: string;
  borderPink: string;
  pinkAlpha15: string;
  pinkAlpha10: string;
  orangeAlpha15: string;
  orangeAlpha10: string;
  greenAlpha15: string;
  greenAlpha20: string;
  mutedAlpha20: string;
  redAlpha15: string;
};

// Dark glassmorphism palette. Brand accents stay constant; surfaces flip to a
// deep violet ground with light-translucent glass and inverted text. Green is
// brightened slightly for contrast on the dark ground.
export const darkC: Palette = {
  pink: '#FF4D8D',
  orange: '#FF8C42',
  green: '#1FBF44',
  bg: '#141220', // truer near-black violet ground
  textDark: '#F2EEFF',
  textMid: '#A8A2BE',
  textLight: '#6F6986',
  textWhite: '#FFFFFF',
  glass: '#221D31', // solid raised surface (was translucent glass)
  glassLight: '#1B1726', // recessed surface
  border: 'rgba(255, 255, 255, 0.07)', // hairline on dark
  borderPink: 'rgba(255, 77, 141, 0.45)',
  pinkAlpha15: 'rgba(255, 77, 141, 0.22)',
  pinkAlpha10: 'rgba(255, 77, 141, 0.15)',
  orangeAlpha15: 'rgba(255, 140, 66, 0.22)',
  orangeAlpha10: 'rgba(255, 140, 66, 0.15)',
  greenAlpha15: 'rgba(31, 191, 68, 0.24)',
  greenAlpha20: 'rgba(31, 191, 68, 0.30)',
  mutedAlpha20: 'rgba(168, 168, 184, 0.22)',
  redAlpha15: 'rgba(220, 38, 38, 0.24)',
};

// Backward-compatible default — the light palette. Theme-aware code should
// prefer useTheme().C; this stays for mode-invariant module-scope use (e.g.
// shadow colors) and not-yet-converted / dev-only screens.
export const C = lightC;

// ---------------------------------------------------------------------------
// Avatar gradients (cycled for family members)
// ---------------------------------------------------------------------------

export const AVATAR_GRADIENTS: ReadonlyArray<readonly [string, string]> = [
  ['#FF8C42', '#FF4D8D'], // Orange -> Pink   (child 1)
  ['#4D9FFF', '#8C42FF'], // Blue   -> Purple (child 2)
  ['#42FFB8', '#42C9FF'], // Green  -> Cyan   (child 3)
  ['#FFD742', '#FF8C42'], // Gold   -> Orange (child 4)
  ['#A742FF', '#FF4D8D'], // Purple -> Pink   (child 5)
] as const;

// Named gradients for hero cards and primary CTAs. Mode-invariant brand colors
// (they read well on both light and dark grounds).
export const GRADIENTS = {
  brand: ['#FF4D8D', '#FF8C42'] as const, // pink → orange (primary CTAs, approve)
  violet: ['#7A5CFF', '#4D9FFF'] as const, // purple → blue (approval hero)
  sky: ['#4D9FFF', '#8C42FF'] as const, // blue → purple
} as const;

// ---------------------------------------------------------------------------
// Border radius scale
// ---------------------------------------------------------------------------

export const radii = {
  r8: 8,
  r10: 10,
  r12: 12,
  r14: 14,
  r16: 16,
  r18: 18,
  r20: 20,
  r24: 24,
  rFull: 9999,
} as const;

// ---------------------------------------------------------------------------
// Shadows (React Native ViewStyle pickups)
// ---------------------------------------------------------------------------

type Shadow = Pick<
  ViewStyle,
  'shadowOffset' | 'shadowRadius' | 'shadowOpacity' | 'shadowColor' | 'elevation'
>;

export const shadows: Record<'sm' | 'md' | 'lg' | 'xl2' | 'pink', Shadow> = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    shadowOpacity: 0.06,
    shadowColor: '#000000',
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 0.05,
    shadowColor: '#000000',
    elevation: 3,
  },
  lg: {
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.07,
    shadowColor: '#000000',
    elevation: 6,
  },
  xl2: {
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 48,
    shadowOpacity: 0.16,
    shadowColor: '#000000',
    elevation: 10,
  },
  pink: {
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 0.16,
    shadowColor: C.pink,
    elevation: 4,
  },
};

// ---------------------------------------------------------------------------
// Spacing (8-pt scale)
// ---------------------------------------------------------------------------

export const spacing = {
  s4: 4,
  s8: 8,
  s12: 12,
  s16: 16,
  s20: 20,
  s24: 24,
  s32: 32,
  s40: 40,
  s48: 48,
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const typography = {
  display: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 42,
    letterSpacing: -1.4,
  },
  headline: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 30,
    letterSpacing: -0.8,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    letterSpacing: -0.4,
  },
  body: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
  },
  caption: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    letterSpacing: 0.1,
  },
  // Micro uppercase label — pairs with big display numbers for an editorial,
  // premium feel (e.g. stat-tile captions). Keep copy short.
  label: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    letterSpacing: -0.1,
  },
  heroNum: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 52,
    letterSpacing: -1.8,
  },
} as const;

// ---------------------------------------------------------------------------
// Age-bracket theme overrides
// ---------------------------------------------------------------------------

export type AgeBracket = 'elementary' | 'middle_school' | 'high_school';

export interface BracketTheme {
  primary: string;
  secondary: string;
  successAccent: string;
  backgroundGradient: [string, string];
  glassTint: string;
  borderRadius: { card: number; button: number; bottomSheet: number };
  touchTarget: number;
  iconVariant: 'filled' | 'mixed' | 'outline';
  spring: { damping: number; stiffness: number };
}

export const bracketThemes: Record<AgeBracket, BracketTheme> = {
  elementary: {
    primary: '#FF4D8D',
    secondary: '#FC8A40',
    successAccent: '#A8E6CF',
    backgroundGradient: ['#FFF0F7', '#FFF5EA'],
    glassTint: 'rgba(255, 77, 141, 0.14)',
    borderRadius: { card: 24, button: 999, bottomSheet: 30 },
    touchTarget: 56,
    iconVariant: 'filled',
    spring: { damping: 8, stiffness: 100 },
  },
  middle_school: {
    primary: '#6E61FF',
    secondary: '#8A80FF',
    successAccent: '#B2EBF2',
    backgroundGradient: ['#F2F0FF', '#EEF5FF'],
    glassTint: 'rgba(110, 97, 255, 0.12)',
    borderRadius: { card: 22, button: 999, bottomSheet: 26 },
    touchTarget: 48,
    iconVariant: 'mixed',
    spring: { damping: 12, stiffness: 120 },
  },
  high_school: {
    primary: '#5A4CE0',
    secondary: '#B388FF',
    successAccent: '#E8D5FF',
    backgroundGradient: ['#F5F1FF', '#ECE7FF'],
    glassTint: 'rgba(90, 76, 224, 0.10)',
    borderRadius: { card: 20, button: 999, bottomSheet: 24 },
    touchTarget: 48,
    iconVariant: 'outline',
    spring: { damping: 20, stiffness: 200 },
  },
};
