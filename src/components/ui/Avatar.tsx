import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  AVATAR_GRADIENTS,
  C,
  radii,
  shadows,
  typography,
} from '../../theme/tokens';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  // Used to derive the initial when no image. Trimmed; first non-whitespace
  // grapheme becomes the badge letter.
  name: string;
  // 0..AVATAR_GRADIENTS.length-1. Out-of-range values wrap. If undefined,
  // a stable hash of `name` picks one — same name always lands on the same
  // gradient across the app.
  gradientIndex?: number;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
  withBorder?: boolean;
}

const sizePx: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const fontSizeFor: Record<AvatarSize, number> = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 36,
};

export function Avatar({
  name,
  gradientIndex,
  size = 'md',
  style,
  withBorder = false,
}: AvatarProps) {
  const px = sizePx[size];
  const idx =
    gradientIndex !== undefined
      ? Math.abs(gradientIndex) % AVATAR_GRADIENTS.length
      : hashIndex(name, AVATAR_GRADIENTS.length);
  const gradient = AVATAR_GRADIENTS[idx];
  const initial = firstGrapheme(name);

  // `LinearGradient` from expo-linear-gradient expects `readonly [string, string, ...]`.
  // Our token is `readonly [string, string]`, which satisfies that constraint.
  return (
    <View
      style={[
        styles.wrapper,
        {
          width: px,
          height: px,
          borderRadius: radii.rFull,
        },
        withBorder && styles.border,
        shadows.sm,
        style,
      ]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          { width: px, height: px, borderRadius: radii.rFull },
        ]}
      >
        <Text
          style={[
            typography.title,
            { fontSize: fontSizeFor[size], color: C.textWhite },
          ]}
          maxFontSizeMultiplier={1.5}
        >
          {initial}
        </Text>
      </LinearGradient>
    </View>
  );
}

function firstGrapheme(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) return '?';
  // String#charAt is fine for ASCII initials; full grapheme segmentation
  // (Intl.Segmenter) isn't worth pulling in for a one-character badge.
  return trimmed.charAt(0).toUpperCase();
}

function hashIndex(input: string, modulo: number): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    // djb2-ish; collisions don't matter here, we only need stability per name.
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % modulo;
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  border: {
    borderWidth: 2,
    borderColor: C.textWhite,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
