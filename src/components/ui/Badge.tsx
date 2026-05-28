import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { C, radii, spacing, typography } from '../../theme/tokens';

export type BadgeTone =
  | 'neutral'
  | 'pink'
  | 'orange'
  | 'green'
  | 'danger'
  | 'muted';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  size?: BadgeSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface TonePalette {
  background: string;
  text: string;
}

const palettes: Record<BadgeTone, TonePalette> = {
  neutral: { background: C.glassLight, text: C.textDark },
  pink: { background: C.pinkAlpha15, text: C.pink },
  orange: { background: C.orangeAlpha15, text: '#C36321' },
  green: { background: C.greenAlpha15, text: C.green },
  danger: { background: C.redAlpha15, text: '#B91C1C' },
  muted: { background: C.mutedAlpha20, text: C.textMid },
};

const heightFor: Record<BadgeSize, number> = {
  sm: 22,
  md: 28,
};

const horizontalPaddingFor: Record<BadgeSize, number> = {
  sm: spacing.s8,
  md: spacing.s12,
};

const fontSizeFor: Record<BadgeSize, number> = {
  sm: 11,
  md: 12,
};

export function Badge({
  label,
  tone = 'neutral',
  size = 'md',
  iconLeft,
  iconRight,
  style,
}: BadgeProps) {
  const palette = palettes[tone];

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: palette.background,
          height: heightFor[size],
          paddingHorizontal: horizontalPaddingFor[size],
        },
        style,
      ]}
    >
      {iconLeft !== undefined ? (
        <View style={styles.iconLeft}>{iconLeft}</View>
      ) : null}
      <Text
        style={[
          typography.caption,
          {
            color: palette.text,
            fontSize: fontSizeFor[size],
          },
        ]}
        maxFontSizeMultiplier={1.5}
        numberOfLines={1}
      >
        {label}
      </Text>
      {iconRight !== undefined ? (
        <View style={styles.iconRight}>{iconRight}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.rFull,
    alignSelf: 'flex-start',
  },
  iconLeft: {
    marginRight: spacing.s4,
  },
  iconRight: {
    marginLeft: spacing.s4,
  },
});
