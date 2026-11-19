import test from "node:test";
import assert from "node:assert/strict";
import { toQ16 } from "../00-core-q16/core.js";
import {
  safeRadiusQ16,
  evaluateSymplecticZoneQ16,
  transformBrushStrokeQ16,
} from "./surrealist-brush-adapter.js";

test("Surrealist Brush Adapter: Safe radius, Hodgkins zoning & Meadow brushes", () => {
  assert.equal(safeRadiusQ16(0), 1);

  const q = new Int32Array([toQ16(0.8), toQ16(-0.5), toQ16(0.4), toQ16(0.9)]);
  const p = new Int32Array([toQ16(0.6), toQ16(0.3), toQ16(-0.7), toQ16(0.5)]);
  const zone = evaluateSymplecticZoneQ16(q, p);
  assert.ok(zone.zoneIndex >= 0 && zone.zoneIndex < 6);
  assert.ok(zone.pigment.hex.startsWith("#"));

  const mandalaPts = transformBrushStrokeQ16(toQ16(20), toQ16(0), "mandala", toQ16(6));
  assert.equal(mandalaPts.length, 6);

  const hexPts = transformBrushStrokeQ16(toQ16(19), toQ16(17), "tessellation", toQ16(16));
  assert.equal(hexPts.length, 1);
  assert.equal(hexPts[0].penDown, true);
});
