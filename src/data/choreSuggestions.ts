import type { ChoreCategory } from '../types/app.types';
import type { AgeTier } from '../utils/ageTier';

// Curated, age-appropriate chore templates per tier. Tapping one prefills the
// Create Chore form (title + category + suggested points); the parent can edit
// anything before saving. Point values scale up with the tier (harder chores).
// These are suggestions only — parents can always create custom chores.

export interface ChoreSuggestion {
  title: string;
  category: ChoreCategory;
  points: number;
}

export const CHORE_SUGGESTIONS: Record<AgeTier, ReadonlyArray<ChoreSuggestion>> = {
  early: [
    { title: 'Put toys away', category: 'bedroom', points: 5 },
    { title: 'Make your bed', category: 'bedroom', points: 5 },
    { title: 'Brush your teeth', category: 'bathroom', points: 5 },
    { title: 'Feed the pet', category: 'pets', points: 5 },
    { title: 'Clothes in the hamper', category: 'laundry', points: 5 },
    { title: 'Help set the table', category: 'kitchen', points: 5 },
    { title: 'Water a plant', category: 'outdoor', points: 5 },
  ],
  lower: [
    { title: 'Make your bed', category: 'bedroom', points: 10 },
    { title: 'Tidy your room', category: 'bedroom', points: 15 },
    { title: 'Unload the dishwasher', category: 'kitchen', points: 15 },
    { title: 'Take out the trash', category: 'other', points: 10 },
    { title: 'Feed & walk the pet', category: 'pets', points: 15 },
    { title: 'Fold the laundry', category: 'laundry', points: 15 },
    { title: 'Finish your homework', category: 'homework', points: 10 },
    { title: 'Wipe the bathroom sink', category: 'bathroom', points: 10 },
  ],
  middle: [
    { title: 'Do your own laundry', category: 'laundry', points: 25 },
    { title: 'Vacuum the house', category: 'other', points: 20 },
    { title: 'Wash the dishes', category: 'kitchen', points: 20 },
    { title: 'Clean the bathroom', category: 'bathroom', points: 25 },
    { title: 'Trash & recycling out', category: 'other', points: 15 },
    { title: 'Mow the lawn', category: 'outdoor', points: 30 },
    { title: 'Help cook dinner', category: 'kitchen', points: 25 },
    { title: 'Homework done & checked', category: 'homework', points: 15 },
  ],
  upper: [
    { title: 'Cook a family meal', category: 'kitchen', points: 35 },
    { title: 'Do a grocery run', category: 'other', points: 30 },
    { title: 'Mow & edge the lawn', category: 'outdoor', points: 35 },
    { title: 'Deep-clean the bathroom', category: 'bathroom', points: 30 },
    { title: 'Wash the car', category: 'outdoor', points: 30 },
    { title: 'Manage weekly laundry', category: 'laundry', points: 30 },
    { title: 'Babysit a sibling', category: 'other', points: 40 },
    { title: 'Help with a budget task', category: 'homework', points: 25 },
  ],
};
