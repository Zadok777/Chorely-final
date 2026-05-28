import { create } from 'zustand';

import type { Reward, RewardRedemption } from '../types/app.types';

interface RewardState {
  rewards: Reward[];
  redemptions: RewardRedemption[];
  setRewards(rewards: Reward[]): void;
  setRedemptions(redemptions: RewardRedemption[]): void;
  upsertReward(reward: Reward): void;
  removeReward(id: string): void;
  upsertRedemption(redemption: RewardRedemption): void;
  reset(): void;
}

export const useRewardStore = create<RewardState>((set) => ({
  rewards: [],
  redemptions: [],
  setRewards: (rewards) => set({ rewards }),
  setRedemptions: (redemptions) => set({ redemptions }),
  upsertReward: (reward) =>
    set((state) => {
      const idx = state.rewards.findIndex((r) => r.id === reward.id);
      if (idx === -1) return { rewards: [...state.rewards, reward] };
      return { rewards: state.rewards.map((r, i) => (i === idx ? reward : r)) };
    }),
  removeReward: (id) =>
    set((state) => ({ rewards: state.rewards.filter((r) => r.id !== id) })),
  upsertRedemption: (redemption) =>
    set((state) => {
      const idx = state.redemptions.findIndex((r) => r.id === redemption.id);
      if (idx === -1) {
        return { redemptions: [...state.redemptions, redemption] };
      }
      return {
        redemptions: state.redemptions.map((r, i) =>
          i === idx ? redemption : r
        ),
      };
    }),
  reset: () => set({ rewards: [], redemptions: [] }),
}));
