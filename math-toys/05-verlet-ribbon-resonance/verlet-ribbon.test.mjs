import test from "node:test";
import assert from "node:assert/strict";
import { toQ16, fromQ16 } from "../00-core-q16/core.js";
import { createVerletRibbon, stepVerletRibbon } from "./verlet-ribbon.js";

test("Verlet Ribbon: Preserves rest-length distance constraint under head motion", () => {
  let ribbon = createVerletRibbon(100, 100, 8, 6.0);
  ribbon = stepVerletRibbon(ribbon, toQ16(140), toQ16(100), 6.0, 0.86);

  const dx = fromQ16(ribbon[1].xQ16) - fromQ16(ribbon[0].xQ16);
  const dy = fromQ16(ribbon[1].yQ16) - fromQ16(ribbon[0].yQ16);
  const dist = Math.hypot(dx, dy);
  assert.ok(dist <= 6.05, `Expected segment distance <= 6.05, got ${dist}`);
});
