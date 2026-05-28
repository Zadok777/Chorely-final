import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  SafeAreaView,
  type Edge,
} from 'react-native-safe-area-context';

import { C, spacing } from '../../theme/tokens';

interface ScreenContainerProps {
  children: React.ReactNode;
  // Wraps content in a ScrollView with sensible defaults for forms + long lists.
  scroll?: boolean;
  // Which edges the SafeAreaView pads. Defaults to all four.
  edges?: ReadonlyArray<Edge>;
  // 16px horizontal padding (DESIGN §6) is applied by default. Opt out for
  // full-bleed children like custom headers or media.
  noHorizontalPadding?: boolean;
  // On iOS the keyboard covers inputs by default. Set true on form screens.
  keyboardAvoiding?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function ScreenContainer({
  children,
  scroll = false,
  edges,
  noHorizontalPadding = false,
  keyboardAvoiding = false,
  style,
  contentStyle,
}: ScreenContainerProps) {
  const paddingStyle: ViewStyle | undefined = noHorizontalPadding
    ? undefined
    : { paddingHorizontal: spacing.s16 };

  const inner = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, paddingStyle, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, paddingStyle, contentStyle]}>{children}</View>
  );

  const body = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {inner}
    </KeyboardAvoidingView>
  ) : (
    inner
  );

  return (
    <SafeAreaView style={[styles.root, style]} edges={edges}>
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.s24,
  },
});
