/**
 * math-toys/05-verlet-ribbon-resonance/verlet-ribbon.js
 * Toy 05: Position-Based Verlet Silk Chain & Sealed-Adjacency Canopy Alignment
 * Used for Interactive Art Canvases, Journey-style scarves, and non-merging flocking.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { qAdd, qSub, qMul, toQ16, fromQ16 } from "../00-core-q16/core.js";

export function createVerletRibbon(anchorX, anchorY, segments = 10, spacing = 6.0) {
  const xQ16 = toQ16(anchorX);
  const yQ16 = toQ16(anchorY);
  return Array.from({ length: segments }, (_, i) => ({
    xQ16,
    yQ16: qAdd(yQ16, toQ16(i * spacing)),
    oldXQ16: xQ16,
    oldYQ16: qAdd(yQ16, toQ16(i * spacing)),
  }));
}

export function stepVerletRibbon(ribbon, headXQ16, headYQ16, restLen = 6.0, damping = 0.86) {
  const dampQ16 = toQ16(damping);
  const next = ribbon.map((n) => ({ ...n }));
  next[0].xQ16 = headXQ16 | 0;
  next[0].yQ16 = headYQ16 | 0;

  for (let i = 1; i < next.length; i++) {
    const cur = next[i];
    const prev = next[i - 1];
    const vx = qMul(qSub(cur.xQ16, cur.oldXQ16), dampQ16);
    const vy = qMul(qSub(cur.yQ16, cur.oldYQ16), dampQ16);

    cur.oldXQ16 = cur.xQ16;
    cur.oldYQ16 = cur.yQ16;
    cur.xQ16 = qAdd(cur.xQ16, vx);
    cur.yQ16 = qAdd(cur.yQ16, vy);

    const dx = fromQ16(qSub(cur.xQ16, prev.xQ16));
    const dy = fromQ16(qSub(cur.yQ16, prev.yQ16));
    const dist = Math.hypot(dx, dy);
    if (dist > restLen && dist > 0.001) {
      const ratio = (dist - restLen) / dist;
      cur.xQ16 = qSub(cur.xQ16, toQ16(dx * ratio));
      cur.yQ16 = qSub(cur.yQ16, toQ16(dy * ratio));
    }
  }
  return next;
}
