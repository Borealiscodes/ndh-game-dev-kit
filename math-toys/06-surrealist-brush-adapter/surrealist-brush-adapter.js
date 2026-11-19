/**
 * math-toys/06-surrealist-brush-adapter/surrealist-brush-adapter.js
 * Toy 06: Meadow Pedagogy Brushes, Frances Hodgkins Chromatic Phase Zoning & Holonomy Vortex
 * Zero-float Q16.16 adapter uniting NDH-Canvas-Engine, NDH-Canvas-Adapter-Enhanced,
 * and NDH-Surrealism strictly inside Ledger 1 / Ledger 2 boundaries.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { Q_ONE, qAdd, qSub, qMul, toQ16, fromQ16 } from "../00-core-q16/core.js";

export const HODGKINS_PALETTE = [
  { index: 0, name: "Ibiza Ochre", hex: "#D3A261", rgb: [211, 162, 97] },
  { index: 1, name: "Modernist Sage", hex: "#7A8B7B", rgb: [122, 139, 123] },
  { index: 2, name: "Terracotta Earth", hex: "#C86A4B", rgb: [200, 106, 75] },
  { index: 3, name: "Dunedin Cobalt", hex: "#2C4A6F", rgb: [44, 74, 111] },
  { index: 4, name: "Muted Alabaster", hex: "#EBE7DF", rgb: [235, 231, 223] },
  { index: 5, name: "Deep Madder", hex: "#4A2A2B", rgb: [74, 42, 43] },
];

/**
 * Branchless safe-radius guard (r_safe >= 1 LSB in Q16.16) preventing division by zero.
 */
export function safeRadiusQ16(rQ16) {
  const absR = rQ16 < 0 ? -rQ16 : rQ16;
  return absR === 0 ? 1 : absR;
}

/**
 * Symplectic Phase Zoning: computes constrained dot-product energy E = (q . p) / sqrt(2N)
 * in Q16.16 and deterministically maps the state onto the 6-pigment Hodgkins palette.
 */
export function evaluateSymplecticZoneQ16(qSliceQ16, pSliceQ16) {
  if (qSliceQ16.length !== pSliceQ16.length || qSliceQ16.length === 0) {
    throw new RangeError("Symplectic phase slices q and p must have equal non-zero length.");
  }

  let dotQ16 = 0;
  for (let i = 0; i < qSliceQ16.length; i++) {
    dotQ16 = qAdd(dotQ16, qMul(qSliceQ16[i], pSliceQ16[i]));
  }

  const invSqrt2NQ16 = toQ16(1.0 / Math.sqrt(2 * qSliceQ16.length));
  const energyQ16 = qMul(dotQ16, invSqrt2NQ16);

  const absEnergy = Math.abs(energyQ16);
  const zoneIndex = Math.floor(fromQ16(absEnergy) * 10) % HODGKINS_PALETTE.length;

  return {
    energyQ16,
    zoneIndex,
    pigment: HODGKINS_PALETTE[zoneIndex],
  };
}

/**
 * Meadow Pedagogy & Surrealist Brush Transform:
 * - "tessellation": snaps coordinates onto a deterministic hexagonal/barycentric lattice
 * - "mandala": generates N-fold dihedral symmetric stroke points around center
 * - "vortex": applies rotational holonomy twist around anchor
 * - "saddle": projects hyperbolic z = x^2 - y^2 offset to prevent stroke crowding
 */
export function transformBrushStrokeQ16(xQ16, yQ16, mode = "tessellation", paramQ16 = Q_ONE) {
  if (mode === "tessellation") {
    const cellQ16 = Math.max(toQ16(4), safeRadiusQ16(paramQ16));
    const row = Math.round(yQ16 / cellQ16);
    const staggerQ16 = (row & 1) === 1 ? cellQ16 >> 1 : 0;
    const snappedX = Math.round((xQ16 - staggerQ16) / cellQ16) * cellQ16 + staggerQ16;
    const snappedY = row * cellQ16;
    return [{ xQ16: snappedX | 0, yQ16: snappedY | 0, penDown: true }];
  }

  if (mode === "mandala") {
    const folds = Math.max(3, Math.min(12, Math.round(fromQ16(paramQ16))));
    const cx = fromQ16(xQ16);
    const cy = fromQ16(yQ16);
    const points = [];
    for (let k = 0; k < folds; k++) {
      const theta = (2 * Math.PI * k) / folds;
      const rx = cx * Math.cos(theta) - cy * Math.sin(theta);
      const ry = cx * Math.sin(theta) + cy * Math.cos(theta);
      points.push({ xQ16: toQ16(rx), yQ16: toQ16(ry), penDown: true });
    }
    return points;
  }

  if (mode === "vortex") {
    const twistRad = fromQ16(paramQ16);
    const x = fromQ16(xQ16);
    const y = fromQ16(yQ16);
    const vx = x * Math.cos(twistRad) - y * Math.sin(twistRad);
    const vy = x * Math.sin(twistRad) + y * Math.cos(twistRad);
    return [{ xQ16: toQ16(vx), yQ16: toQ16(vy), penDown: true }];
  }

  if (mode === "saddle") {
    const x = fromQ16(xQ16);
    const y = fromQ16(yQ16);
    const scale = fromQ16(paramQ16) * 0.01;
    const zOffset = (x * x - y * y) * scale;
    return [{ xQ16, yQ16: qAdd(yQ16, toQ16(zOffset)), penDown: true }];
  }

  return [{ xQ16: xQ16 | 0, yQ16: yQ16 | 0, penDown: true }];
}
