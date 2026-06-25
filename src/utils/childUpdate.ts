import type { TablesUpdate } from '../types/database.types';

// Columns a client may write through `updateChild`. This mirrors the DB-level
// grants from migration 017: points / streak_days / last_streak_date /
// is_under_13 and the identity columns (id, family_id, created_at) are NOT
// here — those change only via the SECURITY DEFINER RPCs. Filtering here is a
// defense-in-depth boundary check so the app never even attempts a privileged
// write (the DB would reject it, but we fail fast and keep the API honest).
export const ALLOWED_CHILD_UPDATE_FIELDS = [
  'name',
  'date_of_birth',
  'avatar_url',
  'avatar_gradient',
  'avatar_icon',
  'age_tier_override',
  'parental_consent_given',
  'parental_consent_at',
] as const;

export type AllowedChildUpdate = Pick<
  TablesUpdate<'children'>,
  (typeof ALLOWED_CHILD_UPDATE_FIELDS)[number]
>;

/** Keep only the client-writable fields from a child update patch. */
export function pickAllowedChildUpdate(
  patch: TablesUpdate<'children'>
): AllowedChildUpdate {
  const out: AllowedChildUpdate = {};
  for (const key of ALLOWED_CHILD_UPDATE_FIELDS) {
    if (patch[key] !== undefined) {
      Object.assign(out, { [key]: patch[key] });
    }
  }
  return out;
}
