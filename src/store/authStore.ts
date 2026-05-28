import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

import type { Profile } from '../types/app.types';

// Session is *not* persisted by this store — the supabase client already
// persists it to AsyncStorage. This store is the in-memory mirror that
// screens subscribe to. On app launch, a thin bootstrapper reads the
// supabase-restored session and calls `setSession()` once.

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  setSession(session: Session | null): void;
  setProfile(profile: Profile | null): void;
  reset(): void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  reset: () => set({ session: null, profile: null }),
}));
