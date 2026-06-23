import { activeChoreCountForChild } from '../../src/utils/entitlements';
import type { Chore, ChoreAssignment } from '../../src/types/app.types';

function chore(id: string, is_active = true): Chore {
  return {
    id,
    family_id: 'fam',
    title: id,
    description: null,
    category: null,
    point_value: 10,
    frequency: 'once',
    is_active,
    created_by: null,
    created_at: '2026-01-01T00:00:00Z',
  };
}

function assignment(
  id: string,
  chore_id: string,
  child_id: string,
  status: ChoreAssignment['status'] = 'assigned'
): ChoreAssignment {
  return {
    id,
    chore_id,
    child_id,
    assigned_by: null,
    status,
    due_date: null,
    assigned_at: '2026-01-01T00:00:00Z',
    completed_at: null,
    note: null,
  };
}

describe('activeChoreCountForChild', () => {
  const chores = [chore('c1'), chore('c2'), chore('c3', false)];

  it('counts active, non-rejected assignments for the child', () => {
    const assignments = [
      assignment('a1', 'c1', 'kid'),
      assignment('a2', 'c2', 'kid', 'submitted'),
      assignment('a3', 'c1', 'other'), // different child
    ];
    expect(activeChoreCountForChild('kid', chores, assignments)).toBe(2);
  });

  it('excludes assignments whose chore is inactive', () => {
    const assignments = [assignment('a1', 'c3', 'kid')]; // c3 is inactive
    expect(activeChoreCountForChild('kid', chores, assignments)).toBe(0);
  });

  it('excludes rejected assignments', () => {
    const assignments = [
      assignment('a1', 'c1', 'kid', 'rejected'),
      assignment('a2', 'c2', 'kid', 'approved'),
    ];
    expect(activeChoreCountForChild('kid', chores, assignments)).toBe(1);
  });

  it('returns 0 when the child has no assignments', () => {
    expect(activeChoreCountForChild('kid', chores, [])).toBe(0);
  });
});
