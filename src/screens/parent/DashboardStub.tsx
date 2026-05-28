import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Header } from '../../components/layout/Header';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { useToast } from '../../components/ui/Toast';
import { signOut as authSignOut } from '../../services/auth';
import { useAuthStore } from '../../store/authStore';
import { C, spacing, typography } from '../../theme/tokens';
import type { RootStackParamList } from '../../types/app.types';

type Nav = StackNavigationProp<RootStackParamList, 'Home'>;

// Temporary post-sign-in landing. Phase 4 Batch 2 replaces this with
// OnboardingWizard (when the user has no family yet) and the real parent
// dashboard (when they do). For now we just prove the auth gate works and
// keep the showcase reachable for visual review.

export function DashboardStub() {
  const nav = useNavigation<Nav>();
  const toast = useToast();
  const profile = useAuthStore((s) => s.profile);
  const session = useAuthStore((s) => s.session);
  const [signingOut, setSigningOut] = useState(false);

  const displayName =
    profile?.display_name ?? session?.user?.email ?? 'there';

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    const res = await authSignOut();
    setSigningOut(false);
    if (!res.success) {
      toast.show({ message: res.error, tone: 'error' });
      return;
    }
    // onAuthStateChange resets authStore; RootNavigator switches to Auth.
  }

  return (
    <ScreenContainer scroll>
      <Header
        title="Chorely"
        avatarName={displayName}
        actions={[
          {
            iconName: 'log-out-outline',
            onPress: handleSignOut,
            accessibilityLabel: 'Sign out',
          },
        ]}
      />

      <View style={styles.content}>
        <Text style={styles.greeting} maxFontSizeMultiplier={1.5}>
          Welcome, {displayName}.
        </Text>
        <Text style={styles.subtitle} maxFontSizeMultiplier={1.5}>
          You're signed in. Onboarding and the real dashboard land in the
          next batch.
        </Text>

        <GlassCard style={styles.statusCard}>
          <Text style={styles.statusLabel} maxFontSizeMultiplier={1.5}>
            Phase 4 · Batch 1
          </Text>
          <Text style={styles.statusBody} maxFontSizeMultiplier={1.5}>
            Auth bootstrap + Welcome + Sign Up + Sign In all working
            end-to-end. Tap below to verify component visuals or sign back
            out to retest the auth gate.
          </Text>
        </GlassCard>

        <View style={styles.actions}>
          <Button
            label="View component showcase"
            variant="secondary"
            onPress={() => nav.navigate('Showcase')}
            fullWidth
          />
          <Button
            label="Sign out"
            variant="danger"
            onPress={handleSignOut}
            loading={signingOut}
            fullWidth
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.s12,
    gap: spacing.s16,
  },
  greeting: {
    ...typography.headline,
    fontSize: 28,
    color: C.textDark,
  },
  subtitle: {
    ...typography.body,
    color: C.textMid,
  },
  statusCard: {
    marginTop: spacing.s8,
  },
  statusLabel: {
    ...typography.caption,
    color: C.pink,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.s8,
  },
  statusBody: {
    ...typography.body,
    color: C.textDark,
  },
  actions: {
    gap: spacing.s12,
    marginTop: spacing.s8,
  },
});
