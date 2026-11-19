/**
 * math-toys/04-symplectic-ballistics/symplectic-ballistics.js
 * Toy 04: 60 Hz Störmer–Verlet Kinematics & 64-Bit Integer Hitboxes
 * Zero-float ballistic & arcade motion with exact squared-distance collision checks.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { qAdd, qSub, qMul, toQ16 } from "../00-core-q16/core.js";

export const DT_60HZ_Q16 = toQ16(1.0 / 60.0);
export const HALF_DT_60HZ_Q16 = toQ16(0.5 / 60.0);

/**
 * Kick-Drift-Kick Störmer–Verlet step in Q16.16.
 */
export function stepStormerVerletQ16(body, axQ16 = 0, ayQ16 = 0) {
  const vxHalf = qAdd(body.vxQ16, qMul(axQ16, HALF_DT_60HZ_Q16));
  const vyHalf = qAdd(body.vyQ16, qMul(ayQ16, HALF_DT_60HZ_Q16));

  const xNext = qAdd(body.xQ16, qMul(vxHalf, DT_60HZ_Q16));
  const yNext = qAdd(body.yQ16, qMul(vyHalf, DT_60HZ_Q16));

  const vxNext = qAdd(vxHalf, qMul(axQ16, HALF_DT_60HZ_Q16));
  const vyNext = qAdd(vyHalf, qMul(ayQ16, HALF_DT_60HZ_Q16));

  return {
    ...body,
    xQ16: xNext,
    yQ16: yNext,
    vxQ16: vxNext,
    vyQ16: vyNext,
  };
}

/**
 * Exact 64-bit integer squared-distance circle collision (no square roots or floats).
 */
export function checkCircleHitQ16(a, b) {
  const dx = BigInt(qSub(a.xQ16, b.xQ16));
  const dy = BigInt(qSub(a.yQ16, b.yQ16));
  const rSum = BigInt(qAdd(a.radiusQ16, b.radiusQ16));
  return dx * dx + dy * dy <= rSum * rSum;
}
