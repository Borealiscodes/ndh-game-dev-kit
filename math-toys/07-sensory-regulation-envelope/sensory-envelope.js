import { Q_ONE, toQ16, qMul } from "../00-core-q16/core.js";

export function createSensoryRegulationProfile(overrides = {}) {
  return {
    noFlash: true,
    reducedMotion: true,
    softAudioOnly: true,
    maxAudioGainQ16: toQ16(0.06),
    maxLowPassHz: 850,
    minAttackMs: 25,
    allowHaptics: false,
    timeScaleQ16: Q_ONE,
    ...overrides,
  };
}

export function filterVisualStimuli(rawVisual = {}, profile = createSensoryRegulationProfile()) {
  const flashAlphaQ16 = profile.noFlash ? 0 : Math.max(0, Math.min(toQ16(0.25), rawVisual.flashAlphaQ16 | 0));
  const shakeOffsetQ16 = profile.reducedMotion ? 0 : Math.max(-toQ16(8), Math.min(toQ16(8), rawVisual.shakeOffsetQ16 | 0));
  const particleCount = profile.reducedMotion ? 0 : Math.max(0, Math.min(24, rawVisual.particleCount | 0));
  return { flashAlphaQ16, shakeOffsetQ16, particleCount, suppressed: profile.noFlash || profile.reducedMotion };
}

export function clampGentleAudioParams(rawAudio = {}, profile = createSensoryRegulationProfile()) {
  const rawGainQ16 = Math.max(0, rawAudio.gainQ16 | 0);
  const rawCutoffHz = Math.max(120, rawAudio.cutoffHz | 0);
  const rawAttackMs = Math.max(0, rawAudio.attackMs | 0);

  if (!profile.softAudioOnly) {
    return { gainQ16: Math.min(toQ16(0.15), rawGainQ16), cutoffHz: rawCutoffHz, attackMs: Math.max(8, rawAttackMs), clamped: false };
  }

  const gainQ16 = Math.min(profile.maxAudioGainQ16, rawGainQ16);
  const cutoffHz = Math.min(profile.maxLowPassHz, rawCutoffHz);
  const attackMs = Math.max(profile.minAttackMs, rawAttackMs);
  return { gainQ16, cutoffHz, attackMs, clamped: gainQ16 < rawGainQ16 || cutoffHz < rawCutoffHz || attackMs > rawAttackMs };
}

export function scalePacingStepQ16(baseDtQ16, profile = createSensoryRegulationProfile()) {
  const clampedScale = Math.max(toQ16(0.25), Math.min(toQ16(1.5), profile.timeScaleQ16 | 0));
  return qMul(baseDtQ16 | 0, clampedScale);
}
