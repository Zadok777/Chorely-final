import { useEffect, useState } from 'react';

import { listChildren } from '../services/children';
import { listFamilyMembers, listMyFamilies } from '../services/families';
import { useAuthStore } from '../store/authStore';
import { useFamilyStore } from '../store/familyStore';

// Loads the signed-in parent's family context (family + children + members)
// into `familyStore` whenever the session changes. App.tsx waits for `ready`
// before mounting the navigator, so a returning user lands directly on their
// dashboard — no flash of the loading spinner or the onboarding screen.
//
// v1.0 is single-family per parent: we adopt the first family the user belongs
// to. Multi-family selection is out of scope. When the user has no family yet,
// `family` stays null and RootNavigator routes them to Onboarding.

interface FamilyBootstrapState {
  ready: boolean;
}

export function useFamilyBootstrap(): FamilyBootstrapState {
  const session = useAuthStore((s) => s.session);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const { setFamily, setChildren, setMembers, reset } =
      useFamilyStore.getState();

    // Signed out: clear any stale family data and report ready immediately —
    // there is nothing to load before showing the auth screens.
    if (session === null) {
      reset();
      setReady(true);
      return () => {
        mounted = false;
      };
    }

    setReady(false);

    void (async () => {
      const famRes = await listMyFamilies();
      if (!mounted) return;

      if (famRes.success && famRes.data.length > 0) {
        const family = famRes.data[0];
        setFamily(family);

        const [childrenRes, membersRes] = await Promise.all([
          listChildren(family.id),
          listFamilyMembers(family.id),
        ]);
        if (!mounted) return;
        if (childrenRes.success) setChildren(childrenRes.data);
        if (membersRes.success) setMembers(membersRes.data);
      } else {
        // No family yet — onboarding will create one.
        setFamily(null);
        setChildren([]);
        setMembers([]);
      }

      if (mounted) setReady(true);
    })();

    return () => {
      mounted = false;
    };
  }, [session]);

  return { ready };
}
