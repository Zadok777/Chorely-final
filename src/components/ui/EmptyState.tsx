import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { C, radii, spacing, typography } from '../../theme/tokens';
import { Button } from './Button';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface EmptyStateProps {
  // Ionicons name. Defaults to a friendly sparkles icon.
  icon?: IoniconName;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  icon = 'sparkles-outline',
  title,
  description,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  const hasAction = actionLabel !== undefined && onAction !== undefined;

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.iconBubble}>
        <Ionicons name={icon} size={32} color={C.pink} />
      </View>
      <Text style={styles.title} maxFontSizeMultiplier={1.5}>
        {title}
      </Text>
      {description !== undefined ? (
        <Text style={styles.description} maxFontSizeMultiplier={1.5}>
          {description}
        </Text>
      ) : null}
      {hasAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} variant="primary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.s24,
    paddingVertical: spacing.s32,
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: radii.rFull,
    backgroundColor: C.pinkAlpha10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.s16,
  },
  title: {
    ...typography.title,
    color: C.textDark,
    textAlign: 'center',
    marginBottom: spacing.s8,
  },
  description: {
    ...typography.body,
    color: C.textMid,
    textAlign: 'center',
    maxWidth: 280,
  },
  action: {
    marginTop: spacing.s20,
  },
});
