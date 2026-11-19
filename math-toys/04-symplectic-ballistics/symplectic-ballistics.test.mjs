import test from "node:test";
import assert from "node:assert/strict";
import { toQ16, fromQ16 } from "../00-core-q16/core.js";
import { stepStormerVerletQ16, checkCircleHitQ16 } from "./symplectic-ballistics.js";

test("Symplectic Ballistics: 60 Hz Störmer-Verlet trajectory & 64-bit hitbox", () => {
  let proj = {
    xQ16: toQ16(0),
    yQ16: toQ16(0),
    vxQ16: toQ16(120),
    vyQ16: toQ16(0),
    radiusQ16: toQ16(4),
  };

  for (let t = 0; t < 30; t++) {
    proj = stepStormerVerletQ16(proj, 0, toQ16(9.8));
  }
  assert.ok(Math.abs(fromQ16(proj.xQ16) - 60.0) < 0.25);

  const target = { xQ16: proj.xQ16, yQ16: proj.yQ16, radiusQ16: toQ16(8) };
  assert.equal(checkCircleHitQ16(proj, target), true);
});
