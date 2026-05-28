// Temporary visual showcase of every Phase 3 component.
// This screen is dev-only; it gets deleted (along with the `Showcase` route)
// when Phase 4 wires the real auth + main navigators.

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ChoreRow } from '../../components/ui/ChoreRow';
import { EmptyState } from '../../components/ui/EmptyState';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { PointsBadge } from '../../components/ui/PointsBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { RewardCard } from '../../components/ui/RewardCard';
import {
  SkeletonLoader,
  SkeletonRow,
} from '../../components/ui/SkeletonLoader';
import { useToast } from '../../components/ui/Toast';
import { ChorelyLogo } from '../../components/brand/ChorelyLogo';
import { Header } from '../../components/layout/Header';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { TabBar } from '../../components/layout/TabBar';
import { C, spacing, typography } from '../../theme/tokens';
import type { RootStackParamList } from '../../types/app.types';

type Nav = StackNavigationProp<RootStackParamList, 'Showcase'>;

export function ComponentShowcase() {
  const nav = useNavigation<Nav>();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('home');
  const [inputBasic, setInputBasic] = useState('');
  const [inputError, setInputError] = useState('not-an-email');
  const [inputMulti, setInputMulti] = useState('');

  return (
    <ScreenContainer style={styles.root}>
      <Header
        title="Component Showcase"
        subtitle="Phase 3 preview"
        onBack={() => nav.goBack()}
        actions={[
          {
            iconName: 'notifications-outline',
            onPress: () =>
              toast.show({
                message: 'Bell tapped — header action works.',
                tone: 'info',
              }),
            accessibilityLabel: 'Notifications',
            badge: true,
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <SectionTitle>Brand · animated</SectionTitle>
        <GlassCard style={styles.section}>
          <View style={styles.row}>
            <ChorelyLogo variant="icon" iconSize={48} animated />
            <View style={styles.spacer16} />
            <ChorelyLogo variant="horizontal" iconSize={40} animated />
          </View>
          <View style={styles.spacer20} />
          <ChorelyLogo variant="full" iconSize={80} animated />
          <View style={styles.spacer16} />
          <Text style={styles.caption}>
            Eyes blink every ~3.5s; gentle bob loop. Pass{' '}
            <Text style={styles.code}>animated</Text> to ChorelyLogo /
            ChorelyIcon. Static by default elsewhere.
          </Text>
        </GlassCard>

        {/* Surfaces */}
        <SectionTitle>GlassCard tints</SectionTitle>
        <View style={styles.grid2}>
          <GlassCard style={styles.gridCell} tint="light">
            <Text style={styles.cardLabel}>light</Text>
          </GlassCard>
          <GlassCard style={styles.gridCell} tint="pink">
            <Text style={styles.cardLabel}>pink</Text>
          </GlassCard>
          <GlassCard style={styles.gridCell} tint="orange">
            <Text style={styles.cardLabel}>orange</Text>
          </GlassCard>
          <GlassCard style={styles.gridCell} tint="green">
            <Text style={styles.cardLabel}>green</Text>
          </GlassCard>
        </View>

        {/* Buttons */}
        <SectionTitle>Buttons</SectionTitle>
        <GlassCard style={styles.section}>
          <View style={styles.stack8}>
            <Button label="Primary" onPress={() => {}} />
            <Button label="Secondary" onPress={() => {}} variant="secondary" />
            <Button label="Ghost" onPress={() => {}} variant="ghost" />
            <Button label="Danger" onPress={() => {}} variant="danger" />
            <Button label="Loading" onPress={() => {}} loading />
            <Button label="Disabled" onPress={() => {}} disabled />
            <View style={styles.row}>
              <View style={styles.flex1}>
                <Button label="sm" onPress={() => {}} size="sm" />
              </View>
              <View style={styles.spacer8} />
              <View style={styles.flex1}>
                <Button label="md" onPress={() => {}} size="md" />
              </View>
              <View style={styles.spacer8} />
              <View style={styles.flex1}>
                <Button label="lg" onPress={() => {}} size="lg" />
              </View>
            </View>
            <Button
              label="With icons"
              onPress={() => {}}
              iconLeft={<Ionicons name="star" size={16} color="#fff" />}
              iconRight={
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              }
            />
          </View>
        </GlassCard>

        {/* Inputs */}
        <SectionTitle>Inputs</SectionTitle>
        <GlassCard style={styles.section}>
          <View style={styles.stack16}>
            <Input
              label="Email"
              placeholder="you@example.com"
              value={inputBasic}
              onChangeText={setInputBasic}
              keyboardType="email-address"
              autoCapitalize="none"
              helper="Used for sign-in only"
            />
            <Input
              label="Confirm"
              value={inputError}
              onChangeText={setInputError}
              error="Enter a valid email address"
            />
            <Input
              label="Notes"
              placeholder="Optional notes…"
              value={inputMulti}
              onChangeText={setInputMulti}
              multiline
              numberOfLines={3}
            />
            <Input
              label="Disabled"
              value="Read-only value"
              onChangeText={() => {}}
              editable={false}
            />
          </View>
        </GlassCard>

        {/* Avatars */}
        <SectionTitle>Avatars</SectionTitle>
        <GlassCard style={styles.section}>
          <View style={styles.row}>
            <Avatar name="Alex" size="sm" />
            <View style={styles.spacer12} />
            <Avatar name="Brooke" size="md" />
            <View style={styles.spacer12} />
            <Avatar name="Charlie" size="lg" />
            <View style={styles.spacer12} />
            <Avatar name="Dakota" size="xl" />
          </View>
          <View style={styles.spacer16} />
          <Text style={styles.caption}>Gradient cycle 0–4</Text>
          <View style={styles.spacer8} />
          <View style={styles.row}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.avatarSlot}>
                <Avatar name={`A${i + 1}`} gradientIndex={i} size="md" />
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Badges */}
        <SectionTitle>Badges</SectionTitle>
        <GlassCard style={styles.section}>
          <View style={styles.wrapRow}>
            <Badge label="Neutral" tone="neutral" />
            <Badge label="Pink" tone="pink" />
            <Badge label="Orange" tone="orange" />
            <Badge label="Green" tone="green" />
            <Badge label="Danger" tone="danger" />
            <Badge label="Muted" tone="muted" />
          </View>
          <View style={styles.spacer12} />
          <View style={styles.wrapRow}>
            <Badge label="sm" tone="pink" size="sm" />
            <Badge label="md" tone="pink" size="md" />
            <Badge
              label="with icon"
              tone="green"
              iconLeft={
                <Ionicons name="checkmark" size={11} color={C.green} />
              }
            />
          </View>
        </GlassCard>

        {/* PointsBadge */}
        <SectionTitle>PointsBadge</SectionTitle>
        <GlassCard style={styles.section}>
          <View style={styles.wrapRow}>
            <PointsBadge points={5} size="sm" />
            <PointsBadge points={120} size="md" />
            <PointsBadge points={1840} size="lg" />
          </View>
          <View style={styles.spacer12} />
          <View style={styles.wrapRow}>
            <PointsBadge points={10} tone="earn" />
            <PointsBadge points={45} tone="spend" />
          </View>
        </GlassCard>

        {/* Progress */}
        <SectionTitle>Progress</SectionTitle>
        <GlassCard style={styles.section}>
          <ProgressBar value={0.4} label="Today's chores" valueLabel="2 / 5" />
          <View style={styles.spacer16} />
          <ProgressBar value={0.85} color={C.green} />
          <View style={styles.spacer20} />
          <View style={styles.row}>
            <ProgressRing value={0.25} size={80} />
            <View style={styles.spacer16} />
            <ProgressRing value={0.6} size={96} color="gradient" />
            <View style={styles.spacer16} />
            <ProgressRing
              value={0.92}
              size={112}
              strokeWidth={10}
              color={C.green}
              centerLabel={
                <View style={{ alignItems: 'center' }}>
                  <Text style={[typography.title, { color: C.textDark }]}>
                    92%
                  </Text>
                  <Text style={[typography.caption, { color: C.textMid }]}>
                    streak
                  </Text>
                </View>
              }
            />
          </View>
        </GlassCard>

        {/* Chore rows */}
        <SectionTitle>ChoreRow — all states</SectionTitle>
        <View style={styles.stack8}>
          <ChoreRow
            title="Make the bed"
            assigneeName="Mia"
            assigneeGradientIndex={0}
            pointValue={10}
            status="assigned"
            dueLabel="Today"
            onPress={() => {}}
          />
          <ChoreRow
            title="Take out trash"
            assigneeName="Jordan"
            assigneeGradientIndex={2}
            pointValue={15}
            status="submitted"
            dueLabel="Today"
            onPress={() => {}}
          />
          <ChoreRow
            title="Feed the dog"
            assigneeName="Mia"
            assigneeGradientIndex={0}
            pointValue={5}
            status="approved"
            dueLabel="Yesterday"
          />
          <ChoreRow
            title="Empty dishwasher"
            assigneeName="Jordan"
            assigneeGradientIndex={2}
            pointValue={20}
            status="rejected"
            dueLabel="Yesterday"
            onPress={() => {}}
          />
        </View>

        {/* Reward cards */}
        <SectionTitle>RewardCard</SectionTitle>
        <View style={styles.grid2}>
          <RewardCard
            title="Movie night"
            description="Pick the movie + snacks"
            pointCost={150}
            iconName="film"
            onPress={() => {}}
            style={styles.gridCell}
          />
          <RewardCard
            title="Extra screen time"
            description="30 minutes"
            pointCost={50}
            iconName="phone-portrait"
            accentColor={C.pink}
            onPress={() => {}}
            style={styles.gridCell}
          />
          <RewardCard
            title="Skate park trip"
            pointCost={400}
            iconName="bicycle"
            locked
            style={styles.gridCell}
          />
          <RewardCard
            title="Ice cream"
            description="Any flavor"
            pointCost={75}
            iconName="ice-cream"
            justUnlocked
            onPress={() => {}}
            style={styles.gridCell}
          />
        </View>

        {/* Skeleton */}
        <SectionTitle>SkeletonLoader</SectionTitle>
        <GlassCard style={styles.section}>
          <View style={styles.stack12}>
            <SkeletonLoader shape="line" width="60%" height={18} />
            <SkeletonLoader shape="line" width="80%" height={12} />
            <SkeletonLoader shape="block" height={56} />
            <View style={styles.row}>
              <SkeletonLoader shape="circle" size={48} />
              <View style={styles.spacer12} />
              <View style={styles.flex1}>
                <SkeletonLoader shape="line" width="70%" height={14} />
                <View style={styles.spacer8} />
                <SkeletonLoader shape="line" width="40%" height={10} />
              </View>
            </View>
          </View>
        </GlassCard>
        <View style={styles.spacer8} />
        <SkeletonRow />

        {/* Empty state */}
        <SectionTitle>EmptyState</SectionTitle>
        <GlassCard style={styles.section}>
          <EmptyState
            icon="checkbox-outline"
            title="No chores yet"
            description="Add your first chore and assign it to a child."
            actionLabel="Add chore"
            onAction={() =>
              toast.show({
                message: 'CTA tapped',
                tone: 'success',
              })
            }
          />
        </GlassCard>

        {/* Toast triggers */}
        <SectionTitle>Toast</SectionTitle>
        <GlassCard style={styles.section}>
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Button
                label="Success"
                onPress={() =>
                  toast.show({
                    message: '+15 points awarded to Mia',
                    tone: 'success',
                  })
                }
              />
            </View>
            <View style={styles.spacer8} />
            <View style={styles.flex1}>
              <Button
                label="Error"
                onPress={() =>
                  toast.show({
                    message: 'Could not reach server',
                    tone: 'error',
                  })
                }
                variant="danger"
              />
            </View>
          </View>
          <View style={styles.spacer8} />
          <Button
            label="Info"
            onPress={() =>
              toast.show({
                message: 'Synced 3 chores from the server',
                tone: 'info',
              })
            }
            variant="secondary"
          />
        </GlassCard>

        <View style={styles.tabBarSpacer} />
      </ScrollView>

      <TabBar
        tabs={demoTabs}
        activeKey={activeTab}
        onChange={setActiveTab}
      />
    </ScreenContainer>
  );
}

const demoTabs = [
  {
    key: 'home',
    label: 'Home',
    iconActive: 'home' as const,
    iconInactive: 'home-outline' as const,
  },
  {
    key: 'chores',
    label: 'Chores',
    iconActive: 'checkbox' as const,
    iconInactive: 'checkbox-outline' as const,
  },
  {
    key: 'rewards',
    label: 'Rewards',
    iconActive: 'gift' as const,
    iconInactive: 'gift-outline' as const,
  },
  {
    key: 'family',
    label: 'Family',
    iconActive: 'people' as const,
    iconInactive: 'people-outline' as const,
  },
  {
    key: 'settings',
    label: 'Settings',
    iconActive: 'settings' as const,
    iconInactive: 'settings-outline' as const,
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.5}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: C.bg,
  },
  scrollContent: {
    paddingBottom: spacing.s24,
  },
  sectionTitle: {
    ...typography.caption,
    color: C.textMid,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.s24,
    marginBottom: spacing.s8,
  },
  section: {
    marginBottom: spacing.s4,
  },
  cardLabel: {
    ...typography.caption,
    color: C.textDark,
    fontFamily: 'DMSans_700Bold',
    textAlign: 'center',
  },
  caption: {
    ...typography.caption,
    color: C.textMid,
  },
  code: {
    fontFamily: 'Courier',
    color: C.textDark,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s12,
  },
  gridCell: {
    width: '47%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s8,
  },
  stack8: {
    gap: spacing.s8,
  },
  stack12: {
    gap: spacing.s12,
  },
  stack16: {
    gap: spacing.s16,
  },
  flex1: {
    flex: 1,
  },
  spacer8: {
    width: spacing.s8,
    height: spacing.s8,
  },
  spacer12: {
    width: spacing.s12,
    height: spacing.s12,
  },
  spacer16: {
    width: spacing.s16,
    height: spacing.s16,
  },
  spacer20: {
    width: spacing.s20,
    height: spacing.s20,
  },
  avatarSlot: {
    marginRight: spacing.s8,
  },
  tabBarSpacer: {
    height: 96,
  },
});
