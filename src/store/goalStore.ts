import { create } from 'zustand';

import type { Goal } from '../types/app.types';

interface GoalState {
  goals: Goal[];
  setGoals(goals: Goal[]): void;
  upsertGoal(goal: Goal): void;
  removeGoal(id: string): void;
  reset(): void;
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  setGoals: (goals) => set({ goals }),
  upsertGoal: (goal) =>
    set((state) => {
      const idx = state.goals.findIndex((g) => g.id === goal.id);
      if (idx === -1) return { goals: [...state.goals, goal] };
      return { goals: state.goals.map((g, i) => (i === idx ? goal : g)) };
    }),
  removeGoal: (id) =>
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),
  reset: () => set({ goals: [] }),
}));
