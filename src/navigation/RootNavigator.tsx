import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ComponentShowcase } from '../screens/dev/ComponentShowcase';
import { DashboardStub } from '../screens/parent/DashboardStub';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { useAuthStore } from '../store/authStore';
import type { RootStackParamList } from '../types/app.types';

const Stack = createStackNavigator<RootStackParamList>();

// Auth ↔ Main switch driven by `authStore.session`. When the session goes
// from null → object (sign-in) or object → null (sign-out), React
// Navigation transitions between the two screen sets automatically — no
// imperative nav.navigate calls needed at the call sites.
//
// useAuthBootstrap (mounted in App.tsx) is responsible for keeping
// authStore.session in sync with supabase.auth via getSession() at launch
// and onAuthStateChange afterwards.

export function RootNavigator() {
  const session = useAuthStore((s) => s.session);
  const signedIn = session !== null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {signedIn ? (
        <>
          <Stack.Screen name="Home" component={DashboardStub} />
          <Stack.Screen name="Showcase" component={ComponentShowcase} />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
