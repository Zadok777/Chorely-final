import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../../components/layout/Header';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { signOut as authSignOut } from '../../services/auth';
import { renameFamily } from '../../services/families';
import { deleteUserAccount } from '../../services/rpc';
import { updateMySettings } from '../../services/settings';
import { useAuthStore } from '../../store/authStore';
import { useFamilyStore } from '../../store/familyStore';
import { useSettingsStore } from '../../store/settingsStore';
import {
  radii,
  spacing,
  typography,
  useTheme,
  useThemedStyles,
  type Palette,
} from '../../theme';
import type {
  MainTabParamList,
  RootStackParamList,
} from '../../types/app.types';
import { TAB_BAR_CLEARANCE } from './layout';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Settings'>,
  StackNavigationProp<RootStackParamList>
>;

export function SettingsScreen() {
  const nav = useNavigation<Nav>();
  const toast = useToast();
  const { C } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const profile = useAuthStore((s) => s.profile);
  const session = useAuthStore((s) => s.session);
  const family = useFamilyStore((s) => s.family);
  const darkMode = useSettingsStore((s) => s.darkMode);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);

  const [signingOut, setSigningOut] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [savingName, setSavingName] = useState(false);

  const displayName =
    profile?.display_name ?? session?.user?.email ?? 'there';
  const email = session?.user?.email ?? '';

  const onToggleDark = async (value: boolean) => {
    useSettingsStore.getState().setDarkMode(value); // instant, local-first
    const res = await updateMySettings({ dark_mode: value });
    if (!res.success) {
      toast.show({ message: res.error, tone: 'error' });
    }
  };

  const onToggleNotifications = async (value: boolean) => {
    useSettingsStore.getState().setNotificationsEnabled(value);
    const res = await updateMySettings({ notifications_enabled: value });
    if (!res.success) {
      toast.show({ message: res.error, tone: 'error' });
    }
  };

  const startRename = () => {
    setNameDraft(family?.name ?? '');
    setEditingName(true);
  };

  const saveName = async () => {
    const trimmed = nameDraft.trim();
    if (trimmed === '' || family === null) {
      setEditingName(false);
      return;
    }
    setSavingName(true);
    const res = await renameFamily(family.id, trimmed);
    setSavingName(false);
    if (!res.success) {
      toast.show({ message: res.error, tone: 'error', duration: 5000 });
      return;
    }
    useFamilyStore.getState().setFamily(res.data);
    setEditingName(false);
    toast.show({ message: 'Family renamed.', tone: 'success' });
  };

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    const res = await authSignOut();
    setSigningOut(false);
    if (!res.success) {
      toast.show({ message: res.error, tone: 'error' });
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete your account?',
      'This permanently deletes your family, kids, chores, rewards, and all history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteUserAccount();
            if (!res.success) {
              toast.show({ message: res.error, tone: 'error', duration: 5000 });
              return;
            }
            await authSignOut();
          },
        },
      ]
    );
  };

  const switchTrack = { false: C.mutedAlpha20, true: C.pink };

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
          </View>
        </View>
      </GlassCard>

      <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.5}>
        Family
      </Text>
      <GlassCard style={styles.sectionCard}>
        {editingName ? (
          <View style={styles.renameWrap}>
            <Input
              label="Family name"
              value={nameDraft}
              onChangeText={setNameDraft}
              autoCapitalize="words"
              maxLength={40}
            />
            <View style={styles.renameActions}>
              <Button
                label="Save"
                onPress={saveName}
                loading={savingName}
                size="sm"
              />
              <Button
                label="Cancel"
                variant="ghost"
                size="sm"
                onPress={() => setEditingName(false)}
              />
            </View>
          </View>
        ) : (
          <Pressable
            onPress={startRename}
            accessibilityRole="button"
            accessibilityLabel="Rename family"
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <Ionicons name="home-outline" size={20} color={C.textMid} />
            <View style={styles.rowMeta}>
              <Text style={styles.rowLabel} maxFontSizeMultiplier={1.4}>
                Family name
              </Text>
              <Text
                style={styles.rowValue}
                maxFontSizeMultiplier={1.4}
                numberOfLines={1}
              >
                {family?.name ?? '—'}
              </Text>
            </View>
            <Ionicons name="pencil" size={16} color={C.textLight} />
          </Pressable>
        )}
      </GlassCard>

      <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.5}>
        Appearance
      </Text>
      <GlassCard style={styles.sectionCard}>
        <View style={styles.row}>
          <Ionicons name="moon-outline" size={20} color={C.textMid} />
          <View style={styles.rowMeta}>
            <Text style={styles.rowLabel} maxFontSizeMultiplier={1.4}>
              Dark mode
            </Text>
            <Text style={styles.rowHint} maxFontSizeMultiplier={1.4}>
              Switch the whole app to a dark theme.
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={onToggleDark}
            trackColor={switchTrack}
            thumbColor={C.textWhite}
            accessibilityLabel="Dark mode"
          />
        </View>
      </GlassCard>

      <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.5}>
        Notifications
      </Text>
      <GlassCard style={styles.sectionCard}>
        <View style={styles.row}>
          <Ionicons name="notifications-outline" size={20} color={C.textMid} />
          <View style={styles.rowMeta}>
            <Text style={styles.rowLabel} maxFontSizeMultiplier={1.4}>
              Enable notifications
            </Text>
            <Text style={styles.rowHint} maxFontSizeMultiplier={1.4}>
              Get alerts for approvals and redemptions.
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={onToggleNotifications}
            trackColor={switchTrack}
            thumbColor={C.textWhite}
            accessibilityLabel="Enable notifications"
          />
        </View>
      </GlassCard>

      <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.5}>
        Account
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
        <Button
          label="Delete account"
          variant="ghost"
          onPress={confirmDelete}
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}

const makeStyles = (C: Palette) =>
  StyleSheet.create({
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
    sectionCard: {},
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s12,
    },
    rowPressed: {
      opacity: 0.7,
    },
    rowMeta: {
      flex: 1,
    },
    rowLabel: {
      ...typography.body,
      color: C.textDark,
      fontFamily: 'DMSans_600SemiBold',
    },
    rowValue: {
      ...typography.caption,
      color: C.textMid,
      marginTop: 2,
    },
    rowHint: {
      ...typography.caption,
      color: C.textMid,
      marginTop: 2,
    },
    renameWrap: {
      gap: spacing.s12,
    },
    renameActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s8,
    },
    actions: {
      gap: spacing.s12,
      marginTop: spacing.s8,
    },
  });
