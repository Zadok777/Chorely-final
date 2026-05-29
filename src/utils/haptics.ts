import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Thin, fire-and-forget wrappers around expo-haptics. No-op on web. Errors are
// swallowed — haptics are a nicety, never something that should surface to the
// user or block a flow.

const supported = Platform.OS === 'ios' || Platform.OS === 'android';

// Success buzz — chore approved, reward redeemed, goal reached.
export function hapticSuccess(): void {
  if (!supported) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
    () => {}
  );
}

// Light tap — a created/saved confirmation, a selection.
export function hapticLight(): void {
  if (!supported) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

// Warning — a sent-back / rejected action.
export function hapticWarning(): void {
  if (!supported) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
    () => {}
  );
}
