import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';
import { getMyProfile } from '../services/auth';
import { useAuthStore } from '../store/authStore';

// Run once at the App root. Restores the persisted Supabase session into
// `authStore`, subscribes to subsequent sign-in / sign-out events, and
// fetches the matching profile row. App.tsx waits for `ready` before
// mounting the navigator so we never flash the Welcome screen at a user
// who is actually signed in.

interface AuthBootstrapState {
  ready: boolean;
}

export function useAuthBootstrap(): AuthBootstrapState {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const { setSession, setProfile, reset } = useAuthStore.getState();

    async function loadProfileIfSignedIn(): Promise<void> {
      const profileRes = await getMyProfile();
      if (!mounted) return;
      if (profileRes.success) {
        setProfile(profileRes.data);
      }
    }

    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session) {
        await loadProfileIfSignedIn();
      }
      if (mounted) setReady(true);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      if (session) {
        void loadProfileIfSignedIn();
      } else {
        reset();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { ready };
}
