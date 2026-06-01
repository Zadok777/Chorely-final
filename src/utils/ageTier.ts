// Age/grade tier for a child — drives age-appropriate chore & reward
// SUGGESTIONS and default point values. Tiers never RESTRICT what a parent can
// assign; they only tailor suggestions. The tier is derived from the child's
// date_of_birth, but a parent can override it per child (grade-skips, maturity)
// via `age_tier_override` once that column exists.

export type AgeTier = 'early' | 'lower' | 'middle' | 'upper';

export const AGE_TIERS = ['early', 'lower', 'middle', 'upper'] as const;

/** Whole-years age from an ISO date_of_birth (yyyy-mm-dd). */
export function ageFromDob(dob: string | null | undefined): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDelta = now.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

/** Derive a tier from a birthday. Falls back to 'lower' when DOB is unknown. */
export function getAgeTier(dob: string | null | undefined): AgeTier {
  const age = ageFromDob(dob);
  if (age === null) return 'lower';
  if (age <= 7) return 'early';
  if (age <= 11) return 'lower';
  if (age <= 14) return 'middle';
  return 'upper';
}

function isAgeTier(value: unknown): value is AgeTier {
  return (
    typeof value === 'string' && (AGE_TIERS as readonly string[]).includes(value)
  );
}

/** Effective tier = explicit override if set, otherwise derived from DOB. */
export function effectiveTier(child: {
  date_of_birth: string | null;
  age_tier_override?: string | null;
}): AgeTier {
  if (isAgeTier(child.age_tier_override)) return child.age_tier_override;
  return getAgeTier(child.date_of_birth);
}

/** Parent-facing label, in grade terms (how parents think about it). */
export function tierLabel(tier: AgeTier): string {
  switch (tier) {
    case 'early':
      return 'Pre-K–2nd';
    case 'lower':
      return 'Grades 3–6';
    case 'middle':
      return 'Grades 7–9';
    case 'upper':
      return 'Grades 10–12';
  }
}

/** Shorthand for chips/badges. */
export function tierShortLabel(tier: AgeTier): string {
  switch (tier) {
    case 'early':
      return 'K–2';
    case 'lower':
      return '3–6';
    case 'middle':
      return '7–9';
    case 'upper':
      return '10–12';
  }
}
