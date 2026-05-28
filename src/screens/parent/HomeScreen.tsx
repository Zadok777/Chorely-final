import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../../components/layout/Header';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/ui/EmptyState';
import { GlassCard } from '../../components/ui/GlassCard';
import { PointsBadge } from '../../components/ui/PointsBadge';
import { useAuthStore } from '../../store/authStore';
import { useFamilyStore } from '../../store/familyStore';
import { C, spacing, typography } from '../../theme/tokens';
import type { Child, MainTabParamList } from '../../types/app.types';
import { TAB_BAR_CLEARANCE } from './layout';

type Nav = BottomTabNavigationProp<MainTabParamList, 'Home'>;

// The parent's at-a-glance landing. Batch 2 ships a minimal-but-real version:
// family summary + roster + the hooks Phase 5/6 fill in (pending approvals,
// recent activity). Reads live data from the stores hydrated by
// useFamilyBootstrap — no fetching here.

export function HomeScreen() {
  const nav = useNavigation<Nav>();
  const profile = useAuthStore((s) => s.profile);
  const session = useAuthStore((s) => s.session);
  const family = useFamilyStore((s) => s.family);
  const children = useFamilyStore((s) => s.children);

  const displayName =
    profile?.display_name ?? session?.user?.email ?? 'there';
  const totalPoints = children.reduce((sum, c) => sum + (c.points ?? 0), 0);

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <Header
        title={family?.name ?? 'Home'}
        subtitle={`Hi, ${displayName}`}
        avatarName={displayName}
      />

      <GlassCard tint="pink" style={styles.summary}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue} maxFontSizeMultiplier={1.4}>
              {children.length}
            </Text>
            <Text style={styles.summaryLabel} maxFontSizeMultiplier={1.4}>
              {children.length === 1 ? 'Child' : 'Children'}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue} maxFontSizeMultiplier={1.4}>
              {totalPoints}
            </Text>
            <Text style={styles.summaryLabel} maxFontSizeMultiplier={1.4}>
              Total points
            </Text>
          </View>
        </View>
        {family?.invite_code != null ? (
          <View style={styles.inviteRow}>
            <Ionicons name="key-outline" size={14} color={C.textMid} />
            <Text style={styles.inviteText} maxFontSizeMultiplier={1.4}>
              Invite code{'  '}
              <Text style={styles.inviteCode}>{family.invite_code}</Text>
            </Text>
          </View>
        ) : null}
      </GlassCard>

      <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.5}>
        Kids
      </Text>

      {children.length === 0 ? (
        <EmptyState
          icon="happy-outline"
          title="No kids yet"
          description="Add a child to start assigning chores and handing out rewards."
          actionLabel="Add a child"
          onAction={() => nav.navigate('Family')}
        />
      ) : (
        <View style={styles.kidList}>
          {children.map((child, index) => (
            <ChildRow key={child.id} child={child} gradientIndex={index} />
          ))}
        </View>
      )}

      <GlassCard style={styles.upcoming}>
        <View style={styles.upcomingHeader}>
          <Ionicons name="time-outline" size={18} color={C.textMid} />
          <Text style={styles.upcomingTitle} maxFontSizeMultiplier={1.4}>
            Pending approvals
          </Text>
        </View>
        <Text style={styles.upcomingBody} maxFontSizeMultiplier={1.4}>
          Once kids submit chores, they'll line up here for your approval.
        </Text>
      </GlassCard>
    </ScreenContainer>
  );
}

interface ChildRowProps {
  child: Child;
  gradientIndex: number;
}

function ChildRow({ child, gradientIndex }: ChildRowProps) {
  return (
    <GlassCard padding={spacing.s12} style={styles.childCard}>
      <View style={styles.childRow}>
        <Avatar name={child.name} gradientIndex={gradientIndex} size="md" />
        <View style={styles.childMeta}>
          <Text style={styles.childName} maxFontSizeMultiplier={1.4} numberOfLines={1}>
            {child.name}
          </Text>
          {(child.streak_days ?? 0) > 0 ? (
            <Text style={styles.childStreak} maxFontSizeMultiplier={1.4}>
              🔥 {child.streak_days}-day streak
            </Text>
          ) : null}
        </View>
        <PointsBadge points={child.points ?? 0} size="md" />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: TAB_BAR_CLEARANCE,
  },
  summary: {
    marginTop: spacing.s8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.heroNum,
    fontSize: 36,
    color: C.pink,
  },
  summaryLabel: {
    ...typography.caption,
    color: C.textMid,
  },
  summaryDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: C.border,
    marginVertical: spacing.s8,
  },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s4,
    marginTop: spacing.s12,
  },
  inviteText: {
    ...typography.caption,
    color: C.textMid,
  },
  inviteCode: {
    fontFamily: 'DMSans_700Bold',
    color: C.textDark,
    letterSpacing: 1,
  },
  sectionTitle: {
    ...typography.title,
    color: C.textDark,
    marginTop: spacing.s24,
    marginBottom: spacing.s12,
  },
  kidList: {
    gap: spacing.s12,
  },
  childCard: {},
  childRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
  },
  childMeta: {
    flex: 1,
  },
  childName: {
    ...typography.title,
    fontSize: 16,
    color: C.textDark,
  },
  childStreak: {
    ...typography.caption,
    color: C.textMid,
    marginTop: 2,
  },
  upcoming: {
    marginTop: spacing.s24,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s8,
    marginBottom: spacing.s8,
  },
  upcomingTitle: {
    ...typography.title,
    fontSize: 16,
    color: C.textDark,
  },
  upcomingBody: {
    ...typography.body,
    color: C.textMid,
  },
});
