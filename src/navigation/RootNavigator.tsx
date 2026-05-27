import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { C, typography, spacing } from '../theme/tokens';
import { supabase } from '../lib/supabase';
import type { RootStackParamList } from '../types/app.types';

const Stack = createStackNavigator<RootStackParamList>();

type SupabaseStatus =
  | { kind: 'checking' }
  | { kind: 'connected' }
  | { kind: 'error'; message: string };

function PlaceholderScreen() {
  const [status, setStatus] = useState<SupabaseStatus>({ kind: 'checking' });

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

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Hello, Chorely</Text>
      <Text style={styles.subtitle}>Phase 1 + 2 foundation is up.</Text>
      <Text style={[styles.status, status.kind === 'connected' && styles.statusOk]}>
        {status.kind === 'checking' && 'Supabase: checking…'}
        {status.kind === 'connected' && 'Supabase: connected ✓'}
        {status.kind === 'error' && `Supabase error: ${status.message}`}
      </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.s24,
  },
  title: {
    ...typography.headline,
    color: C.pink,
    marginBottom: spacing.s12,
  },
  subtitle: {
    ...typography.body,
    color: C.textMid,
    textAlign: 'center',
    marginBottom: spacing.s20,
  },
  status: {
    ...typography.caption,
    color: C.textMid,
  },
  statusOk: {
    color: C.green,
  },
});
