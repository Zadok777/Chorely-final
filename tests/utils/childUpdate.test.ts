import {
  ALLOWED_CHILD_UPDATE_FIELDS,
  pickAllowedChildUpdate,
} from '../../src/utils/childUpdate';
import type { TablesUpdate } from '../../src/types/database.types';

describe('pickAllowedChildUpdate', () => {
  it('passes through allowed cosmetic/identity-safe fields', () => {
    const patch: TablesUpdate<'children'> = {
      name: 'Mia',
      avatar_gradient: 3,
      avatar_icon: 'star',
      age_tier_override: 'middle',
    };
    expect(pickAllowedChildUpdate(patch)).toEqual(patch);
  });

  it('strips privileged columns (points/streak/identity) even if a caller sends them', () => {
    const patch = {
      name: 'Mia',
      points: 999999,
      streak_days: 50,
      last_streak_date: '2026-01-01',
      is_under_13: false,
      id: 'spoofed',
      family_id: 'other-family',
    } as unknown as TablesUpdate<'children'>;

    const out = pickAllowedChildUpdate(patch);
    expect(out).toEqual({ name: 'Mia' });
    expect('points' in out).toBe(false);
    expect('streak_days' in out).toBe(false);
    expect('is_under_13' in out).toBe(false);
    expect('id' in out).toBe(false);
    expect('family_id' in out).toBe(false);
  });

  it('omits keys that are undefined', () => {
    const patch: TablesUpdate<'children'> = { name: 'Mia', avatar_icon: undefined };
    expect(pickAllowedChildUpdate(patch)).toEqual({ name: 'Mia' });
  });

  it('returns an empty object for an empty patch', () => {
    expect(pickAllowedChildUpdate({})).toEqual({});
  });

  it('never lists a privileged column as allowed', () => {
    for (const forbidden of ['points', 'streak_days', 'last_streak_date', 'is_under_13', 'id', 'family_id']) {
      expect(ALLOWED_CHILD_UPDATE_FIELDS).not.toContain(forbidden);
    }
  });
});
