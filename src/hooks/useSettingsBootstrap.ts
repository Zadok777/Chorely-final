import { useEffect } from 'react';

import { getMySettings } from '../services/settings';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';

// Syncs the server-side user_settings row into the local (persisted)
// settingsStore whenever the user signs in. The local store is the source of
// truth for rendering (dark mode applies instantly at launch from AsyncStorage);
// this just reconciles it with the server so settings follow the user across
// devices. Non-blocking — App does not gate readiness on it.
export function useSettingsBootstrap(): void {
  const session = useAuthStore((s) => s.session);

  useEffect(() => {
    if (session === null) return;
    let mounted = true;

    void (async () => {
      const res = await getMySettings();
      if (!mounted || !res.success || res.data === null) return;
      useSettingsStore.getState().hydrateFromServer(res.data);
    })();

    return () => {
      mounted = false;
    };
  }, [session]);
}
