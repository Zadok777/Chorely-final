import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { radii, useThemedStyles, type Palette } from '../../theme';

export type SkeletonShape = 'block' | 'line' | 'circle';

interface SkeletonLoaderProps {
  shape?: SkeletonShape;
  width?: number | `${number}%`;
  height?: number;
  // For `circle` shape, both width and height default to this size if set.
  size?: number;
  // Override the corner radius. For `line` defaults to height/2; for
  // `circle` defaults to half the diameter; for `block` defaults to r12.
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

// DESIGN.md §9: "Loading: skeleton shimmer, not spinners". We animate an
// opacity pulse with Reanimated instead of a linear-gradient shimmer because
// shimmer requires masked layers that don't survive Android well. A subtle
// pulse reads as "loading" without becoming a distraction during real waits.

export function SkeletonLoader({
  shape = 'block',
  width = '100%',
  height,
  size,
  radius,
  style,
}: SkeletonLoaderProps) {
  const styles = useThemedStyles(makeStyles);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, {
        duration: 900,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const dims = computeDimensions(shape, width, height, size);
  const finalRadius = radius ?? defaultRadiusFor(shape, dims.height);

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width: dims.width,
          height: dims.height,
          borderRadius: finalRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

function computeDimensions(
  shape: SkeletonShape,
  width: number | `${number}%`,
  height: number | undefined,
  size: number | undefined
): { width: number | `${number}%`; height: number } {
  if (shape === 'circle') {
    const px = size ?? 48;
    return { width: px, height: px };
  }
  if (shape === 'line') {
    return { width, height: height ?? 12 };
  }
  // block
  return { width, height: height ?? 64 };
}

function defaultRadiusFor(shape: SkeletonShape, height: number): number {
  switch (shape) {
    case 'line':
      return height / 2;
    case 'circle':
      return height / 2;
    case 'block':
      return radii.r12;
  }
}

// Convenience composite — the typical "list row" skeleton used while a
// page of chores/rewards/activity loads.
export function SkeletonRow() {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.row}>
      <SkeletonLoader shape="circle" size={48} />
      <View style={styles.rowBody}>
        <SkeletonLoader shape="line" width="70%" height={14} />
        <SkeletonLoader shape="line" width="40%" height={10} />
      </View>
    </View>
  );
}

const makeStyles = (C: Palette) =>
  StyleSheet.create({
    base: {
      backgroundColor: C.mutedAlpha20,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: C.glass,
      borderRadius: radii.r18,
      borderWidth: 1,
      borderColor: C.border,
    },
    rowBody: {
      flex: 1,
      marginLeft: 12,
      gap: 8,
    },
  });
