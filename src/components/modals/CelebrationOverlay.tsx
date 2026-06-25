import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { C, radii, shadows, spacing, typography } from '../../theme/tokens';
import { hapticSuccess } from '../../utils/haptics';

interface CelebrationOverlayProps {
  visible: boolean;
  message: string;
  // Called when the celebration finishes (auto-dismiss) so the parent can hide it.
  onDone: () => void;
}

// Lightweight celebratory overlay for approve/redeem moments. Pure React Native
// Animated (no confetti library): a spring-in success badge plus a burst of
// emoji particles that fan out and fade. Auto-dismisses after ~1.6s.

const PARTICLES: readonly { dx: number; dy: number; emoji: string }[] = [
  { dx: -90, dy: -110, emoji: '🎉' },
  { dx: 90, dy: -100, emoji: '⭐️' },
  { dx: -120, dy: -10, emoji: '✨' },
  { dx: 120, dy: 0, emoji: '🎊' },
  { dx: -70, dy: 90, emoji: '⭐️' },
  { dx: 80, dy: 100, emoji: '✨' },
  { dx: 0, dy: -140, emoji: '🌟' },
  { dx: 10, dy: 130, emoji: '🎉' },
];

const HOLD_MS = 1600;

export function CelebrationOverlay({
  visible,
  message,
  onDone,
}: CelebrationOverlayProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    hapticSuccess();
    scale.setValue(0);
    progress.setValue(0);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(onDone, HOLD_MS);
    return () => clearTimeout(timer);
  }, [visible, onDone, scale, progress]);

  const particleOpacity = progress.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 1, 0],
  });

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop} pointerEvents="none">
        <View style={styles.stage}>
          {PARTICLES.map((p, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.particle,
                {
                  opacity: particleOpacity,
                  transform: [
                    {
                      translateX: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, p.dx],
                      }),
                    },
                    {
                      translateY: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, p.dy],
                      }),
                    },
                    { scale: progress },
                  ],
                },
              ]}
            >
              {p.emoji}
            </Animated.Text>
          ))}

          <Animated.View
            style={[styles.badge, shadows.lg, { transform: [{ scale }] }]}
          >
            <Ionicons name="checkmark-circle" size={64} color={C.green} />
          </Animated.View>
        </View>

        <Animated.View style={{ opacity: scale }}>
          <Text style={styles.message} maxFontSizeMultiplier={1.4}>
            {message}
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 45, 58, 0.30)',
  },
  stage: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    fontSize: 28,
  },
  badge: {
    width: 110,
    height: 110,
    borderRadius: radii.rFull,
    backgroundColor: C.textWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...typography.headline,
    fontSize: 22,
    color: C.textWhite,
    textAlign: 'center',
    marginTop: spacing.s16,
    paddingHorizontal: spacing.s24,
  },
});
