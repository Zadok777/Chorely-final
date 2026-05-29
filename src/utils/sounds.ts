import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

import { useSettingsStore } from '../store/settingsStore';

// Fire-and-forget sound effects, mirroring utils/haptics.ts. Players are created
// lazily and reused for the app's lifetime. Playback is gated on the user's
// `soundEnabled` setting and respects the device's silent switch (we
// deliberately do not force playback in silent mode). Errors are swallowed —
// SFX are a nicety, never load-bearing.

export type SoundName = 'celebrate' | 'success';

// Audio assets are intentionally optional. Drop matching files into
// assets/sounds/ and uncomment the matching line below. Until a file is
// present, that sound is a silent no-op, so the bundle always builds. See
// assets/sounds/README.md for filenames, format, and royalty-free sources.
const SOURCES: Partial<Record<SoundName, number>> = {
  // celebrate: require('../../assets/sounds/celebrate.mp3'),
  // success: require('../../assets/sounds/success.mp3'),
};

const players: Partial<Record<SoundName, AudioPlayer>> = {};

function getPlayer(name: SoundName): AudioPlayer | null {
  const source = SOURCES[name];
  if (source === undefined) return null;
  try {
    let player = players[name];
    if (player === undefined) {
      player = createAudioPlayer(source);
      player.volume = 0.7;
      players[name] = player;
    }
    return player;
  } catch {
    return null;
  }
}

export function playSound(name: SoundName): void {
  if (!useSettingsStore.getState().soundEnabled) return;
  const player = getPlayer(name);
  if (player === null) return;
  try {
    player.seekTo(0);
    player.play();
  } catch {
    // swallow — never let an SFX failure surface or block a flow
  }
}
