import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

// Public SDK keys are safe to ship in the client. We default to RevenueCat's
// Test Store key so the integration works before the real App Store / Play
// Store apps exist. Once those are created in RevenueCat, drop the real
// `appl_…` / `goog_…` keys into .env (EXPO_PUBLIC_-prefixed so Expo exposes
// them to the bundle) and they automatically override the test key — no code
// change needed.
const TEST_STORE_KEY = 'test_eJhCgXXDTmxbYWntEkIWaoRhxYx';

const iosApiKey =
  process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? TEST_STORE_KEY;
const androidApiKey =
  process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? TEST_STORE_KEY;

let configured = false;

/**
 * Configure RevenueCat once at app launch. No-ops on web and inside Expo Go
 * (the native module isn't present in either), so it never breaks the dev
 * flow. Identity is handled separately via identifyPurchaser/logoutPurchaser.
 */
export function initPurchases(): void {
  if (Platform.OS === 'web' || configured) return;
  const apiKey = Platform.OS === 'ios' ? iosApiKey : androidApiKey;
  try {
    if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    Purchases.configure({ apiKey });
    configured = true;
  } catch (err) {
    // Expo Go / unsupported runtime — purchases just stay disabled.
    if (__DEV__) console.warn('[revenuecat] SDK unavailable, skipping:', err);
  }
}

/** Link RevenueCat to a specific signed-in parent (call on sign-in). */
export async function identifyPurchaser(userId: string): Promise<void> {
  if (Platform.OS === 'web' || !configured) return;
  try {
    await Purchases.logIn(userId);
  } catch (err) {
    if (__DEV__) console.warn('[revenuecat] logIn failed:', err);
  }
}

/** Reset RevenueCat to an anonymous user (call on sign-out). */
export async function logoutPurchaser(): Promise<void> {
  if (Platform.OS === 'web' || !configured) return;
  try {
    await Purchases.logOut();
  } catch (err) {
    if (__DEV__) console.warn('[revenuecat] logOut failed:', err);
  }
}
