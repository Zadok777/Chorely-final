import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { C, typography, spacing } from '../theme/tokens';

type RootStackParamList = {
  Placeholder: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function PlaceholderScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Hello, Chorely</Text>
      <Text style={styles.subtitle}>Phase 1 foundation is up.</Text>
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
  },
});
