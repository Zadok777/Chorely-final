import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { C, spacing, typography } from '../../theme/tokens';
import { ChorelyIcon } from './ChorelyIcon';

export type ChorelyLogoVariant = 'full' | 'horizontal' | 'icon';

interface ChorelyLogoProps {
  // `full` stacks icon over wordmark; `horizontal` places them side-by-side;
  // `icon` returns just the smiley.
  variant?: ChorelyLogoVariant;
  // Drives both the icon size and the wordmark font size. The wordmark is
  // proportional so the brand reads consistently.
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
}

export function ChorelyLogo({
  variant = 'full',
  iconSize = 64,
  style,
}: ChorelyLogoProps) {
  if (variant === 'icon') {
    return <ChorelyIcon size={iconSize} style={style} />;
  }

  const wordmarkFontSize = Math.round(iconSize * 0.55);

  if (variant === 'horizontal') {
    return (
      <View style={[styles.horizontal, style]}>
        <ChorelyIcon size={iconSize} />
        <Text
          style={[
            styles.wordmark,
            { fontSize: wordmarkFontSize, marginLeft: spacing.s12 },
          ]}
          maxFontSizeMultiplier={1.5}
        >
          Chorely
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.stacked, style]}>
      <ChorelyIcon size={iconSize} />
      <Text
        style={[
          styles.wordmark,
          { fontSize: wordmarkFontSize, marginTop: spacing.s12 },
        ]}
        maxFontSizeMultiplier={1.5}
      >
        Chorely
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stacked: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontFamily: typography.headline.fontFamily,
    color: C.pink,
    letterSpacing: -0.8,
  },
});
