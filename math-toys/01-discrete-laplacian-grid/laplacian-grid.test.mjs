import test from "node:test";
import assert from "node:assert/strict";
import {
  createLaplacianGrid,
  applyRadialShock,
  stepLaplacian,
  computeDirichletEnergy,
  gridDigest,
} from "./laplacian-grid.js";

test("Laplacian Grid: 729 FLOP governance, energy decay & SHA-256 parity", () => {
  let g1 = applyRadialShock(createLaplacianGrid(), 4, 4, 1.0);
  let g2 = applyRadialShock(createLaplacianGrid(), 4, 4, 1.0);

  const e0 = computeDirichletEnergy(g1);
  for (let i = 0; i < 10; i++) {
    g1 = stepLaplacian(g1);
    g2 = stepLaplacian(g2);
  }
  assert.equal(g1.lastCycleFlops, 729);
  assert.ok(computeDirichletEnergy(g1) < e0);
  assert.equal(gridDigest(g1), gridDigest(g2));
});
