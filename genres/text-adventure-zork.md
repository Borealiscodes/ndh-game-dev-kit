# 📜 Genre Blueprint 07: Text Adventure & Interactive Fiction (*Zork* Style)

**Target Shape:** Classic parser (`GO NORTH`, `TAKE LAMP`, `UNLOCK GRATE`) or hypertext interactive fiction featuring interconnected labyrinth rooms, multi-step puzzle chains, non-Euclidean loop mysteries, and optional LLM flavor text that cannot break game logic.  
**Primary Math Toys:**
* `math-toys/02-cellular-sheaf-holonomy/sheaf-holonomy.js` (Topological room graph, puzzle state stalks & closed-loop holonomy memory)
* `math-toys/03-lie-commutator-co-op/lie-commutator.js` (Order-dependent puzzle mechanics via `[O_A, O_B] != 0`)
* `math-toys/00-core-q16/core.js` (`Q16.16` fixed-point vectors & `SHA-256` transcript/save verification)

---

## 1. Why Topology & Holonomy Beat Spaghetti `if/else` Room Scripts

In classic *Zork*-style text adventures, world state degrades quickly when every room script mutates global flags (`lamp_lit`, `troll_fed`, `rug_moved`, `trapdoor_open`) directly inside text-printing handlers. Adding an LLM narrator makes this worse if the model hallucinates doors opening or items appearing in inventory.

Modeling the world as a **Cellular Sheaf Graph (`Toy 02`)** paired with **Non-Commuting Puzzle Operators (`Toy 03`)** solves both problems cleanly:
* **Rooms as Graph Vertices with State Stalks:** Each room (`west_of_house`, `living_room`, `cellar`, `treasure_vault`) holds a `Q16.16` state vector `[Illumination, SealIntegrity, Hazard, Resonance]`.
* **Twisty Little Passages & Loop Holonomy (`holonomyAccumQ16`):** Classic mazes ("You are in a maze of twisty little passages, all alike") become genuinely mathematical: walking a closed cycle `A -> B -> C -> A` accumulates a non-zero path-ordered holonomy trace (`holonomyAccumQ16 !== 0`), unlocking hidden passages only when the player traverses a specific loop orientation.
* **Order-Sensitive Puzzles (`Toy 03`):** When two puzzle actions do not commute (`computeLieBracketQ16(opOilHinge, opPullLever).commutes === false`), pulling the lever *before* oiling the rusted hinge jams the mechanism, whereas oiling *first* opens the vault.

---

## 2. Dual-Ledger Architecture (`Ledger 1` vs. `Ledger 2`)

```text
[Player Command: "LIGHT LANTERN" / "GO DOWN" / "PULL LEVER"]
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 1: Deterministic Parser & Sheaf World Kernel      │
│ • Command Verb/Noun Tokenizer -> Canonical Action ID     │
│ • Room Stalk & Loop Holonomy Update (traverseNodeAction) │
│ • Puzzle Order Bracket Check (computeLieBracketQ16)      │
│ • Transcript & Save Digest (sha256Hex)                   │
└─────────────────┬────────────────────────────────────────┘
                  │ Read-Only Room Stalk & Valid Exits Snapshot
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 2: Atmospheric Prose, Retro Terminal & Optional LLM│
│ • Renders room description from current stalk values     │
│ • Optional LLM flavor text strictly sandboxed to prose   │
│ • Retro CRT terminal typography & WebAudio key clicks    │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Wiring the Math Toys into a Text Adventure P0 Slice

### A. Room Graph, Loop Memory & Order-Sensitive Puzzles (`Toy 02` & `Toy 03`)
Define rooms as sheaf vertices and evaluate puzzle transitions strictly inside `Ledger 1`:

```javascript
import { Q_ONE, toQ16, sha256Hex } from "../math-toys/00-core-q16/core.js";
import {
  createSheafGraph,
  addRestrictionEdge,
  traverseNodeAction,
} from "../math-toys/02-cellular-sheaf-holonomy/sheaf-holonomy.js";
import { computeLieBracketQ16 } from "../math-toys/03-lie-commutator-co-op/lie-commutator.js";

export function initZorkLabyrinth() {
  // Stalk channels: [0: Illumination, 1: DoorSeal, 2: GrueHazard, 3: MysteryTrace]
  let map = createSheafGraph(["west_of_house", "living_room", "cellar", "maze_loop"], 4);
  map = addRestrictionEdge(map, "west_of_house", "living_room", 1.0);
  map = addRestrictionEdge(map, "living_room", "cellar", 1.0);
  map = addRestrictionEdge(map, "cellar", "maze_loop", 1.0);
  map = addRestrictionEdge(map, "maze_loop", "living_room", 1.0);
  return map;
}

export function stepParserCommand(world, roomId, actionDeltaFloats) {
  const next = traverseNodeAction(world, roomId, actionDeltaFloats.map(toQ16));
  const transcriptHash = sha256Hex(
    JSON.stringify({ path: next.pathHistory, holonomy: Array.from(next.holonomyAccumQ16) })
  );
  return { world: next, transcriptHash };
}
```

### B. Sandboxing Optional LLM Narration (`Ledger 2` Persona-Zero Rule)
If you connect a local or cloud LLM to generate atmospheric descriptions of the cellar:
* Pass **only** a read-only JSON summary of the current room's `Ledger 1` stalk (`{ room: "cellar", lit: false, exits: ["UP"] }`).
* Never parse LLM output back into `Ledger 1` inventory or exit lists—preventing the narrator from hallucinating a non-existent sword or unlocking a sealed door.

---

## 4. Common Text Adventure Failure Traps & How This Kit Prevents Them

| Failure Trap | Why It Breaks Interactive Fiction | Kit Guardrail |
| :--- | :--- | :--- |
| **Unwinnable Soft-Locks** | Consuming a required key item on the wrong door breaks the rest of the game. | Continuous `Q16.16` stalk states + `sha256Hex` undo/restore snapshots at every turn. |
| **LLM World-State Corruption** | Generative prose claims "You pick up the golden key" when no key exists in state. | Strict `Ledger 2` read-only boundary (`AGENTS.md` Persona-Zero rule). |
| **Stateless Maze Wandering** | Walking in circles feels identical regardless of path orientation. | `holonomyAccumQ16` tracks closed-loop traversal parity automatically. |

---

## 5. Minimum Playable P0 Checklist

- [ ] A 4-room connected graph (`west_of_house`, `living_room`, `cellar`, `maze_loop`) built with `createSheafGraph`.
- [ ] A command parser (`GO <DIR>`, `LIGHT LAMP`, `EXAMINE`, `UNDO`) mutating only `Ledger 1` stalk vectors.
- [ ] One non-commuting 2-step puzzle (`computeLieBracketQ16`) where action order determines success.
- [ ] A deterministic `node --test` transcript check verifying that replaying a command list produces the exact same `sha256Hex` digest.
