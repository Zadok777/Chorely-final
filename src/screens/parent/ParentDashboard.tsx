import React, { useCallback, useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AddChildModal } from '../../components/modals/AddChildModal';
import { CreateChoreModal } from '../../components/modals/CreateChoreModal';
import { CreateRewardModal } from '../../components/modals/CreateRewardModal';
import { Avatar } from '../../components/ui/Avatar';
import { GradientCard } from '../../components/ui/GradientCard';
import { useToast } from '../../components/ui/Toast';
import { listActivity } from '../../services/activity';
import { listChildren } from '../../services/children';
import { listAssignmentsForFamily, listChores } from '../../services/chores';
import { useActivityStore } from '../../store/activityStore';
import { useAuthStore } from '../../store/authStore';
import { useChoreStore } from '../../store/choreStore';
import { useFamilyStore } from '../../store/familyStore';
import {
  AVATAR_GRADIENTS,
  GRADIENTS,
  radii,
  spacing,
  typography,
  useTheme,
  useThemedStyles,
  type Palette,
} from '../../theme';
import type { Child, MainTabParamList } from '../../types/app.types';
import { TAB_BAR_CLEARANCE } from './layout';

type Nav = BottomTabNavigationProp<MainTabParamList, 'Home'>;
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function greetingPeriod(): string {
  const h = new Date().getHours();
  if (h < 12) return 'MORNING';
  if (h < 17) return 'AFTERNOON';
  return 'EVENING';
}

function weekday(): string {
  return new Date()
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toUpperCase();
}

export function ParentDashboard() {
  const nav = useNavigation<Nav>();
  const toast = useToast();
  const { C } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const profile = useAuthStore((s) => s.profile);
  const session = useAuthStore((s) => s.session);
  const family = useFamilyStore((s) => s.family);
  const children = useFamilyStore((s) => s.children);
  const chores = useChoreStore((s) => s.chores);
  const assignments = useChoreStore((s) => s.assignments);

  const [refreshing, setRefreshing] = useState(false);
  const [choreModal, setChoreModal] = useState(false);
  const [rewardModal, setRewardModal] = useState(false);
  const [childModal, setChildModal] = useState(false);

  const displayName =
    profile?.display_name ?? session?.user?.email?.split('@')[0] ?? 'there';
  const familyId = family?.id ?? null;

  const load = useCallback(async () => {
    if (familyId === null) return;
    const { setAssignments, setChores } = useChoreStore.getState();
    const { setActivity } = useActivityStore.getState();
    const { setChildren } = useFamilyStore.getState();
    const [a, c, act, kids] = await Promise.all([
      listAssignmentsForFamily(familyId),
      listChores(familyId),
      listActivity(familyId, 20),
      listChildren(familyId),
    ]);
    if (a.success) setAssignments(a.data);
    if (c.success) setChores(c.data);
    if (act.success) setActivity(act.data);
    if (kids.success) setChildren(kids.data);
  }, [familyId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const pending = assignments.filter((a) => a.status === 'submitted');
  const assignedCount = assignments.filter((a) => a.status === 'assigned').length;
  const doneCount = assignments.filter((a) => a.status === 'approved').length;
  const totalPoints = children.reduce((s, c) => s + (c.points ?? 0), 0);

  const firstPending = pending[0];
  const firstPendingChore = firstPending
    ? chores.find((c) => c.id === firstPending.chore_id)
    : undefined;
  const firstPendingChild = firstPending
    ? children.find((c) => c.id === firstPending.child_id)
    : undefined;

  return (
    <>
      <ScreenContainer
        scroll
        contentStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.dateLabel} maxFontSizeMultiplier={1.3}>
              {weekday()} {greetingPeriod()}
            </Text>
            <Text style={styles.greeting} maxFontSizeMultiplier={1.4} numberOfLines={1}>
              Hey <Text style={styles.greetingName}>{displayName}</Text>
            </Text>
            <Text style={styles.subGreeting} maxFontSizeMultiplier={1.3}>
              {children.length} {children.length === 1 ? 'kid' : 'kids'}
              {pending.length > 0
                ? ` · ${pending.length} ${pending.length === 1 ? 'thing needs' : 'things need'} your eyes`
                : ' · all caught up'}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => nav.navigate('Review')}
              accessibilityRole="button"
              accessibilityLabel="Review approvals"
              style={({ pressed }) => [styles.bell, pressed && styles.pressed]}
            >
              <Ionicons name="notifications-outline" size={20} color={C.textDark} />
              {pending.length > 0 ? <View style={styles.bellDot} /> : null}
            </Pressable>
            <Avatar name={displayName} size="md" />
          </View>
        </View>

        {/* Approval hero */}
        {pending.length > 0 ? (
          <Pressable
            onPress={() => nav.navigate('Review')}
            accessibilityRole="button"
            accessibilityLabel={`${pending.length} awaiting approval`}
          >
            <GradientCard colors={GRADIENTS.violet} style={styles.heroCard}>
              <View style={styles.heroTop}>
                <Text style={styles.heroLabel} maxFontSizeMultiplier={1.3}>
                  AWAITING YOUR APPROVAL
                </Text>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.9)" />
              </View>
              <View style={styles.heroBody}>
                <Text style={styles.heroCount} maxFontSizeMultiplier={1.3}>
                  {pending.length}
                </Text>
                <View style={styles.heroMeta}>
                  <Text style={styles.heroChore} maxFontSizeMultiplier={1.3} numberOfLines={1}>
                    {firstPendingChild?.name ?? 'A child'} ·{' '}
                    {firstPendingChore?.title ?? 'a chore'}
                  </Text>
                  {pending.length > 1 ? (
                    <Text style={styles.heroMore} maxFontSizeMultiplier={1.3}>
                      +{pending.length - 1} more to review
                    </Text>
                  ) : null}
                </View>
              </View>
            </GradientCard>
          </Pressable>
        ) : null}

        {/* Today's snapshot */}
        <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.5}>
          Today's snapshot
        </Text>
        <View style={styles.snapshotRow}>
          <SnapshotTile value={assignedCount} label="Assigned" tone="pink" />
          <SnapshotTile value={doneCount} label="Done" tone="green" />
          <SnapshotTile value={totalPoints} label="Points" tone="orange" />
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.5}>
          Quick actions
        </Text>
        <View style={styles.actionGrid}>
          <QuickAction
            label="Add Chore"
            icon="add"
            bg={C.pink}
            onPress={() => setChoreModal(true)}
          />
          <QuickAction
            label="New Reward"
            icon="gift"
            bg="#4D9FFF"
            onPress={() => setRewardModal(true)}
          />
          <QuickAction
            label="Add Kid"
            icon="person-add"
            bg={C.green}
            onPress={() => setChildModal(true)}
          />
          <QuickAction
            label="Set Goal"
            icon="trophy"
            bg="#FFB020"
            onPress={() =>
              toast.show({ message: 'Goals are coming soon.', tone: 'info' })
            }
          />
        </View>

        {/* Family progress */}
        <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.5}>
          Family progress
        </Text>
        {children.length === 0 ? (
          <Pressable
            onPress={() => setChildModal(true)}
            style={({ pressed }) => [styles.emptyKids, pressed && styles.pressed]}
          >
            <Text style={styles.emptyKidsText} maxFontSizeMultiplier={1.4}>
              Add your first child to track progress here.
            </Text>
          </Pressable>
        ) : (
          <View style={styles.kidList}>
            {children.map((child, index) => (
              <KidProgress
                key={child.id}
                child={child}
                gradientIndex={index}
                total={assignments.filter((a) => a.child_id === child.id).length}
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

      <CreateChoreModal
        visible={choreModal}
        onClose={() => setChoreModal(false)}
        onCreated={load}
      />
      <CreateRewardModal
        visible={rewardModal}
        onClose={() => setRewardModal(false)}
        onCreated={load}
      />
      <AddChildModal
        visible={childModal}
        onClose={() => setChildModal(false)}
        onAdded={load}
      />
    </>
  );
}

// ---------------------------------------------------------------------------

function SnapshotTile({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: 'pink' | 'green' | 'orange';
}) {
  const { C } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const bg =
    tone === 'pink'
      ? C.pinkAlpha10
      : tone === 'green'
        ? C.greenAlpha15
        : C.orangeAlpha10;
  const color = tone === 'pink' ? C.pink : tone === 'green' ? C.green : C.orange;
  return (
    <View style={[styles.snapTile, { backgroundColor: bg }]}>
      <Text style={[styles.snapValue, { color }]} maxFontSizeMultiplier={1.3}>
        {value}
      </Text>
      <Text style={styles.snapLabel} maxFontSizeMultiplier={1.2} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function QuickAction({
  label,
  icon,
  bg,
  onPress,
}: {
  label: string;
  icon: IoniconName;
  bg: string;
  onPress: () => void;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.actionItem, pressed && styles.pressed]}
    >
      <View style={[styles.actionIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color="#FFFFFF" />
      </View>
      <Text style={styles.actionLabel} maxFontSizeMultiplier={1.3} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

function KidProgress({
  child,
  gradientIndex,
  total,
  done,
}: {
  child: Child;
  gradientIndex: number;
  total: number;
  done: number;
}) {
  const styles = useThemedStyles(makeStyles);
  const ratio = total > 0 ? done / total : 0;
  const gradient = AVATAR_GRADIENTS[gradientIndex % AVATAR_GRADIENTS.length];
  const ageLabel = ageFromDob(child.date_of_birth);

  return (
    <View style={styles.kidCard}>
      <View style={styles.kidTop}>
        <Avatar name={child.name} gradientIndex={gradientIndex} size="md" />
        <View style={styles.kidMeta}>
          <Text style={styles.kidName} maxFontSizeMultiplier={1.3} numberOfLines={1}>
            {child.name}
            {ageLabel !== null ? (
              <Text style={styles.kidAge}>  ·  age {ageLabel}</Text>
            ) : null}
          </Text>
          <Text style={styles.kidSub} maxFontSizeMultiplier={1.3}>
            {done}/{total} chores today
            {(child.streak_days ?? 0) > 0 ? ` · ${child.streak_days}🔥` : ''}
          </Text>
        </View>
        <View style={styles.kidPoints}>
          <Text style={styles.kidPointsValue} maxFontSizeMultiplier={1.2}>
            {child.points ?? 0}
          </Text>
          <Text style={styles.kidPointsLabel} maxFontSizeMultiplier={1.1}>
            POINTS
          </Text>
        </View>
      </View>
      <View style={styles.barTrack}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${Math.round(ratio * 100)}%` }]}
        />
      </View>
    </View>
  );
}

function ageFromDob(dob: string | null): number | null {
  if (dob === null || dob === '') return null;
  const d = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

const makeStyles = (C: Palette) =>
  StyleSheet.create({
    content: {
      paddingBottom: TAB_BAR_CLEARANCE,
    },
    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingTop: spacing.s8,
      marginBottom: spacing.s16,
    },
    headerText: {
      flex: 1,
    },
    dateLabel: {
      ...typography.caption,
      color: C.textMid,
      letterSpacing: 1,
      marginBottom: 2,
    },
    greeting: {
      ...typography.headline,
      fontSize: 28,
      color: C.textDark,
    },
    greetingName: {
      color: C.pink,
    },
    subGreeting: {
      ...typography.caption,
      color: C.textMid,
      marginTop: 2,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s8,
    },
    bell: {
      width: 40,
      height: 40,
      borderRadius: radii.rFull,
      backgroundColor: C.glass,
      borderWidth: 1,
      borderColor: C.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bellDot: {
      position: 'absolute',
      top: 9,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: radii.rFull,
      backgroundColor: C.pink,
      borderWidth: 2,
      borderColor: C.bg,
    },
    // Hero
    heroCard: {
      marginBottom: spacing.s8,
    },
    heroTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    heroLabel: {
      ...typography.caption,
      color: 'rgba(255,255,255,0.85)',
      letterSpacing: 1,
    },
    heroBody: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s16,
      marginTop: spacing.s12,
    },
    heroCount: {
      ...typography.heroNum,
      fontSize: 52,
      color: '#FFFFFF',
    },
    heroMeta: {
      flex: 1,
    },
    heroChore: {
      ...typography.title,
      fontSize: 17,
      color: '#FFFFFF',
    },
    heroMore: {
      ...typography.caption,
      color: 'rgba(255,255,255,0.85)',
      marginTop: 2,
    },
    // Sections
    sectionTitle: {
      ...typography.title,
      color: C.textDark,
      marginTop: spacing.s24,
      marginBottom: spacing.s12,
    },
    // Snapshot
    snapshotRow: {
      flexDirection: 'row',
      gap: spacing.s12,
    },
    snapTile: {
      flex: 1,
      borderRadius: radii.r18,
      paddingVertical: spacing.s16,
      paddingHorizontal: spacing.s12,
      alignItems: 'flex-start',
    },
    snapValue: {
      ...typography.heroNum,
      fontSize: 30,
    },
    snapLabel: {
      ...typography.caption,
      color: C.textMid,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginTop: spacing.s4,
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s12,
      backgroundColor: C.glass,
      borderRadius: radii.r18,
      borderWidth: 1,
      borderColor: C.border,
      padding: spacing.s12,
    },
    actionIcon: {
      width: 40,
      height: 40,
      borderRadius: radii.r12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionLabel: {
      ...typography.button,
      color: C.textDark,
      flexShrink: 1,
    },
    // Empty kids
    emptyKids: {
      backgroundColor: C.glass,
      borderRadius: radii.r18,
      borderWidth: 1,
      borderColor: C.border,
      padding: spacing.s20,
    },
    emptyKidsText: {
      ...typography.body,
      color: C.textMid,
      textAlign: 'center',
    },
    // Kid progress
    kidList: {
      gap: spacing.s12,
    },
    kidCard: {
      backgroundColor: C.glass,
      borderRadius: radii.r18,
      borderWidth: 1,
      borderColor: C.border,
      padding: spacing.s16,
    },
    kidTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s12,
      marginBottom: spacing.s12,
    },
    kidMeta: {
      flex: 1,
    },
    kidName: {
      ...typography.title,
      fontSize: 16,
      color: C.textDark,
    },
    kidAge: {
      ...typography.caption,
      color: C.textMid,
    },
    kidSub: {
      ...typography.caption,
      color: C.textMid,
      marginTop: 2,
    },
    kidPoints: {
      alignItems: 'flex-end',
    },
    kidPointsValue: {
      ...typography.title,
      fontSize: 20,
      color: C.textDark,
    },
    kidPointsLabel: {
      ...typography.caption,
      fontSize: 10,
      color: C.textMid,
      letterSpacing: 0.6,
    },
    barTrack: {
      height: 8,
      borderRadius: radii.rFull,
      backgroundColor: C.mutedAlpha20,
      overflow: 'hidden',
    },
    barFill: {
      height: 8,
      borderRadius: radii.rFull,
    },
  });
