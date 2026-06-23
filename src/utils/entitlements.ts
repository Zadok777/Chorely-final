import type { Chore, ChoreAssignment } from '../types/app.types';

// How many "active chores" a child currently has, for free-tier gating. An
// assignment counts when its parent chore is active and it hasn't been rejected.
export function activeChoreCountForChild(
  childId: string,
  chores: Chore[],
  assignments: ChoreAssignment[]
): number {
  const activeChoreIds = new Set(
    chores.filter((c) => c.is_active).map((c) => c.id)
  );
  return assignments.filter(
    (a) =>
      a.child_id === childId &&
      activeChoreIds.has(a.chore_id) &&
      a.status !== 'rejected'
  ).length;
}
