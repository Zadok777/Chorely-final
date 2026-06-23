import {
  freeTrialLabelFromIntro,
  type IntroPriceLike,
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
