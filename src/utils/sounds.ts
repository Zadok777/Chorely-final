import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

import { useSettingsStore } from '../store/settingsStore';

// Fire-and-forget sound effects, mirroring utils/haptics.ts. Players are created
// lazily and reused for the app's lifetime. Playback is gated on the user's
// `soundEnabled` setting and respects the device's silent switch (we
// deliberately do not force playback in silent mode). Errors are swallowed —
// SFX are a nicety, never load-bearing.

export type SoundName = 'celebrate' | 'success';

// Bundled, synthesized chimes (generated locally — no third-party license).
// To swap in nicer SFX, drop a replacement at the same path (any of the
// Metro-supported audio exts) and update the extension here. A missing/absent
// entry just makes that sound a silent no-op. See assets/sounds/README.md.
const SOURCES: Partial<Record<SoundName, number>> = {
  celebrate: require('../../assets/sounds/celebrate.wav'),
  success: require('../../assets/sounds/success.wav'),
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
