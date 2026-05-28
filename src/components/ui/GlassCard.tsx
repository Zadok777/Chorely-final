import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { C, radii, shadows, spacing } from '../../theme/tokens';

// The intentional glass — see DESIGN.md §10 anti-patterns. Two-layer pattern:
// the outer wrapper carries the shadow, the inner wrapper clips children via
// borderRadius + overflow. Without the split, iOS clips the shadow.

type ShadowKey = keyof typeof shadows | 'none';
type Tint = 'light' | 'pink' | 'orange' | 'green';

interface GlassCardProps {
  children: React.ReactNode;
  // BlurView intensity on iOS. DESIGN §9 recommends 12–20.
  intensity?: number;
  // Designed tint over the blur. `light` is the default white glass; the
  // colored tints layer the matching `*Alpha10` token.
  tint?: Tint;
  // Override the corner radius (defaults to r18 — standard cards).
  radius?: number;
  // Inner padding. Defaults to 16px (DESIGN §6).
  padding?: number;
  borderColor?: string;
  shadow?: ShadowKey;
  style?: StyleProp<ViewStyle>;
}

const tintBackgrounds: Record<Tint, string> = {
  light: C.glass,
  pink: C.pinkAlpha10,
  orange: C.orangeAlpha10,
  green: C.greenAlpha15,
};

export function GlassCard({
  children,
  intensity = 16,
  tint = 'light',
  radius = radii.r18,
  padding = spacing.s16,
  borderColor = C.border,
  shadow = 'md',
  style,
}: GlassCardProps) {
  const shadowStyle = shadow === 'none' ? undefined : shadows[shadow];

  return (
    <View
      style={[
        styles.outer,
        { borderRadius: radius },
        shadowStyle,
        style,
      ]}
    >
      <View
        style={[
          styles.inner,
          { borderRadius: radius, borderColor },
        ]}
      >
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={intensity}
            tint="light"
            style={StyleSheet.absoluteFillObject}
          />
        ) : null}
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: tintBackgrounds[tint] },
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
