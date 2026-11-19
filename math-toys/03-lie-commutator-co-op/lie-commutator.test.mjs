import test from "node:test";
import assert from "node:assert/strict";
import { Q_ONE, toQ16 } from "../00-core-q16/core.js";
import { computeLieBracketQ16 } from "./lie-commutator.js";

test("Lie Commutator: Distinguishes CRDT-safe commuting actions from causal conflicts", () => {
  // Diagonal operators always commute (e.g., two players drinking separate potions)
  const diagA = new Int32Array([toQ16(1.2), 0, 0, Q_ONE]);
  const diagB = new Int32Array([Q_ONE, 0, 0, toQ16(0.8)]);
  const resCommute = computeLieBracketQ16(diagA, diagB, 2);
  assert.equal(resCommute.commutes, true);
  assert.equal(resCommute.maxDeviationQ16, 0);

  // Off-diagonal coupling operators do not commute (e.g., loot/door state race)
  const opA = new Int32Array([Q_ONE, toQ16(0.5), 0, Q_ONE]);
  const opB = new Int32Array([Q_ONE, 0, toQ16(0.5), Q_ONE]);
  const resConflict = computeLieBracketQ16(opA, opB, 2);
  assert.equal(resConflict.commutes, false);
  assert.ok(resConflict.maxDeviationQ16 > 0);
});
