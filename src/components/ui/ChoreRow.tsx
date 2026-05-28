import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { C, radii, shadows, spacing, typography } from '../../theme/tokens';
import type { ChoreStatus } from '../../types/app.types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { PointsBadge } from './PointsBadge';

// ChoreRow stays a pure UI component — it receives already-formatted strings
// and primitive props rather than raw DB rows. Screens do the join between
// chores + chore_assignments + children and pass the result here. That makes
// the row trivial to preview, mock, and reuse across status filters.

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface ChoreRowProps {
  title: string;
  pointValue: number;
  status: ChoreStatus;
  assigneeName?: string;
  // Forwarded to Avatar so the same child always lands on the same gradient.
  assigneeGradientIndex?: number;
  // Already-formatted date label ("Today", "Tomorrow", "Mon May 28").
  // Screens own the formatting so the component never imports date-fns.
  dueLabel?: string;
  // Optional category icon name (Ionicons).
  categoryIcon?: IoniconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

interface StatusVisual {
  label: string;
  tone: 'neutral' | 'orange' | 'green' | 'danger';
  iconName: IoniconName;
}

const statusVisuals: Record<ChoreStatus, StatusVisual> = {
  assigned: {
    label: 'To do',
    tone: 'neutral',
    iconName: 'ellipse-outline',
  },
  submitted: {
    label: 'Pending',
    tone: 'orange',
    iconName: 'time-outline',
  },
  approved: {
    label: 'Approved',
    tone: 'green',
    iconName: 'checkmark-circle',
  },
  rejected: {
    label: 'Returned',
    tone: 'danger',
    iconName: 'refresh-outline',
  },
};

export function ChoreRow({
  title,
  pointValue,
  status,
  assigneeName,
  assigneeGradientIndex,
  dueLabel,
  categoryIcon,
  onPress,
  style,
}: ChoreRowProps) {
  const visual = statusVisuals[status];
  const interactive = onPress !== undefined;

  return (
    <Pressable
      onPress={onPress}
      disabled={!interactive}
      accessibilityRole={interactive ? 'button' : undefined}
      accessibilityLabel={`${title}, ${visual.label}, ${pointValue} points`}
      style={({ pressed }) => [
        styles.row,
        shadows.sm,
        pressed && interactive && styles.pressed,
        style,
      ]}
    >
      {assigneeName !== undefined ? (
        <Avatar
          name={assigneeName}
          gradientIndex={assigneeGradientIndex}
          size="md"
        />
      ) : (
        <View style={styles.iconBubble}>
          <Ionicons
            name={categoryIcon ?? 'sparkles-outline'}
            size={20}
            color={C.pink}
          />
        </View>
      )}

      <View style={styles.body}>
        <Text
          style={styles.title}
          numberOfLines={1}
          maxFontSizeMultiplier={1.5}
        >
          {title}
        </Text>
        <View style={styles.metaRow}>
          {assigneeName !== undefined ? (
            <Text style={styles.meta} maxFontSizeMultiplier={1.5}>
              {assigneeName}
            </Text>
          ) : null}
          {assigneeName !== undefined && dueLabel !== undefined ? (
            <View style={styles.dot} />
          ) : null}
          {dueLabel !== undefined ? (
            <Text style={styles.meta} maxFontSizeMultiplier={1.5}>
              {dueLabel}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.trailing}>
        <PointsBadge points={pointValue} size="sm" />
        <Badge
          label={visual.label}
          tone={visual.tone}
          size="sm"
          iconLeft={
            <Ionicons
              name={visual.iconName}
              size={11}
              color={badgeIconColorFor(visual.tone)}
            />
          }
          style={styles.statusBadge}
        />
      </View>
    </Pressable>
  );
}

function badgeIconColorFor(tone: StatusVisual['tone']): string {
  switch (tone) {
    case 'neutral':
      return C.textDark;
    case 'orange':
      return '#C36321';
    case 'green':
      return C.green;
    case 'danger':
      return '#B91C1C';
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.glass,
    borderRadius: radii.r18,
    borderWidth: 1,
    borderColor: C.border,
    padding: spacing.s12,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: radii.rFull,
    backgroundColor: C.pinkAlpha10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    marginLeft: spacing.s12,
    marginRight: spacing.s8,
  },
  title: {
    ...typography.title,
    fontSize: 16,
    color: C.textDark,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    ...typography.caption,
    color: C.textMid,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: radii.rFull,
    backgroundColor: C.textLight,
    marginHorizontal: spacing.s8,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: spacing.s4,
  },
  statusBadge: {
    marginTop: 2,
  },
});
