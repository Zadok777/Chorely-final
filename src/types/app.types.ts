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
// Each phase below adds more entries as the screens come online.
export type RootStackParamList = {
  // Phase 1+2: placeholder smoke-test screen
  Placeholder: undefined;

  // Phase 4 (auth + onboarding) — wire when the screens exist:
  // Welcome: undefined;
  // Login: undefined;
  // SignUp: undefined;
  // OnboardingWizard: undefined;

  // Phase 5+ (main app) — wire when the tab navigator exists:
  // Main: undefined;
};
