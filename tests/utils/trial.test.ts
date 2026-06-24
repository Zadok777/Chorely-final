import {
  freeTrialLabelFromIntro,
  trialLabelForDisplay,
  type IntroPriceLike,
  type PackageTrialInfo,
} from '../../src/utils/trial';

function intro(over: Partial<IntroPriceLike>): IntroPriceLike {
  return {
    price: 0,
    periodUnit: 'DAY',
    periodNumberOfUnits: 7,
    ...over,
  };
}

describe('freeTrialLabelFromIntro', () => {
  it('returns null when there is no intro offer', () => {
    expect(freeTrialLabelFromIntro(null)).toBeNull();
    expect(freeTrialLabelFromIntro(undefined)).toBeNull();
  });

  it('returns null when the intro offer is not free (a paid intro price)', () => {
    expect(freeTrialLabelFromIntro(intro({ price: 1.99 }))).toBeNull();
  });

  it('returns null for a zero-length offer', () => {
    expect(freeTrialLabelFromIntro(intro({ periodNumberOfUnits: 0 }))).toBeNull();
  });

  it('labels a 7-day free trial', () => {
    expect(freeTrialLabelFromIntro(intro({ periodNumberOfUnits: 7 }))).toBe(
      '7-day free trial'
    );
  });

  it('labels a 1-week free trial', () => {
    expect(
      freeTrialLabelFromIntro(intro({ periodUnit: 'WEEK', periodNumberOfUnits: 1 }))
    ).toBe('1-week free trial');
  });

  it('labels month and year trials', () => {
    expect(
      freeTrialLabelFromIntro(intro({ periodUnit: 'MONTH', periodNumberOfUnits: 1 }))
    ).toBe('1-month free trial');
    expect(
      freeTrialLabelFromIntro(intro({ periodUnit: 'YEAR', periodNumberOfUnits: 1 }))
    ).toBe('1-year free trial');
  });

  it('returns null for an unrecognized period unit', () => {
    expect(
      freeTrialLabelFromIntro(intro({ periodUnit: 'UNKNOWN', periodNumberOfUnits: 3 }))
    ).toBeNull();
  });
});

function pkg(
  packageType: string,
  introPrice: IntroPriceLike | null
): PackageTrialInfo {
  return { packageType, product: { introPrice } };
}

describe('trialLabelForDisplay', () => {
  it('prefers the real store trial when present (regardless of preview)', () => {
    const annual = pkg('ANNUAL', intro({ periodNumberOfUnits: 14 }));
    expect(trialLabelForDisplay(annual, false)).toBe('14-day free trial');
    expect(trialLabelForDisplay(annual, true)).toBe('14-day free trial');
  });

  it('returns null with no real trial and preview off', () => {
    expect(trialLabelForDisplay(pkg('ANNUAL', null), false)).toBeNull();
    expect(trialLabelForDisplay(pkg('MONTHLY', null), false)).toBeNull();
  });

  it('synthesizes a 7-day annual trial only when preview is on', () => {
    expect(trialLabelForDisplay(pkg('ANNUAL', null), true)).toBe('7-day free trial');
    // Preview never invents a trial on the monthly plan.
    expect(trialLabelForDisplay(pkg('MONTHLY', null), true)).toBeNull();
  });
});
