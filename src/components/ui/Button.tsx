import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import {
  radii,
  shadows,
  spacing,
  typography,
  useTheme,
  type Palette,
} from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

const heightFor: Record<ButtonSize, number> = {
  sm: 40,
  md: 48, // DESIGN §9 minimum touch target
  lg: 56, // Elementary bracket minimum
};

const horizontalPaddingFor: Record<ButtonSize, number> = {
  sm: spacing.s16,
  md: spacing.s20,
  lg: spacing.s24,
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  style,
  testID,
  accessibilityLabel,
}: ButtonProps) {
  const { C, mode } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          height: heightFor[size],
          paddingHorizontal: horizontalPaddingFor[size],
          width: fullWidth ? '100%' : undefined,
        },
        variantContainerStyle(C, variant),
        variant === 'primary' && !isDisabled && shadows.pink,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {variant === 'secondary' && Platform.OS === 'ios' ? (
        <BlurView
          intensity={20}
          tint={mode === 'dark' ? 'dark' : 'light'}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
      {variant === 'secondary' ? (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: C.glass },
          ]}
        />
      ) : null}
      {loading ? (
        <ActivityIndicator color={textColorFor(C, mode, variant)} />
      ) : (
        <View style={styles.content}>
          {iconLeft !== undefined ? (
            <View style={styles.iconLeft}>{iconLeft}</View>
          ) : null}
          <Text
            style={[typography.button, { color: textColorFor(C, mode, variant) }]}
          >
            {label}
          </Text>
          {iconRight !== undefined ? (
            <View style={styles.iconRight}>{iconRight}</View>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

function variantContainerStyle(C: Palette, variant: ButtonVariant): ViewStyle {
  switch (variant) {
    case 'primary':
      return { backgroundColor: C.pink };
    case 'secondary':
      return {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: C.border,
        overflow: 'hidden',
      };
    case 'ghost':
      return { backgroundColor: 'transparent' };
    case 'danger':
      return {
        backgroundColor: C.redAlpha15,
        borderWidth: 1,
        borderColor: 'rgba(220, 38, 38, 0.40)',
      };
  }
}

function textColorFor(
  C: Palette,
  mode: 'light' | 'dark',
  variant: ButtonVariant
): string {
  switch (variant) {
    case 'primary':
      return C.textWhite;
    case 'secondary':
      return C.textDark;
    case 'ghost':
      return C.pink;
    case 'danger':
      return mode === 'dark' ? '#FF7A7A' : '#B91C1C';
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.r14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.s8,
  },
  iconRight: {
    marginLeft: spacing.s8,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
  },
});
