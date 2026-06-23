import {
  ageFromDob,
  getAgeTier,
  effectiveTier,
  tierLabel,
  tierShortLabel,
} from '../../src/utils/ageTier';

/** Build a yyyy-mm-dd DOB for someone whose whole-years age is exactly `age`. */
function dobForAge(age: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - age);
  d.setMonth(d.getMonth() - 1); // ensure the birthday has already passed this year
  return d.toISOString().slice(0, 10);
}

describe('ageFromDob', () => {
  it('returns null for missing or invalid dates', () => {
    expect(ageFromDob(null)).toBeNull();
    expect(ageFromDob(undefined)).toBeNull();
    expect(ageFromDob('not-a-date')).toBeNull();
  });

  it('computes whole-year age', () => {
    expect(ageFromDob(dobForAge(10))).toBe(10);
  });
});

describe('getAgeTier', () => {
  it('falls back to "lower" when the DOB is unknown', () => {
    expect(getAgeTier(null)).toBe('lower');
  });

  it.each([
    [6, 'early'],
    [7, 'early'],
    [8, 'lower'],
    [11, 'lower'],
    [12, 'middle'],
    [14, 'middle'],
    [15, 'upper'],
    [17, 'upper'],
  ] as const)('maps age %i to tier %s', (age, tier) => {
    expect(getAgeTier(dobForAge(age))).toBe(tier);
  });
});

describe('effectiveTier', () => {
  it('uses an explicit override when valid', () => {
    expect(
      effectiveTier({ date_of_birth: dobForAge(6), age_tier_override: 'upper' }),
    ).toBe('upper');
  });

  it('derives from DOB when there is no override', () => {
    expect(
      effectiveTier({ date_of_birth: dobForAge(13), age_tier_override: null }),
    ).toBe('middle');
  });

  it('ignores an invalid override and derives from DOB', () => {
    expect(
      effectiveTier({ date_of_birth: dobForAge(6), age_tier_override: 'bogus' }),
    ).toBe('early');
  });
});

describe('labels', () => {
  it('returns grade-term labels', () => {
    expect(tierLabel('early')).toBe('Pre-K–2nd');
    expect(tierLabel('lower')).toBe('Grades 3–6');
    expect(tierLabel('middle')).toBe('Grades 7–9');
    expect(tierLabel('upper')).toBe('Grades 10–12');
  });

  it('returns short labels', () => {
    expect(tierShortLabel('early')).toBe('K–2');
    expect(tierShortLabel('lower')).toBe('3–6');
    expect(tierShortLabel('middle')).toBe('7–9');
    expect(tierShortLabel('upper')).toBe('10–12');
  });
});
