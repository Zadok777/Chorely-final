import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { C, spacing, typography } from '../theme/tokens';
import { supabase } from '../lib/supabase';
import {
  getMyProfile,
  signOut as authSignOut,
  signUp as authSignUp,
} from '../services/auth';
import { listMyFamilies } from '../services/families';
import { completeOnboarding } from '../services/rpc';
import type { RootStackParamList } from '../types/app.types';

const Stack = createStackNavigator<RootStackParamList>();

type SupabaseStatus =
  | { kind: 'checking' }
  | { kind: 'connected' }
  | { kind: 'error'; message: string };

type LogLine = { tone: 'info' | 'ok' | 'err'; text: string };

function PlaceholderScreen() {
  const [status, setStatus] = useState<SupabaseStatus>({ kind: 'checking' });
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<LogLine[]>([]);

  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ error }) => {
        if (!mounted) return;
        if (error) {
          setStatus({ kind: 'error', message: error.message });
        } else {
          setStatus({ kind: 'connected' });
        }
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : 'unknown error';
        setStatus({ kind: 'error', message });
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function runSmokeTest() {
    if (running) return;
    setRunning(true);
    const lines: LogLine[] = [];
    const push = (line: LogLine) => {
      lines.push(line);
      setLog([...lines]);
    };

    const ts = Date.now();
    const email = `smoke-${ts}@chorely-test.local`;
    const password = `Smoke!${ts}Pw`;

    push({ tone: 'info', text: `1. signUp ${email}` });
    const signup = await authSignUp(email, password, 'Smoke Tester');
    if (!signup.success) {
      push({ tone: 'err', text: `   ✗ ${signup.error}` });
      setRunning(false);
      return;
    }
    push({
      tone: 'ok',
      text: `   ✓ user ${signup.data.user?.id?.slice(0, 8) ?? 'null'} session ${signup.data.session ? 'yes' : 'no'}`,
    });

    if (!signup.data.session) {
      push({
        tone: 'info',
        text: '   (no session — email confirmation may be on; stopping)',
      });
      setRunning(false);
      return;
    }

    push({ tone: 'info', text: '2. getMyProfile (trigger autocreates row)' });
    const profile = await getMyProfile();
    if (!profile.success) {
      push({ tone: 'err', text: `   ✗ ${profile.error}` });
      setRunning(false);
      return;
    }
    push({
      tone: 'ok',
      text: `   ✓ profile ${profile.data?.id?.slice(0, 8) ?? 'null'}`,
    });

    push({
      tone: 'info',
      text: '3. completeOnboarding("Smoke Family", "Smoke Kid")',
    });
    const onboard = await completeOnboarding('Smoke Family', 'Smoke Kid');
    if (!onboard.success) {
      push({ tone: 'err', text: `   ✗ ${onboard.error}` });
      setRunning(false);
      return;
    }
    push({
      tone: 'ok',
      text: `   ✓ family ${onboard.data.id.slice(0, 8)} code ${onboard.data.invite_code}`,
    });

    push({ tone: 'info', text: '4. listMyFamilies' });
    const fams = await listMyFamilies();
    if (!fams.success) {
      push({ tone: 'err', text: `   ✗ ${fams.error}` });
      setRunning(false);
      return;
    }
    const names = fams.data.map((f) => f.name).join(', ') || '(none)';
    push({
      tone: 'ok',
      text: `   ✓ ${fams.data.length} family/families: ${names}`,
    });

    push({ tone: 'ok', text: 'SMOKE TEST PASSED ✓' });
    setRunning(false);
  }

  async function clearSession() {
    const res = await authSignOut();
    if (!res.success) {
      setLog((prev) => [
        ...prev,
        { tone: 'err', text: `sign out failed: ${res.error}` },
      ]);
      return;
    }
    setLog((prev) => [...prev, { tone: 'info', text: 'signed out' }]);
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Hello, Chorely</Text>
      <Text style={styles.subtitle}>Phase 1 + 2 foundation is up.</Text>
      <Text
        style={[styles.status, status.kind === 'connected' && styles.statusOk]}
      >
        {status.kind === 'checking' && 'Supabase: checking…'}
        {status.kind === 'connected' && 'Supabase: connected ✓'}
        {status.kind === 'error' && `Supabase error: ${status.message}`}
      </Text>

      <View style={styles.row}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            running && styles.buttonDisabled,
            pressed && !running && styles.buttonPressed,
          ]}
          disabled={running}
          onPress={runSmokeTest}
        >
          {running ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Run smoke test</Text>
          )}
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.secondaryButtonPressed,
          ]}
          onPress={clearSession}
        >
          <Text style={styles.secondaryButtonText}>Sign out</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.log}
        contentContainerStyle={styles.logContent}
        showsVerticalScrollIndicator
      >
        {log.length === 0 ? (
          <Text style={styles.logEmpty}>
            Press “Run smoke test” to verify Phase 2c end-to-end.
          </Text>
        ) : (
          log.map((line, i) => (
            <Text
              key={i}
              style={[
                styles.logLine,
                line.tone === 'ok' && styles.logLineOk,
                line.tone === 'err' && styles.logLineErr,
              ]}
            >
              {line.text}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: spacing.s24,
    paddingTop: spacing.s48,
    paddingBottom: spacing.s24,
  },
  title: {
    ...typography.headline,
    color: C.pink,
    marginBottom: spacing.s8,
  },
  subtitle: {
    ...typography.body,
    color: C.textMid,
    marginBottom: spacing.s12,
  },
  status: {
    ...typography.caption,
    color: C.textMid,
    marginBottom: spacing.s20,
  },
  statusOk: {
    color: C.green,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.s12,
    marginBottom: spacing.s16,
  },
  button: {
    backgroundColor: C.pink,
    paddingVertical: spacing.s12,
    paddingHorizontal: spacing.s20,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: C.textMid,
    paddingVertical: spacing.s12,
    paddingHorizontal: spacing.s20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonPressed: {
    opacity: 0.7,
  },
  secondaryButtonText: {
    ...typography.body,
    color: C.textMid,
  },
  log: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: spacing.s16,
    paddingVertical: spacing.s12,
  },
  logContent: {
    paddingBottom: spacing.s16,
  },
  logEmpty: {
    ...typography.caption,
    color: C.textMid,
    fontStyle: 'italic',
  },
  logLine: {
    ...typography.caption,
    color: C.textDark,
    fontFamily: 'Courier',
    marginBottom: 2,
  },
  logLineOk: {
    color: C.green,
  },
  logLineErr: {
    color: '#D03A3A',
  },
});
