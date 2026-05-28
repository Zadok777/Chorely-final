import React, { useCallback, useState } from 'react';
import { Alert, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../../components/layout/Header';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AddChildModal } from '../../components/modals/AddChildModal';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/ui/EmptyState';
import { GlassCard } from '../../components/ui/GlassCard';
import { PointsBadge } from '../../components/ui/PointsBadge';
import { useToast } from '../../components/ui/Toast';
import { deleteChild, listChildren } from '../../services/children';
import { useFamilyStore } from '../../store/familyStore';
import {
  radii,
  spacing,
  typography,
  useTheme,
  useThemedStyles,
  type Palette,
} from '../../theme';
import type { Child } from '../../types/app.types';
import { TAB_BAR_CLEARANCE } from './layout';

export function FamilyScreen() {
  const toast = useToast();
  const { C } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const family = useFamilyStore((s) => s.family);
  const children = useFamilyStore((s) => s.children);

  const [refreshing, setRefreshing] = useState(false);
  const [addVisible, setAddVisible] = useState(false);

  const familyId = family?.id ?? null;

  const load = useCallback(async () => {
    if (familyId === null) return;
    const res = await listChildren(familyId);
    if (res.success) useFamilyStore.getState().setChildren(res.data);
  }, [familyId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const confirmRemove = (child: Child) => {
    Alert.alert(
      `Remove ${child.name}?`,
      'This permanently deletes their chores, points, and history.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteChild(child.id);
            if (!res.success) {
              toast.show({ message: res.error, tone: 'error', duration: 5000 });
              return;
            }
            useFamilyStore.getState().removeChild(child.id);
            toast.show({ message: `${child.name} removed.`, tone: 'info' });
          },
        },
      ]
    );
  };

  return (
    <>
      <ScreenContainer
        scroll
        contentStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header
          title={family?.name ?? 'Family'}
          subtitle="Your family"
          actions={[
            {
              iconName: 'person-add',
              onPress: () => setAddVisible(true),
              accessibilityLabel: 'Add a child',
            },
          ]}
        />

        {family?.invite_code != null ? (
          <GlassCard tint="pink" style={styles.inviteCard}>
            <View style={styles.inviteRow}>
              <Ionicons name="key-outline" size={18} color={C.pink} />
              <View style={styles.inviteMeta}>
                <Text style={styles.inviteLabel} maxFontSizeMultiplier={1.3}>
                  Family invite code
                </Text>
                <Text style={styles.inviteCode} maxFontSizeMultiplier={1.3}>
                  {family.invite_code}
                </Text>
              </View>
            </View>
          </GlassCard>
        ) : null}

        {children.length === 0 ? (
          <EmptyState
            icon="happy-outline"
            title="No kids yet"
            description="Add your first child to start assigning chores and rewards."
            actionLabel="Add a child"
            onAction={() => setAddVisible(true)}
          />
        ) : (
          <View style={styles.list}>
            {children.map((child, index) => (
              <GlassCard
                key={child.id}
                padding={spacing.s12}
                style={styles.card}
              >
                <View style={styles.row}>
                  <Avatar name={child.name} gradientIndex={index} size="md" />
                  <View style={styles.meta}>
                    <Text
                      style={styles.name}
                      maxFontSizeMultiplier={1.4}
                      numberOfLines={1}
                    >
                      {child.name}
                    </Text>
                    <View style={styles.subRow}>
                      <PointsBadge points={child.points ?? 0} size="sm" />
                      {(child.streak_days ?? 0) > 0 ? (
                        <Text style={styles.streak} maxFontSizeMultiplier={1.3}>
                          🔥 {child.streak_days}d
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <Pressable
                    onPress={() => confirmRemove(child)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${child.name}`}
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.removeBtn,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons name="trash-outline" size={18} color={C.textMid} />
                  </Pressable>
                </View>
              </GlassCard>
            ))}
          </View>
        )}
      </ScreenContainer>

      <AddChildModal
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onAdded={load}
      />
    </>
  );
}

const makeStyles = (C: Palette) =>
  StyleSheet.create({
    content: {
      paddingBottom: TAB_BAR_CLEARANCE,
    },
    inviteCard: {
      marginTop: spacing.s8,
    },
    inviteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s12,
    },
    inviteMeta: {
      flex: 1,
    },
    inviteLabel: {
      ...typography.caption,
      color: C.textMid,
    },
    inviteCode: {
      ...typography.title,
      fontSize: 18,
      color: C.textDark,
      letterSpacing: 1.5,
      marginTop: 2,
    },
    list: {
      gap: spacing.s12,
      marginTop: spacing.s16,
    },
    card: {},
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s12,
    },
    meta: {
      flex: 1,
    },
    name: {
      ...typography.title,
      fontSize: 16,
      color: C.textDark,
    },
    subRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s8,
      marginTop: spacing.s4,
    },
    streak: {
      ...typography.caption,
      color: C.textMid,
    },
    removeBtn: {
      width: 40,
      height: 40,
      borderRadius: radii.rFull,
      backgroundColor: C.glassLight,
      borderWidth: 1,
      borderColor: C.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: {
      transform: [{ scale: 0.94 }],
      opacity: 0.85,
    },
  });
