import type { PurchasesPackage } from 'react-native-purchases';

// Introductory-offer detection for the paywall.
//
// Free trials are configured at the STORE / RevenueCat layer (CLAUDE.md §12) —
// the app never runs its own trial timer. RevenueCat surfaces a configured
// trial as the product's `introPrice` with a zero `price`. These helpers turn
// that store-supplied data into UI copy so the trial actually shows on the
// paywall once it's configured (decided 2026-06-23: prefer 7 days on yearly).

/** Minimal shape of RevenueCat's `PurchasesIntroPrice` we rely on. */
export interface IntroPriceLike {
  /** Intro price in local currency. 0 means a free trial. */
  price: number;
  /** Billing-period unit of the offer: DAY | WEEK | MONTH | YEAR. */
  periodUnit: string;
  /** Number of units in the offer period (e.g. 7 for a 7-day trial). */
  periodNumberOfUnits: number;
}

const UNIT_WORD: Record<string, string> = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

/**
 * Human label for a free-trial intro offer (e.g. "7-day free trial"), or null
 * when the offer is absent, not free, zero-length, or has an unknown unit.
 */
export function freeTrialLabelFromIntro(
  intro: IntroPriceLike | null | undefined
): string | null {
  if (!intro || intro.price > 0 || intro.periodNumberOfUnits <= 0) return null;
  const unit = UNIT_WORD[intro.periodUnit];
  if (!unit) return null;
  return `${intro.periodNumberOfUnits}-${unit} free trial`;
}

/** Free-trial label for a package's product, or null if it has no free trial. */
export function freeTrialLabel(pkg: PurchasesPackage): string | null {
  return freeTrialLabelFromIntro(pkg.product.introPrice);
}

/** Minimal structural shape we read off a package to label its trial. */
export interface PackageTrialInfo {
  packageType: string;
  product: { introPrice: IntroPriceLike | null };
}

/**
 * Display label for a package's free trial.
 *
 * Uses the real, store-configured trial whenever one is present. When `preview`
 * is true it falls back to a synthetic "7-day free trial" on the annual plan so
 * the trial UI can be eyeballed before a real store offer exists. `preview` is
 * only ever passed `true` under `__DEV__`, and this affects DISPLAY COPY ONLY —
 * the purchase call always uses the unmodified RevenueCat package.
 */
export function trialLabelForDisplay(
  pkg: PackageTrialInfo,
  preview: boolean
): string | null {
  const real = freeTrialLabelFromIntro(pkg.product.introPrice);
  if (real) return real;
  if (preview && pkg.packageType === 'ANNUAL') return '7-day free trial';
  return null;
}
