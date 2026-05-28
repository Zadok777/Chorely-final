import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../../components/layout/Header';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/ui/EmptyState';
import { GlassCard } from '../../components/ui/GlassCard';
import { PointsBadge } from '../../components/ui/PointsBadge';
import { useFamilyStore } from '../../store/familyStore';
import { C, spacing, typography } from '../../theme/tokens';
import { TAB_BAR_CLEARANCE } from './layout';

// Read-only roster for Batch 2. Full management (add / edit / remove kids,
// rename family, invite guardians) arrives in Phase 8 — this screen shows the
// current family so the tab isn't empty after onboarding.
export function FamilyScreen() {
  const family = useFamilyStore((s) => s.family);
  const children = useFamilyStore((s) => s.children);

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <Header title={family?.name ?? 'Family'} subtitle="Your family" />

      {children.length === 0 ? (
        <EmptyState
          icon="happy-outline"
          title="No kids yet"
          description="Adding and editing kids arrives in the Family management phase."
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
                  {child.date_of_birth != null ? (
                    <Text style={styles.sub} maxFontSizeMultiplier={1.4}>
                      Born {child.date_of_birth}
                    </Text>
                  ) : null}
                </View>
                <PointsBadge points={child.points ?? 0} size="md" />
              </View>
            </GlassCard>
          ))}
        </View>
      )}

      <GlassCard style={styles.note}>
        <View style={styles.noteHeader}>
          <Ionicons name="construct-outline" size={18} color={C.textMid} />
          <Text style={styles.noteTitle} maxFontSizeMultiplier={1.4}>
            More family tools soon
          </Text>
        </View>
        <Text style={styles.noteBody} maxFontSizeMultiplier={1.4}>
          Adding kids, editing profiles, renaming your family, and inviting
          another parent are coming in a later phase.
        </Text>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: TAB_BAR_CLEARANCE,
  },
  list: {
    gap: spacing.s12,
    marginTop: spacing.s8,
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
  sub: {
    ...typography.caption,
    color: C.textMid,
    marginTop: 2,
  },
  note: {
    marginTop: spacing.s24,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s8,
    marginBottom: spacing.s8,
  },
  noteTitle: {
    ...typography.title,
    fontSize: 16,
    color: C.textDark,
  },
  noteBody: {
    ...typography.body,
    color: C.textMid,
  },
});
