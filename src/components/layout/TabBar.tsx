import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, radii, shadows, spacing, typography } from '../../theme/tokens';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export interface TabItem {
  // Stable key — used for equality with `activeKey`. Often the route name.
  key: string;
  label: string;
  // Two icon names so we can render the filled variant when active and the
  // outline variant when inactive (DESIGN.md §9: icon variant per state).
  iconActive: IoniconName;
  iconInactive: IoniconName;
}

interface TabBarProps {
  tabs: ReadonlyArray<TabItem>;
  activeKey: string;
  onChange: (key: string) => void;
  style?: StyleProp<ViewStyle>;
}

// Standalone glassmorphism pill bottom nav. This component takes a plain
// `tabs` array and an `activeKey` rather than React Navigation's
// `BottomTabBarProps` directly. Phase 4 writes a 10-line adapter that turns
// `state.routes` into our `TabItem[]` and calls `navigation.navigate(key)`.
// Keeping it decoupled means we can preview the bar without a navigator and
// reuse it if we ever swap navigation libraries.

export function TabBar({ tabs, activeKey, onChange, style }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, spacing.s12);

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: bottomPad },
        style,
      ]}
      pointerEvents="box-none"
    >
      <View style={[styles.pillOuter, shadows.lg]}>
        <View style={styles.pillInner}>
          {Platform.OS === 'ios' ? (
            <BlurView
              intensity={24}
              tint="light"
              style={StyleSheet.absoluteFillObject}
            />
          ) : null}
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: C.glass },
            ]}
          />
          <View style={styles.tabsRow}>
            {tabs.map((tab) => {
              const active = tab.key === activeKey;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => onChange(tab.key)}
                  accessibilityRole="button"
                  accessibilityLabel={tab.label}
                  accessibilityState={{ selected: active }}
                  style={({ pressed }) => [
                    styles.tab,
                    pressed && styles.tabPressed,
                  ]}
                >
                  <Ionicons
                    name={active ? tab.iconActive : tab.iconInactive}
                    size={22}
                    color={active ? C.pink : C.textMid}
                  />
                  <Text
                    style={[
                      styles.tabLabel,
                      active && styles.tabLabelActive,
                    ]}
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.s16,
  },
  pillOuter: {
    borderRadius: radii.r24,
    backgroundColor: 'transparent',
  },
  pillInner: {
    borderRadius: radii.r24,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingVertical: spacing.s8,
    paddingHorizontal: spacing.s8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.s8,
    gap: 2,
    borderRadius: radii.r16,
  },
  tabPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  tabLabel: {
    ...typography.caption,
    fontSize: 10,
    color: C.textMid,
  },
  tabLabelActive: {
    color: C.pink,
    fontFamily: 'DMSans_700Bold',
  },
});
