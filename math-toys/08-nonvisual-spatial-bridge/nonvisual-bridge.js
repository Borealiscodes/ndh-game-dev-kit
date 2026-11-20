import { Q_ONE, toQ16, fromQ16, qMul } from "../00-core-q16/core.js";
import { createSensoryRegulationProfile, clampGentleAudioParams } from "../07-sensory-regulation-envelope/sensory-envelope.js";

export function createNonVisualBridgeProfile(overrides = {}) {
  return {
    descriptiveAudio: true,
    audioRadar: true,
    brailleTactileBar: true,
    hapticsOptIn: true,
    ...overrides,
  };
}

export function projectTernaryBearingQ16(dxQ16, dyQ16, deadzoneQ16 = toQ16(16)) {
  const tx = dxQ16 > deadzoneQ16 ? 1 : dxQ16 < -deadzoneQ16 ? -1 : 0;
  const ty = dyQ16 > deadzoneQ16 ? 1 : dyQ16 < -deadzoneQ16 ? -1 : 0;
  return { tx, ty };
}

export function renderBrailleRadarBar(tx, proximityQ16) {
  const p = Math.max(0, Math.min(Q_ONE, proximityQ16 | 0));
  const LEVELS = ["\u2800", "\u2844", "\u2866", "\u2877", "\u28FF"];
  const levelIdx = Math.min(4, Math.floor((p * 5) / (Q_ONE + 1)));
  const activeCell = LEVELS.at(levelIdx);
  const slot = tx < 0 ? 0 : tx > 0 ? 4 : 2;
  return Array.from({ length: 5 }, (_, i) => (i === slot ? activeCell : "\u2800")).join("");
}

export function computeSafeHapticEnvelopeQ16(rawLeftQ16, rawRightQ16, prevLeftQ16 = 0, prevRightQ16 = 0) {
  const MAX_SLEW_Q16 = toQ16(0.35);
  let l = Math.max(0, rawLeftQ16 | 0);
  let r = Math.max(0, rawRightQ16 | 0);
  let attenuated = false;

  if (l > Q_ONE || r > Q_ONE) {
    const peak = Math.max(l, r);
    l = Math.round((BigInt(l) * BigInt(Q_ONE)) / BigInt(peak));
    r = Math.round((BigInt(r) * BigInt(Q_ONE)) / BigInt(peak));
    attenuated = true;
  }

  if (Math.abs(l - prevLeftQ16) > MAX_SLEW_Q16) {
    l = prevLeftQ16 + (l > prevLeftQ16 ? MAX_SLEW_Q16 : -MAX_SLEW_Q16);
    attenuated = true;
  }
  if (Math.abs(r - prevRightQ16) > MAX_SLEW_Q16) {
    r = prevRightQ16 + (r > prevRightQ16 ? MAX_SLEW_Q16 : -MAX_SLEW_Q16);
    attenuated = true;
  }

  return {
    leftNormQ16: l,
    rightNormQ16: r,
    leftActuatorHz: Math.round(fromQ16(l) * 150),
    rightActuatorHz: Math.round(fromQ16(r) * 220),
    vibrateMs: Math.round(fromQ16(Math.max(l, r)) * 45),
    attenuated,
  };
}

export function buildNonVisualCueFrame({
  targetLabel = "Beacon",
  dxQ16 = 0,
  dyQ16 = 0,
  maxRangeQ16 = toQ16(400),
  prevHaptics = { leftNormQ16: 0, rightNormQ16: 0 },
  bridgeProfile = createNonVisualBridgeProfile(),
  regulationProfile = createSensoryRegulationProfile(),
}) {
  const { tx, ty } = projectTernaryBearingQ16(dxQ16, dyQ16);
  const dist = Math.hypot(Math.abs(fromQ16(dxQ16)), Math.abs(fromQ16(dyQ16)));
  const maxR = Math.max(1, fromQ16(maxRangeQ16));
  const proximity = Math.max(0, Math.min(1, 1 - dist / maxR));
  const proximityQ16 = toQ16(proximity);

  const dirWords = [ty < 0 ? "ahead" : ty > 0 ? "behind" : "", tx < 0 ? "left" : tx > 0 ? "right" : ""].filter(Boolean);
  const bearingDesc = dirWords.length > 0 ? dirWords.join("-") : "dead-center";

  const ariaLiveText = bridgeProfile.descriptiveAudio
    ? `${targetLabel}: ${bearingDesc}, proximity ${Math.round(proximity * 100)}%.`
    : "";

  const brailleBar = bridgeProfile.brailleTactileBar ? renderBrailleRadarBar(tx, proximityQ16) : "";

  const rawBeaconAudio = {
    gainQ16: bridgeProfile.audioRadar ? qMul(proximityQ16, toQ16(0.08)) : 0,
    cutoffHz: Math.round(240 + proximity * 420),
    attackMs: 30,
  };
  const safeAudio = clampGentleAudioParams(rawBeaconAudio, regulationProfile);

  const hapticsAllowed = bridgeProfile.hapticsOptIn && regulationProfile.allowHaptics;
  const rawLeft = toQ16(proximity * (tx <= 0 ? 1.0 : 0.35));
  const rawRight = toQ16(proximity * (tx >= 0 ? 1.0 : 0.35));
  const haptics = hapticsAllowed
    ? computeSafeHapticEnvelopeQ16(rawLeft, rawRight, prevHaptics.leftNormQ16, prevHaptics.rightNormQ16)
    : { leftNormQ16: 0, rightNormQ16: 0, leftActuatorHz: 0, rightActuatorHz: 0, vibrateMs: 0, attenuated: false };

  return {
    ternaryBearing: { tx, ty },
    proximityQ16,
    ariaLiveText,
    brailleBar,
    audioBeacon: {
      panQ16: tx < 0 ? toQ16(-0.75) : tx > 0 ? toQ16(0.75) : 0,
      pitchHz: safeAudio.cutoffHz,
      safeGainQ16: safeAudio.gainQ16,
      attackMs: safeAudio.attackMs,
    },
    haptics,
  };
}
