import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { radii, shadows, spacing, useTheme, type Palette } from '../../theme';

// The intentional glass — see DESIGN.md §10 anti-patterns. Two-layer pattern:
// the outer wrapper carries the shadow, the inner wrapper clips children via
// borderRadius + overflow. Without the split, iOS clips the shadow. The blur
// tint and tint background both follow the active theme.

type ShadowKey = keyof typeof shadows | 'none';
type Tint = 'light' | 'pink' | 'orange' | 'green';

interface GlassCardProps {
  children: React.ReactNode;
  // BlurView intensity on iOS. DESIGN §9 recommends 12–20.
  intensity?: number;
  // Designed tint over the blur. `light` is the default glass; the colored
  // tints layer the matching themed alpha token.
  tint?: Tint;
  // Override the corner radius (defaults to r18 — standard cards).
  radius?: number;
  // Inner padding. Defaults to 16px (DESIGN §6).
  padding?: number;
  borderColor?: string;
  shadow?: ShadowKey;
  style?: StyleProp<ViewStyle>;
}

function tintBackground(C: Palette, tint: Tint): string {
  switch (tint) {
    case 'light':
      return C.glass;
    case 'pink':
      return C.pinkAlpha10;
    case 'orange':
      return C.orangeAlpha10;
    case 'green':
      return C.greenAlpha15;
  }
}

export function GlassCard({
  children,
  intensity = 16,
  tint = 'light',
  radius = radii.r18,
  padding = spacing.s16,
  borderColor,
  shadow = 'md',
  style,
}: GlassCardProps) {
  const { C, mode } = useTheme();
  const shadowStyle = shadow === 'none' ? undefined : shadows[shadow];
  const resolvedBorder = borderColor ?? C.border;

  return (
    <View style={[styles.outer, { borderRadius: radius }, shadowStyle, style]}>
      <View
        style={[
          styles.inner,
          { borderRadius: radius, borderColor: resolvedBorder },
        ]}
      >
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={intensity}
            tint={mode === 'dark' ? 'dark' : 'light'}
            style={StyleSheet.absoluteFillObject}
          />
        ) : null}
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: tintBackground(C, tint) },
          ]}
        />
        <View style={{ padding }}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: 'transparent',
  },
  inner: {
    overflow: 'hidden',
    borderWidth: 1,
  },
});
