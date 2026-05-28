import { create } from 'zustand';

import type { ActivityLog } from '../types/app.types';

interface ActivityState {
  activity: ActivityLog[];
  setActivity(activity: ActivityLog[]): void;
  prepend(item: ActivityLog): void;
  reset(): void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activity: [],
  setActivity: (activity) => set({ activity }),
  prepend: (item) =>
    set((state) => ({ activity: [item, ...state.activity] })),
  reset: () => set({ activity: [] }),
}));
