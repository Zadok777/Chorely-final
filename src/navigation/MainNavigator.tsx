import React from 'react';
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';

import { TabBar, type TabItem } from '../components/layout/TabBar';
import { ChoresScreen } from '../screens/parent/ChoresScreen';
import { FamilyScreen } from '../screens/parent/FamilyScreen';
import { HomeScreen } from '../screens/parent/HomeScreen';
import { RewardsScreen } from '../screens/parent/RewardsScreen';
import { SettingsScreen } from '../screens/parent/SettingsScreen';
import { C } from '../theme/tokens';
import type { MainTabParamList } from '../types/app.types';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Icon + label metadata per route. Filled icon when active, outline when not
// (DESIGN.md §9). Keyed by route name so the adapter is a direct lookup.
const TAB_META: Record<keyof MainTabParamList, TabItem> = {
  Home: {
    key: 'Home',
    label: 'Home',
    iconActive: 'home',
    iconInactive: 'home-outline',
  },
  Chores: {
    key: 'Chores',
    label: 'Chores',
    iconActive: 'checkbox',
    iconInactive: 'checkbox-outline',
  },
  Rewards: {
    key: 'Rewards',
    label: 'Rewards',
    iconActive: 'gift',
    iconInactive: 'gift-outline',
  },
  Family: {
    key: 'Family',
    label: 'Family',
    iconActive: 'people',
    iconInactive: 'people-outline',
  },
  Settings: {
    key: 'Settings',
    label: 'Settings',
    iconActive: 'settings',
    iconInactive: 'settings-outline',
  },
};

// Adapter: turn React Navigation's tab state into our decoupled TabBar's
// (tabs, activeKey, onChange) contract. Emits the standard `tabPress` event so
// listeners (e.g. scroll-to-top) keep working, then navigates if not prevented.
function ChorelyTabBar({ state, navigation }: BottomTabBarProps) {
  const tabs = state.routes.map(
    (route) => TAB_META[route.name as keyof MainTabParamList]
  );
  const activeKey = state.routes[state.index]?.name ?? 'Home';

  return (
    <TabBar
      tabs={tabs}
      activeKey={activeKey}
      onChange={(key) => {
        const route = state.routes.find((r) => r.name === key);
        if (route === undefined) return;
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
        if (!event.defaultPrevented) {
          navigation.navigate(route.name);
        }
      }}
    />
  );
}

export function MainNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <ChorelyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: C.bg },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chores" component={ChoresScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Family" component={FamilyScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
