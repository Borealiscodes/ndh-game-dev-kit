import test from "node:test";
import assert from "node:assert/strict";
import { toQ16 } from "../00-core-q16/core.js";
import {
  createSensoryRegulationProfile,
  filterVisualStimuli,
  clampGentleAudioParams,
  scalePacingStepQ16,
} from "./sensory-envelope.js";

test("1. Default Sensory Regulation Profile Blocks Flash, Shake & Unexpected Haptics", () => {
  const profile = createSensoryRegulationProfile();
  assert.equal(profile.noFlash, true);
  assert.equal(profile.reducedMotion, true);
  assert.equal(profile.allowHaptics, false);

  const vis = filterVisualStimuli({ flashAlphaQ16: toQ16(0.9), shakeOffsetQ16: toQ16(14), particleCount: 50 }, profile);
  assert.equal(vis.flashAlphaQ16, 0);
  assert.equal(vis.shakeOffsetQ16, 0);
  assert.equal(vis.particleCount, 0);
});

test("2. Gentle Audio Limiter Caps Harsh Cutoff Frequencies, Gain & Sudden Attacks", () => {
  const profile = createSensoryRegulationProfile();
  const safe = clampGentleAudioParams({ gainQ16: toQ16(0.4), cutoffHz: 4200, attackMs: 2 }, profile);
  assert.equal(safe.gainQ16, profile.maxAudioGainQ16);
  assert.equal(safe.cutoffHz, 850);
  assert.equal(safe.attackMs, 25);
  assert.equal(safe.clamped, true);
});

test("3. Pacing Scaler Computes Deterministic Half-Speed Step in Q16.16", () => {
  const profile = createSensoryRegulationProfile({ timeScaleQ16: toQ16(0.5) });
  const baseDt = toQ16(1 / 60);
  assert.equal(scalePacingStepQ16(baseDt, profile), Math.floor(baseDt / 2));
});
