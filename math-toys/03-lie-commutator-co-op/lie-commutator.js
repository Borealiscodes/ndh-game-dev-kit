/**
 * math-toys/03-lie-commutator-co-op/lie-commutator.js
 * Toy 03: Non-Commutative Operator Bracket [O_A, O_B] = O_A*O_B - O_B*O_A
 * Detects whether concurrent player actions commute (CRDT-safe) or conflict
 * (requires deterministic host tie-breaking) in Co-op ARPGs & Networked RTS/FPS.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { qAdd, qSub, qMul } from "../00-core-q16/core.js";

/**
 * Multiply two NxN Q16.16 matrices stored in flat row-major Int32Array.
 */
export function matMulQ16(A, B, n) {
  const out = new Int32Array(n * n);
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      const aik = A[i * n + k];
      if (aik === 0) continue;
      for (let j = 0; j < n; j++) {
        out[i * n + j] = qAdd(out[i * n + j], qMul(aik, B[k * n + j]));
      }
    }
  }
  return out;
}

/**
 * Compute exact Lie commutator bracket [A, B] = A*B - B*A in Q16.16.
 * Returns { bracket, commutes, maxDeviationQ16 }.
 */
export function computeLieBracketQ16(A, B, n) {
  const AB = matMulQ16(A, B, n);
  const BA = matMulQ16(B, A, n);
  const bracket = new Int32Array(n * n);

  let maxDev = 0;
  for (let i = 0; i < n * n; i++) {
    const diff = qSub(AB[i], BA[i]);
    bracket[i] = diff;
    const abs = Math.abs(diff);
    if (abs > maxDev) maxDev = abs;
  }

  return {
    bracket,
    commutes: maxDev === 0,
    maxDeviationQ16: maxDev,
  };
}
