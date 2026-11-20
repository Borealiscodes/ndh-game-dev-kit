/**
 * math-toys/07-sensory-regulation-envelope/sensory-envelope.js
 * Sensory Regulation, Photosensitivity & Neurodivergent Comfort Envelope (Ledger 2)
 *
 * Purpose: Subtracts and softens sensory intensity—enforcing zero flash/strobe,
 * reduced motion, soft low-pass audio caps, opt-in-only haptics, and adjustable pacing
 * without mutating Ledger 1 physics or deterministic replay hashes.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { Q_ONE, toQ16, fromQ16, qMul } from "../00-core-q16/core.js";

export function createSensoryRegulationProfile(overrides = {}) {
  return {
    noFlash: true,                      // Hard zero-strobe / zero-screen-flash lock
    reducedMotion: true,                // Clamps camera shake, parallax & decorative particles to 0
    softAudioOnly: true,                // Caps WebAudio low-pass cutoff (<= 850 Hz) & peak gain (<= 0.06)
    maxAudioGainQ16: toQ16(0.06),       // Gentle peak gain ceiling
    maxLowPassHz: 850,                  // Rolls off harsh upper harmonics (> 850 Hz)
    minAttackMs: 25,                    // Prevents sudden percussive startle spikes
    allowHaptics: false,                // Off by default so unexpected vibration never startles
    timeScaleQ16: Q_ONE,                // Adjustable game speed (e.g. 0.5x = 32768, 1.0x = 65536)
    ...overrides,
  };
}

/**
 * Clamps visual flash, camera shake, and particle density under the sensory envelope.
 */
export function filterVisualStimuli(rawVisual = {}, profile = createSensoryRegulationProfile()) {
  const flashAlphaQ16 = profile.noFlash ? 0 : Math.max(0, Math.min(toQ16(0.25), rawVisual.flashAlphaQ16 | 0));
  const shakeOffsetQ16 = profile.reducedMotion ? 0 : Math.max(-toQ16(8), Math.min(toQ16(8), rawVisual.shakeOffsetQ16 | 0));
  const particleCount = profile.reducedMotion ? 0 : Math.max(0, Math.min(24, rawVisual.particleCount | 0));

  return {
    flashAlphaQ16,
    shakeOffsetQ16,
    particleCount,
    suppressed: profile.noFlash || profile.reducedMotion,
  };
}

/**
 * Enforces gentle audio gain, minimum attack swell, and low-pass frequency limits.
 */
export function clampGentleAudioParams(rawAudio = {}, profile = createSensoryRegulationProfile()) {
  const rawGainQ16 = Math.max(0, rawAudio.gainQ16 | 0);
  const rawCutoffHz = Math.max(120, rawAudio.cutoffHz | 0);
  const rawAttackMs = Math.max(0, rawAudio.attackMs | 0);

  if (!profile.softAudioOnly) {
    return {
      gainQ16: Math.min(toQ16(0.15), rawGainQ16),
      cutoffHz: rawCutoffHz,
      attackMs: Math.max(8, rawAttackMs),
      clamped: false,
    };
  }

  const gainQ16 = Math.min(profile.maxAudioGainQ16, rawGainQ16);
  const cutoffHz = Math.min(profile.maxLowPassHz, rawCutoffHz);
  const attackMs = Math.max(profile.minAttackMs, rawAttackMs);

  return {
    gainQ16,
    cutoffHz,
    attackMs,
    clamped: gainQ16 < rawGainQ16 || cutoffHz < rawCutoffHz || attackMs > rawAttackMs,
  };
}

/**
 * Scales a base timestep dtQ16 by the user's comfortable pacing multiplier (0.25x .. 1.5x).
 */
export function scalePacingStepQ16(baseDtQ16, profile = createSensoryRegulationProfile()) {
  const clampedScale = Math.max(toQ16(0.25), Math.min(toQ16(1.5), profile.timeScaleQ16 | 0));
  return qMul(baseDtQ16 | 0, clampedScale);
}
