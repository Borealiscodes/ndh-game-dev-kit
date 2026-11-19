import test from "node:test";
import assert from "node:assert/strict";
import { toQ16 } from "../00-core-q16/core.js";
import {
  createSheafGraph,
  addRestrictionEdge,
  traverseNodeAction,
  computeCoboundaryEnergyQ16,
  sheafifyStep,
} from "./sheaf-holonomy.js";

test("Cellular Sheaf: Coboundary inconsistency decay & loop holonomy trace", () => {
  let g = createSheafGraph(["megaton", "rivet_city", "citadel"], 2);
  g = addRestrictionEdge(g, "megaton", "rivet_city", 1.0);
  g = addRestrictionEdge(g, "rivet_city", "citadel", 1.0);

  g = traverseNodeAction(g, "megaton", [toQ16(0.8), toQ16(-0.4)]);
  g = traverseNodeAction(g, "rivet_city", [toQ16(0.2), toQ16(0.1)]);

  const eBefore = computeCoboundaryEnergyQ16(g);
  assert.ok(eBefore > 0);
  assert.notEqual(g.holonomyAccumQ16[0], 0);

  for (let i = 0; i < 12; i++) g = sheafifyStep(g, 0.2);
  assert.ok(computeCoboundaryEnergyQ16(g) < eBefore);
});
