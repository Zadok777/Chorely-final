import { create } from 'zustand';

import type { Child, Family, FamilyMember } from '../types/app.types';

interface FamilyState {
  family: Family | null;
  members: FamilyMember[];
  children: Child[];
  setFamily(family: Family | null): void;
  setMembers(members: FamilyMember[]): void;
  setChildren(children: Child[]): void;
  upsertChild(child: Child): void;
  removeChild(id: string): void;
  reset(): void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  family: null,
  members: [],
  children: [],
  setFamily: (family) => set({ family }),
  setMembers: (members) => set({ members }),
  setChildren: (children) => set({ children }),
  upsertChild: (child) =>
    set((state) => {
      const idx = state.children.findIndex((c) => c.id === child.id);
      if (idx === -1) return { children: [...state.children, child] };
      return {
        children: state.children.map((c, i) => (i === idx ? child : c)),
      };
    }),
  removeChild: (id) =>
    set((state) => ({
      children: state.children.filter((c) => c.id !== id),
    })),
  reset: () => set({ family: null, members: [], children: [] }),
}));
