import { create } from 'zustand';

import type { Chore, ChoreAssignment, ChoreStatus } from '../types/app.types';

type Filter = ChoreStatus | 'all';

interface ChoreState {
  chores: Chore[];
  assignments: ChoreAssignment[];
  filter: Filter;
  setChores(chores: Chore[]): void;
  setAssignments(assignments: ChoreAssignment[]): void;
  upsertChore(chore: Chore): void;
  removeChore(id: string): void;
  upsertAssignment(assignment: ChoreAssignment): void;
  setFilter(filter: Filter): void;
  reset(): void;
}

export const useChoreStore = create<ChoreState>((set) => ({
  chores: [],
  assignments: [],
  filter: 'all',
  setChores: (chores) => set({ chores }),
  setAssignments: (assignments) => set({ assignments }),
  upsertChore: (chore) =>
    set((state) => {
      const idx = state.chores.findIndex((c) => c.id === chore.id);
      if (idx === -1) return { chores: [...state.chores, chore] };
      return { chores: state.chores.map((c, i) => (i === idx ? chore : c)) };
    }),
  removeChore: (id) =>
    set((state) => ({ chores: state.chores.filter((c) => c.id !== id) })),
  upsertAssignment: (assignment) =>
    set((state) => {
      const idx = state.assignments.findIndex((a) => a.id === assignment.id);
      if (idx === -1) {
        return { assignments: [...state.assignments, assignment] };
      }
      return {
        assignments: state.assignments.map((a, i) =>
          i === idx ? assignment : a
        ),
      };
    }),
  setFilter: (filter) => set({ filter }),
  reset: () => set({ chores: [], assignments: [], filter: 'all' }),
}));
