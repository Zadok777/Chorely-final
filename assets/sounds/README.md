# Sound effects

Chorely plays short sound effects on celebratory moments, gated by the
**Settings → Sound effects** toggle (`settingsStore.soundEnabled`, default on)
and routed through `src/utils/sounds.ts`. Playback respects the device's
silent switch — we do not force audio in silent mode.

## Required files

Drop these two files into this folder, then uncomment the matching lines in
the `SOURCES` map in `src/utils/sounds.ts`:

| File | Plays when | Suggested feel |
|---|---|---|
| `celebrate.mp3` | A goal is reached or a reward is redeemed (via `CelebrationOverlay`) | Short, happy win — chime burst / sparkle / mini fanfare, ~0.8–1.5s |
| `success.mp3` | A parent approves a chore (`ChoreApprovalModal`) | Light, positive confirmation ding, ~0.3–0.6s |

Until a file is present, that sound is a silent no-op, so the app still builds
and runs (haptics still fire).

## Format

- **`.mp3`** (AAC/`.m4a` also works — update the `require` extension to match).
- Mono is fine; keep files small (a few hundred KB max).
- Normalize so the two SFX feel balanced; the player sets volume to 0.7.

## Royalty-free sources (verify the license before shipping)

These allow commercial use without attribution. Confirm the specific clip's
license on its page — do not assume.

- **Pixabay** (Pixabay Content License, no attribution): https://pixabay.com/sound-effects/search/success%20chime/
- **Mixkit** (Mixkit Free License, no attribution): https://mixkit.co/free-sound-effects/win/
- **Kenney** (CC0 / public domain): https://kenney.nl/assets/interface-sounds
- **freegamedesigntools.com SFX board** (CC0, browser-synthesized): https://freegamedesigntools.com/sfx-board/

Keep this folder's contents secular and child-appropriate.
