# ⚔️ Genre Blueprint 03: Co-op Action-RPG (*Dungeon Siege 3* Style)

**Target Shape:** Couch or networked 2–4 player isometric action-RPG with real-time melee/spell combat, shared party buffs, loot drops, and branch-voting dialogue.  
**Primary Math Toys:**
* `math-toys/03-lie-commutator-co-op/lie-commutator.js` (Concurrent party action conflict detection via `[O_A, O_B] = O_A*O_B - O_B*O_A`)
* `math-toys/04-symplectic-ballistics/symplectic-ballistics.js` (60 Hz dash/knockback kinematics & 64-bit integer AoE/melee hitboxes)
* `math-toys/00-core-q16/core.js` (`Q16.16` fixed-point arithmetic & deterministic `SHA-256` session state digests)

---

## 1. Why Lie Commutators Solve Co-op State Races

In a cooperative Action-RPG like *Dungeon Siege 3*, multiple players act simultaneously on the same tick: Player 1 drinks a healing potion while Player 2 opens a chest, triggers a shrine buff, or casts a knockback shockwave on a boss.

Instead of locking the entire game state with heavy mutexes or letting race conditions duplicate loot, **Lie Commutator Conflict Detection (`computeLieBracketQ16`)** classifies concurrent player operators \(\mathbf{O}_A\) and \(\mathbf{O}_B\) mathematically:
* **Commuting Operators (`[O_A, O_B] === 0`):** Independent actions (such as two players healing their own HP bars or moving in separate lanes) commute cleanly and can be applied in any arrival order (**CRDT-safe**).
* **Non-Commuting Operators (`[O_A, O_B] !== 0`):** Coupled state mutations (such as two players claiming the same unique relic, flipping the same lever, or stacking multiplicative elemental vulnerabilities on one boss) produce a non-zero Lie bracket—triggering **deterministic canonical ordering** (e.g., sorted by `playerId` on `tick`) so host and guests never diverge.

---

## 2. Dual-Ledger Architecture (`Ledger 1` vs. `Ledger 2`)

```text
[Co-op Inputs on Tick T: { playerA: Op_A, playerB: Op_B }]
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 1: Deterministic Co-op Combat & State Kernel      │
│ • Lie Bracket Check: computeLieBracketQ16(Op_A, Op_B)    │
│ • Canonical Tie-Break if maxDeviationQ16 > 0             │
│ • 60 Hz Dash, Knockback & Projectile Verlet (Toy 04)     │
│ • 64-Bit Integer Hitbox & Damage Resolution              │
└─────────────────┬────────────────────────────────────────┘
                  │ Read-Only Party & Combat Snapshot
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 2: Isometric Camera, VFX & Co-op Vote UI          │
│ • Shared dynamic leash camera framing all party members  │
│ • Elemental combo particle bursts & floating damage text │
│ • Co-op dialogue vote tally banners & WebAudio SFX       │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Wiring the Math Toys into a Co-op ARPG P0 Slice

### A. Detecting Concurrent Loot / Buff Conflicts (`Toy 03`)
Represent each player's state-mutating ability or interaction as an $N \times N$ `Q16.16` operator matrix acting on the shared party/encounter state vector:

```javascript
import { Q_ONE, toQ16 } from "../math-toys/00-core-q16/core.js";
import { computeLieBracketQ16, matMulQ16 } from "../math-toys/03-lie-commutator-co-op/lie-commutator.js";
import { stepStormerVerletQ16, checkCircleHitQ16 } from "../math-toys/04-symplectic-ballistics/symplectic-ballistics.js";

export function resolveCoopTickActions(opPlayer1, opPlayer2, dim = 3) {
  const { commutes, maxDeviationQ16 } = computeLieBracketQ16(opPlayer1, opPlayer2, dim);

  if (commutes) {
    // Order-independent: safe for optimistic client prediction
    return {
      combinedOperator: matMulQ16(opPlayer1, opPlayer2, dim),
      conflictDetected: false,
      deviationQ16: 0,
    };
  }

  // Non-commuting race detected: enforce deterministic canonical order (Player 1 -> Player 2)
  return {
    combinedOperator: matMulQ16(opPlayer2, opPlayer1, dim),
    conflictDetected: true,
    deviationQ16: maxDeviationQ16,
  };
}
```

### B. 60 Hz Dodge-Roll, Knockback & Spell Hitboxes (`Toy 04`)
Use `stepStormerVerletQ16` for smooth inertial dodge-rolls and enemy knockback arcs, and `checkCircleHitQ16` for melee cleave arcs and fireball collisions so hit detection is 100% identical across couch and online peers.

---

## 4. Common Co-op Action-RPG Failure Traps & How This Kit Prevents Them

| Failure Trap | Why It Breaks Co-op ARPGs | Kit Guardrail |
| :--- | :--- | :--- |
| **Item / Chest Duplication** | Two peers interact with a chest on the same tick before host confirmation. | Non-zero Lie bracket `[O_1, O_2] !== 0` flags coupled resource access for canonical ordering. |
| **Desynced Knockback & AoE** | Floating-point radial pushback nudges a boss differently on Client B. | `stepStormerVerletQ16` + `checkCircleHitQ16` execute strictly in `Q16.16` integers. |
| **Camera Tether Fighting** | Camera zoom/pan logic accidentally clamping player world coordinates. | Camera framing lives strictly in `Ledger 2`; player bounds live in `Ledger 1`. |

---

## 5. Minimum Playable P0 Checklist

- [ ] Two playable heroes (`P1` Warrior, `P2` Mage) moving in a shared arena via `stepStormerVerletQ16`.
- [ ] One commuting action pair (individual healing) and one non-commuting action pair (shared shrine/chest claim) verified with `computeLieBracketQ16`.
- [ ] One AoE spell or cleave attack using `checkCircleHitQ16` against a boss dummy.
- [ ] A deterministic `node --test` check confirming `resolveCoopTickActions` resolves non-commuting operators identically regardless of network packet arrival order.
