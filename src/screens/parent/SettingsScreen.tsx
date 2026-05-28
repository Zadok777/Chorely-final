import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Header } from '../../components/layout/Header';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { useToast } from '../../components/ui/Toast';
import { signOut as authSignOut } from '../../services/auth';
import { useAuthStore } from '../../store/authStore';
import { useFamilyStore } from '../../store/familyStore';
import { C, spacing, typography } from '../../theme/tokens';
import type {
  MainTabParamList,
  RootStackParamList,
} from '../../types/app.types';
import { TAB_BAR_CLEARANCE } from './layout';

// Settings can navigate within the tabs AND up to root-stack screens (the dev
// Showcase). Compose both navigation types so `navigate('Showcase')` is typed.
type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Settings'>,
  StackNavigationProp<RootStackParamList>
>;

// Batch 2 ships the essentials: account identity, sign out, and the dev-only
// component showcase. Rename family, dark mode, manage kids, and delete
// account arrive in Phase 8.
export function SettingsScreen() {
  const nav = useNavigation<Nav>();
  const toast = useToast();
  const profile = useAuthStore((s) => s.profile);
  const session = useAuthStore((s) => s.session);
  const family = useFamilyStore((s) => s.family);
  const [signingOut, setSigningOut] = useState(false);

  const displayName =
    profile?.display_name ?? session?.user?.email ?? 'there';
  const email = session?.user?.email ?? '';

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    const res = await authSignOut();
    setSigningOut(false);
    if (!res.success) {
      toast.show({ message: res.error, tone: 'error' });
      return;
    }
    // onAuthStateChange resets the stores; RootNavigator returns to Welcome.
  };

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <Header title="Settings" />

      <GlassCard style={styles.profileCard}>
        <View style={styles.profileRow}>
          <Avatar name={displayName} size="lg" />
          <View style={styles.profileMeta}>
            <Text
              style={styles.profileName}
              maxFontSizeMultiplier={1.4}
              numberOfLines={1}
            >
              {displayName}
            </Text>
            {email !== '' ? (
              <Text
                style={styles.profileSub}
                maxFontSizeMultiplier={1.4}
                numberOfLines={1}
              >
                {email}
              </Text>
            ) : null}
            {family?.name != null ? (
              <Text
                style={styles.profileSub}
                maxFontSizeMultiplier={1.4}
                numberOfLines={1}
              >
                {family.name}
              </Text>
            ) : null}
          </View>
        </View>
      </GlassCard>

      <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.5}>
        More settings soon
      </Text>
      <Text style={styles.sectionBody} maxFontSizeMultiplier={1.4}>
        Renaming your family, dark mode, managing kids, and deleting your
        account are coming in a later phase.
      </Text>

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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: TAB_BAR_CLEARANCE,
  },
  profileCard: {
    marginTop: spacing.s8,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s16,
  },
  profileMeta: {
    flex: 1,
  },
  profileName: {
    ...typography.title,
    color: C.textDark,
  },
  profileSub: {
    ...typography.caption,
    color: C.textMid,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 16,
    color: C.textDark,
    marginTop: spacing.s24,
    marginBottom: spacing.s8,
  },
  sectionBody: {
    ...typography.body,
    color: C.textMid,
  },
  actions: {
    gap: spacing.s12,
    marginTop: spacing.s24,
  },
});
