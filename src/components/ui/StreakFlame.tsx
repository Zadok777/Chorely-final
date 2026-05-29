import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { typography, useThemedStyles, type Palette } from '../../theme';

interface StreakFlameProps {
  // When provided, renders "{days}d" next to the flame.
  days?: number;
  // Flame glyph size (and matching day-text size). Default 14.
  size?: number;
  style?: StyleProp<ViewStyle>;
}

// A 🔥 that gently flickers — a continuous scale pulse + a small rotate wiggle
// so streaks feel alive. Reanimated runs the loop on the UI thread (cheap).
export function StreakFlame({ days, size = 14, style }: StreakFlameProps) {
  const styles = useThemedStyles(makeStyles);
  const scale = useSharedValue(1);
  const rot = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.16, { duration: 550, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 550, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
    rot.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 280 }),
        withTiming(6, { duration: 560 }),
        withTiming(0, { duration: 280 })
      ),
      -1,
      false
    );
  }, [scale, rot]);

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rot.value}deg` }],
  }));

  return (
    <View style={[styles.row, style]}>
      <Animated.Text style={[{ fontSize: size }, flameStyle]}>🔥</Animated.Text>
      {days !== undefined ? (
        <Text style={[styles.days, { fontSize: size }]} maxFontSizeMultiplier={1.3}>
          {days}d
        </Text>
      ) : null}
    </View>
  );
}

const makeStyles = (C: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    days: {
      ...typography.caption,
      color: C.textMid,
    },
  });
