// App-level domain types and typed navigation params.
// Row aliases re-export from the generated database.types so the rest of
// the codebase can `import { Profile, Family, Child, ... } from '../types/app.types'`
// without binding to the Supabase generator's `Tables<'name'>` helper.

import type { Tables } from './database.types';

export type Profile = Tables<'profiles'>;
export type Family = Tables<'families'>;
export type FamilyMember = Tables<'family_members'>;
export type Child = Tables<'children'>;
export type Chore = Tables<'chores'>;
export type ChoreAssignment = Tables<'chore_assignments'>;
export type Reward = Tables<'rewards'>;
export type RewardRedemption = Tables<'reward_redemptions'>;
export type PointTransaction = Tables<'point_transactions'>;
export type ActivityLog = Tables<'activity_log'>;
export type UserSettings = Tables<'user_settings'>;

// Re-export the age-bracket type from the theme module so consumers don't have
// to know it lives in tokens.ts. The theme module owns the type because the
// bracket-themes map is keyed by it; the domain happens to share the name.
export type { AgeBracket } from '../theme/tokens';

// Chore assignment status string literals matching the DB CHECK constraint.
export type ChoreStatus = 'assigned' | 'submitted' | 'approved' | 'rejected';

// Chore category string literals matching the DB CHECK constraint.
export type ChoreCategory =
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'outdoor'
  | 'pets'
  | 'laundry'
  | 'homework'
  | 'other';

// Chore frequency string literals matching the DB CHECK constraint.
export type ChoreFrequency = 'once' | 'daily' | 'weekly';

// Typed navigation routes. Never use string literals at navigation call sites.
//
// The navigator is split into two mutually exclusive sets gated by
// `authStore.session`. React Navigation 7 doesn't model that split in the
// type system, so all routes share the same param list at compile time —
// runtime gating happens in RootNavigator.

export type RootStackParamList = {
  // Auth stack — rendered when session is null
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;

  // Main stack — rendered when session !== null
  // (Home is a stub in Phase 4 Batch 1; replaced by the real dashboard
  // after Batch 2 wires OnboardingWizard + MainNavigator.)
  Home: undefined;

  // Dev-only — accessible from Home for visual review.
  // Removed once Phase 5 screens replace the need.
  Showcase: undefined;
};
