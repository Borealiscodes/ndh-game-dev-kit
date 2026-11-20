import test from "node:test";
import assert from "node:assert/strict";
import { toQ16 } from "../00-core-q16/core.js";
import { createSensoryRegulationProfile } from "../07-sensory-regulation-envelope/sensory-envelope.js";
import {
  createNonVisualBridgeProfile,
  projectTernaryBearingQ16,
  renderBrailleRadarBar,
  buildNonVisualCueFrame,
} from "./nonvisual-bridge.js";

test("1. Balanced Ternary Bearing & 5-Cell Unicode Braille Radar Align Left/Center/Right", () => {
  const left = projectTernaryBearingQ16(toQ16(-120), toQ16(-40));
  assert.deepEqual(left, { tx: -1, ty: -1 });

  const brailleLeft = renderBrailleRadarBar(-1, toQ16(0.9));
  assert.equal(brailleLeft.length, 5);
  assert.equal(brailleLeft.at(0), "\u28FF");
  assert.equal(brailleLeft.at(2), "\u2800");
});

test("2. Non-Visual Bridge Respects Sensory Regulation Envelope (Haptics Stay Off Unless Permitted)", () => {
  const strictReg = createSensoryRegulationProfile({ allowHaptics: false });
  const frameOff = buildNonVisualCueFrame({
    targetLabel: "SAVE Star",
    dxQ16: toQ16(-80),
    dyQ16: toQ16(-80),
    bridgeProfile: createNonVisualBridgeProfile({ hapticsOptIn: true }),
    regulationProfile: strictReg,
  });

  assert.equal(frameOff.haptics.leftActuatorHz, 0);
  assert.ok(frameOff.ariaLiveText.includes("SAVE Star: ahead-left"));

  const hapticsOnReg = createSensoryRegulationProfile({ allowHaptics: true });
  const frameOn = buildNonVisualCueFrame({
    targetLabel: "SAVE Star",
    dxQ16: toQ16(-80),
    dyQ16: toQ16(-80),
    bridgeProfile: createNonVisualBridgeProfile({ hapticsOptIn: true }),
    regulationProfile: hapticsOnReg,
  });

  assert.ok(frameOn.haptics.leftActuatorHz > 0);
  assert.equal(frameOn.haptics.attenuated, true);
});
