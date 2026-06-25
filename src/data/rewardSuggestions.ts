import type { AgeTier } from '../utils/ageTier';

// Curated, age-appropriate reward ideas per tier. Tapping one prefills the
// Create Reward form (title + suggested point cost + an icon); the parent can
// edit anything before saving. Costs scale with the tier. Suggestions only —
// parents can always create custom rewards. `icon` is an Ionicon name from the
// CreateRewardModal icon set.

export interface RewardSuggestion {
  title: string;
  cost: number;
  icon: string;
}

export const REWARD_SUGGESTIONS: Record<AgeTier, readonly RewardSuggestion[]> = {
  early: [
    { title: 'Extra bedtime story', cost: 10, icon: 'book' },
    { title: 'Sticker pack', cost: 15, icon: 'star' },
    { title: 'Pick movie night', cost: 20, icon: 'ticket' },
    { title: 'Trip to the park', cost: 25, icon: 'happy' },
    { title: 'A small toy', cost: 30, icon: 'balloon' },
    { title: 'Extra playtime', cost: 15, icon: 'happy' },
  ],
  lower: [
    { title: '30 min screen time', cost: 20, icon: 'headset' },
    { title: 'Stay up 30 min late', cost: 25, icon: 'star' },
    { title: 'Pick dinner', cost: 25, icon: 'ticket' },
    { title: 'Friend playdate', cost: 30, icon: 'happy' },
    { title: 'Ice cream outing', cost: 30, icon: 'happy' },
    { title: 'A new book or toy', cost: 40, icon: 'book' },
  ],
  middle: [
    { title: '1 hour screen time', cost: 30, icon: 'headset' },
    { title: 'Pick a weekend activity', cost: 40, icon: 'ticket' },
    { title: 'Movie with a friend', cost: 50, icon: 'ticket' },
    { title: 'Outing with friends', cost: 50, icon: 'happy' },
    { title: '$5 spending money', cost: 50, icon: 'star' },
    { title: 'A new game or app', cost: 60, icon: 'planet' },
  ],
  upper: [
    { title: 'Extended curfew', cost: 40, icon: 'star' },
    { title: 'Gas money', cost: 60, icon: 'car-sport' },
    { title: 'Friend outing / road trip', cost: 70, icon: 'car-sport' },
    { title: '$10 spending money', cost: 80, icon: 'star' },
    { title: 'New gear or clothing', cost: 90, icon: 'color-palette' },
    { title: 'Concert or event ticket', cost: 100, icon: 'musical-notes' },
  ],
};
