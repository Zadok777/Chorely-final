import React, { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../../components/layout/Header';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Avatar } from '../../components/ui/Avatar';
import { GlassCard } from '../../components/ui/GlassCard';
import { PointsBadge } from '../../components/ui/PointsBadge';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { useToast } from '../../components/ui/Toast';
import { listActivity } from '../../services/activity';
import { listChildren } from '../../services/children';
import { listAssignmentsForFamily, listChores } from '../../services/chores';
import { useActivityStore } from '../../store/activityStore';
import { useAuthStore } from '../../store/authStore';
import { useChoreStore } from '../../store/choreStore';
import { useFamilyStore } from '../../store/familyStore';
import { C, radii, spacing, typography } from '../../theme/tokens';
import type { Child, MainTabParamList } from '../../types/app.types';
import { TAB_BAR_CLEARANCE } from './layout';

type Nav = BottomTabNavigationProp<MainTabParamList, 'Home'>;
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// The real parent dashboard (Phase 5), replacing the minimal HomeScreen. Reads
// live data from the stores and refreshes on mount + pull-to-refresh. Chore and
// reward data only populate once Phases 6–7 ship, so every section renders a
// sensible zero/empty state today.

export function ParentDashboard() {
  const nav = useNavigation<Nav>();
  const toast = useToast();

  const profile = useAuthStore((s) => s.profile);
  const session = useAuthStore((s) => s.session);
  const family = useFamilyStore((s) => s.family);
  const children = useFamilyStore((s) => s.children);
  const assignments = useChoreStore((s) => s.assignments);

  const [refreshing, setRefreshing] = useState(false);

  const displayName =
    profile?.display_name ?? session?.user?.email ?? 'there';
  const familyId = family?.id ?? null;

  const load = useCallback(async () => {
    if (familyId === null) return;
    const { setAssignments, setChores } = useChoreStore.getState();
    const { setActivity } = useActivityStore.getState();
    const { setChildren } = useFamilyStore.getState();

    const [assignRes, choreRes, activityRes, childrenRes] = await Promise.all([
      listAssignmentsForFamily(familyId),
      listChores(familyId),
      listActivity(familyId, 20),
      listChildren(familyId),
    ]);

    if (assignRes.success) setAssignments(assignRes.data);
    if (choreRes.success) setChores(choreRes.data);
    if (activityRes.success) setActivity(activityRes.data);
    if (childrenRes.success) setChildren(childrenRes.data);

    const firstError = [assignRes, choreRes, activityRes, childrenRes].find(
      (r) => !r.success
    );
    if (firstError && !firstError.success) {
      toast.show({ message: firstError.error, tone: 'error' });
    }
  }, [familyId, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const assignedCount = assignments.filter(
    (a) => a.status === 'assigned'
  ).length;
  const completedCount = assignments.filter(
    (a) => a.status === 'approved'
  ).length;
  const pendingCount = assignments.filter(
    (a) => a.status === 'submitted'
  ).length;
  const totalPoints = children.reduce((sum, c) => sum + (c.points ?? 0), 0);

  return (
    <ScreenContainer
      scroll
      contentStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={C.pink}
          colors={[C.pink]}
        />
      }
    >
      <Header
        title={family?.name ?? 'Home'}
        subtitle={`Hi, ${displayName}`}
        avatarName={displayName}
      />

      <PendingApprovals
        count={pendingCount}
        onReview={() => nav.navigate('Chores')}
      />

      <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.5}>
        Today's snapshot
      </Text>
      <View style={styles.statRow}>
        <StatTile label="Assigned" value={assignedCount} tone="pink" icon="clipboard-outline" />
        <StatTile label="Completed" value={completedCount} tone="green" icon="checkmark-circle-outline" />
        <StatTile label="Points" value={totalPoints} tone="orange" icon="star-outline" />
      </View>

      <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.5}>
        Quick actions
      </Text>
      <View style={styles.actionGrid}>
        <QuickAction label="Add chore" icon="add-circle-outline" onPress={() => nav.navigate('Chores')} />
        <QuickAction label="Create reward" icon="gift-outline" onPress={() => nav.navigate('Rewards')} />
        <QuickAction label="View family" icon="people-outline" onPress={() => nav.navigate('Family')} />
        <QuickAction label="Review requests" icon="checkbox-outline" onPress={() => nav.navigate('Chores')} badge={pendingCount} />
      </View>

      <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.5}>
        Family progress
      </Text>
      {children.length === 0 ? (
        <GlassCard style={styles.emptyCard}>
          <Text style={styles.emptyText} maxFontSizeMultiplier={1.4}>
            Add a child in the Family tab to start tracking progress.
          </Text>
        </GlassCard>
      ) : (
        <View style={styles.progressList}>
          {children.map((child, index) => (
            <ChildProgressCard
              key={child.id}
              child={child}
              gradientIndex={index}
              total={
                assignments.filter((a) => a.child_id === child.id).length
              }
              done={
                assignments.filter(
                  (a) => a.child_id === child.id && a.status === 'approved'
                ).length
              }
            />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------

interface PendingApprovalsProps {
  count: number;
  onReview: () => void;
}

function PendingApprovals({ count, onReview }: PendingApprovalsProps) {
  const caughtUp = count === 0;
  return (
    <GlassCard
      tint={caughtUp ? 'green' : 'pink'}
      style={styles.pendingCard}
    >
      <View style={styles.pendingRow}>
        <View style={styles.pendingIcon}>
          <Ionicons
            name={caughtUp ? 'checkmark-done-outline' : 'notifications-outline'}
            size={22}
            color={caughtUp ? C.green : C.pink}
          />
        </View>
        <View style={styles.pendingMeta}>
          <Text style={styles.pendingTitle} maxFontSizeMultiplier={1.4}>
            {caughtUp ? 'All caught up' : 'Pending approvals'}
          </Text>
          <Text style={styles.pendingBody} maxFontSizeMultiplier={1.4}>
            {caughtUp
              ? 'No chores waiting on you right now.'
              : `${count} chore${count === 1 ? '' : 's'} waiting for your review.`}
          </Text>
        </View>
        {!caughtUp ? (
          <Pressable
            onPress={onReview}
            accessibilityRole="button"
            accessibilityLabel="Review pending approvals"
            hitSlop={8}
            style={({ pressed }) => [styles.reviewBtn, pressed && styles.pressed]}
          >
            <Text style={styles.reviewText} maxFontSizeMultiplier={1.3}>
              Review
            </Text>
          </Pressable>
        ) : null}
      </View>
    </GlassCard>
  );
}

interface StatTileProps {
  label: string;
  value: number;
  tone: 'pink' | 'green' | 'orange';
  icon: IoniconName;
}

const STAT_COLOR: Record<StatTileProps['tone'], string> = {
  pink: C.pink,
  green: C.green,
  orange: C.orange,
};

function StatTile({ label, value, tone, icon }: StatTileProps) {
  return (
    <GlassCard padding={spacing.s12} style={styles.statTile}>
      <Ionicons name={icon} size={18} color={STAT_COLOR[tone]} />
      <Text
        style={[styles.statValue, { color: STAT_COLOR[tone] }]}
        maxFontSizeMultiplier={1.4}
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text style={styles.statLabel} maxFontSizeMultiplier={1.3} numberOfLines={1}>
        {label}
      </Text>
    </GlassCard>
  );
}

interface QuickActionProps {
  label: string;
  icon: IoniconName;
  onPress: () => void;
  badge?: number;
}

function QuickAction({ label, icon, onPress, badge }: QuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.actionItem, pressed && styles.pressed]}
    >
      <GlassCard padding={spacing.s16} style={styles.actionCard}>
        <View style={styles.actionIconWrap}>
          <Ionicons name={icon} size={22} color={C.pink} />
          {badge !== undefined && badge > 0 ? (
            <View style={styles.actionBadge}>
              <Text style={styles.actionBadgeText} maxFontSizeMultiplier={1.2}>
                {badge}
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.actionLabel} maxFontSizeMultiplier={1.3} numberOfLines={1}>
          {label}
        </Text>
      </GlassCard>
    </Pressable>
  );
}

interface ChildProgressCardProps {
  child: Child;
  gradientIndex: number;
  total: number;
  done: number;
}

function ChildProgressCard({
  child,
  gradientIndex,
  total,
  done,
}: ChildProgressCardProps) {
  const ratio = total > 0 ? done / total : 0;
  return (
    <GlassCard padding={spacing.s12} style={styles.progressCard}>
      <View style={styles.progressRow}>
        <Avatar name={child.name} gradientIndex={gradientIndex} size="md" />
        <View style={styles.progressMeta}>
          <Text style={styles.progressName} maxFontSizeMultiplier={1.4} numberOfLines={1}>
            {child.name}
          </Text>
          <View style={styles.progressSub}>
            <PointsBadge points={child.points ?? 0} size="sm" />
            {(child.streak_days ?? 0) > 0 ? (
              <Text style={styles.streak} maxFontSizeMultiplier={1.3}>
                🔥 {child.streak_days}d
              </Text>
            ) : null}
          </View>
        </View>
        <ProgressRing
          value={ratio}
          size={52}
          strokeWidth={6}
          color="gradient"
          centerLabel={
            <Text style={styles.ringLabel} maxFontSizeMultiplier={1.2}>
              {done}/{total}
            </Text>
          }
        />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: TAB_BAR_CLEARANCE,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  sectionTitle: {
    ...typography.title,
    color: C.textDark,
    marginTop: spacing.s24,
    marginBottom: spacing.s12,
  },
  // Pending approvals
  pendingCard: {
    marginTop: spacing.s8,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
  },
  pendingIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.rFull,
    backgroundColor: C.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingMeta: {
    flex: 1,
  },
  pendingTitle: {
    ...typography.title,
    fontSize: 16,
    color: C.textDark,
  },
  pendingBody: {
    ...typography.caption,
    color: C.textMid,
    marginTop: 2,
  },
  reviewBtn: {
    paddingHorizontal: spacing.s16,
    paddingVertical: spacing.s8,
    borderRadius: radii.rFull,
    backgroundColor: C.pink,
  },
  reviewText: {
    ...typography.button,
    color: C.textWhite,
  },
  // Stat tiles
  statRow: {
    flexDirection: 'row',
    gap: spacing.s12,
  },
  statTile: {
    flex: 1,
    alignItems: 'flex-start',
  },
  statValue: {
    ...typography.heroNum,
    fontSize: 28,
    marginTop: spacing.s4,
  },
  statLabel: {
    ...typography.caption,
    color: C.textMid,
  },
  // Quick actions
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s12,
  },
  actionItem: {
    width: '47.5%',
    flexGrow: 1,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.rFull,
    backgroundColor: C.pinkAlpha10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radii.rFull,
    backgroundColor: C.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBadgeText: {
    ...typography.caption,
    fontSize: 10,
    color: C.textWhite,
    fontFamily: 'DMSans_700Bold',
  },
  actionLabel: {
    ...typography.button,
    color: C.textDark,
    flexShrink: 1,
  },
  // Family progress
  progressList: {
    gap: spacing.s12,
  },
  progressCard: {},
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
  },
  progressMeta: {
    flex: 1,
  },
  progressName: {
    ...typography.title,
    fontSize: 16,
    color: C.textDark,
  },
  progressSub: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s8,
    marginTop: spacing.s4,
  },
  streak: {
    ...typography.caption,
    color: C.textMid,
  },
  ringLabel: {
    ...typography.caption,
    fontSize: 11,
    color: C.textDark,
    fontFamily: 'DMSans_700Bold',
  },
  emptyCard: {},
  emptyText: {
    ...typography.body,
    color: C.textMid,
    textAlign: 'center',
  },
});
