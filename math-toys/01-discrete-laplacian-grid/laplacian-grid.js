/**
 * math-toys/01-discrete-laplacian-grid/laplacian-grid.js
 * Toy 01: FLOP-Bounded 2D Neumann Discrete Laplacian Grid (RTS / Space Sim / Thermal PDE)
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { qAdd, qSub, qMul, toQ16, fromQ16, sha256Hex } from "../00-core-q16/core.js";

export const FLOPS_PER_CELL = 9;

export function createLaplacianGrid({
  dim = 9,
  baseline = 0.15,
  alpha = 0.18,
  damping = 0.96,
  flopCeiling = 2000,
} = {}) {
  const cellCount = dim * dim;
  const baselineQ16 = toQ16(baseline);
  const grid = new Int32Array(cellCount);
  grid.fill(baselineQ16);

  return {
    dim,
    cellCount,
    baselineQ16,
    alphaQ16: toQ16(alpha),
    dampingQ16: toQ16(damping),
    flopCeiling,
    cycle: 0,
    lastCycleFlops: 0,
    grid,
  };
}

export function applyRadialShock(state, row, col, magnitude = 0.85, sideRatio = 0.45) {
  const { dim } = state;
  const nextGrid = new Int32Array(state.grid);
  const magQ16 = toQ16(magnitude);
  const sideQ16 = qMul(magQ16, toQ16(sideRatio));
  const capQ16 = toQ16(2.5);

  const stamp = (r, c, delta) => {
    if (r < 0 || r >= dim || c < 0 || c >= dim) return;
    const idx = r * dim + c;
    nextGrid[idx] = Math.min(capQ16, Math.max(0, qAdd(nextGrid[idx], delta)));
  };

  stamp(row, col, magQ16);
  stamp(row - 1, col, sideQ16);
  stamp(row + 1, col, sideQ16);
  stamp(row, col - 1, sideQ16);
  stamp(row, col + 1, sideQ16);

  return { ...state, grid: nextGrid };
}

export function stepLaplacian(state) {
  const { dim, cellCount, flopCeiling, baselineQ16, alphaQ16, dampingQ16, grid } = state;
  const cycleFlops = cellCount * FLOPS_PER_CELL;
  if (cycleFlops > flopCeiling) {
    throw new Error(`FLOP ceiling exceeded: ${cycleFlops} > ${flopCeiling}`);
  }

  const next = new Int32Array(cellCount);
  for (let r = 0; r < dim; r++) {
    const rUp = r > 0 ? r - 1 : r;
    const rDn = r < dim - 1 ? r + 1 : r;
    for (let c = 0; c < dim; c++) {
      const cLt = c > 0 ? c - 1 : c;
      const cRt = c < dim - 1 ? c + 1 : c;

      const idx = r * dim + c;
      const center = grid[idx];
      const neighbors = qAdd(
        qAdd(grid[rUp * dim + c], grid[rDn * dim + c]),
        qAdd(grid[r * dim + cLt], grid[r * dim + cRt])
      );
      const laplacian = qSub(neighbors, center << 2);
      const diffused = qAdd(center, qMul(alphaQ16, laplacian));
      const excess = qSub(diffused, baselineQ16);
      next[idx] = Math.max(0, qAdd(baselineQ16, qMul(dampingQ16, excess)));
    }
  }

  return {
    ...state,
    cycle: state.cycle + 1,
    lastCycleFlops: cycleFlops,
    grid: next,
  };
}

export function computeDirichletEnergy(state) {
  const { dim, grid } = state;
  let energy = 0;
  for (let r = 0; r < dim; r++) {
    for (let c = 0; c < dim; c++) {
      const v = fromQ16(grid[r * dim + c]);
      if (r < dim - 1) {
        const d = v - fromQ16(grid[(r + 1) * dim + c]);
        energy += 0.5 * d * d;
      }
      if (c < dim - 1) {
        const d = v - fromQ16(grid[r * dim + (c + 1)]);
        energy += 0.5 * d * d;
      }
    }
  }
  return energy;
}

export function gridDigest(state) {
  return sha256Hex(JSON.stringify({ cycle: state.cycle, grid: Array.from(state.grid) }));
}
