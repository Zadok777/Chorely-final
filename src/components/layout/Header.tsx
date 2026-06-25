import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  radii,
  spacing,
  typography,
  useTheme,
  useThemedStyles,
  type Palette,
} from '../../theme';
import { Avatar } from '../ui/Avatar';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface HeaderAction {
  iconName: IoniconName;
  onPress: () => void;
  accessibilityLabel: string;
  // Optional badge dot for unread / pending counters.
  badge?: boolean;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  // When provided, renders an avatar on the leading side (used on Dashboard).
  // Mutually exclusive with `onBack` — back button takes precedence visually.
  avatarName?: string;
  avatarGradientIndex?: number;
  // When provided, renders a back chevron that calls this handler.
  onBack?: () => void;
  // Up to ~3 trailing icon buttons.
  actions?: readonly HeaderAction[];
  style?: StyleProp<ViewStyle>;
}

// The shared header used on every parent screen. Lavender background sits
// behind it via ScreenContainer; the header itself is transparent so it
// blends. Per DESIGN.md §11 the parent dashboard uses an avatar + greeting,
// while inner screens use a back chevron + title.

export function Header({
  title,
  subtitle,
  avatarName,
  avatarGradientIndex,
  onBack,
  actions = [],
  style,
}: HeaderProps) {
  const { C } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={[styles.row, style]}>
      <View style={styles.leading}>
        {onBack !== undefined ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={8}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="chevron-back" size={22} color={C.textDark} />
          </Pressable>
        ) : avatarName !== undefined ? (
          <Avatar
            name={avatarName}
            gradientIndex={avatarGradientIndex}
            size="md"
          />
        ) : null}
      </View>

      <View style={styles.titleBlock}>
        {subtitle !== undefined ? (
          <Text style={styles.subtitle} maxFontSizeMultiplier={1.5}>
            {subtitle}
          </Text>
        ) : null}
        <Text
          style={styles.title}
          numberOfLines={1}
          maxFontSizeMultiplier={1.5}
        >
          {title}
        </Text>
      </View>

      <View style={styles.actions}>
        {actions.map((action, i) => (
          <Pressable
            key={`${action.iconName}-${i}`}
            onPress={action.onPress}
            accessibilityRole="button"
            accessibilityLabel={action.accessibilityLabel}
            hitSlop={8}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name={action.iconName} size={22} color={C.textDark} />
            {action.badge === true ? <View style={styles.badgeDot} /> : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const makeStyles = (C: Palette) =>
  StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s12,
    minHeight: 56,
  },
  leading: {
    width: 48,
    alignItems: 'flex-start',
  },
  titleBlock: {
    flex: 1,
    marginHorizontal: spacing.s12,
  },
  title: {
    ...typography.title,
    color: C.textDark,
  },
  subtitle: {
    ...typography.caption,
    color: C.textMid,
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s8,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.rFull,
    backgroundColor: C.glass,
    borderWidth: 1,
    borderColor: C.border,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.85,
  },
  badgeDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: radii.rFull,
    backgroundColor: C.pink,
    borderWidth: 2,
    borderColor: C.bg,
  },
  });
