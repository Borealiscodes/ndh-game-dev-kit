# ☢️ Genre Blueprint 02: Open-World RPG (*Fallout 3* Style)

**Target Shape:** Exploration-driven open-world RPG with interconnected settlements, multi-faction reputation dynamics, morally grey quest consequences, and persistent world memory.  
**Primary Math Toys:**
* `math-toys/02-cellular-sheaf-holonomy/sheaf-holonomy.js` (Faction reputation stalks, alliance coboundary tension, non-commuting quest loop memory)
* `math-toys/00-core-q16/core.js` (`Q16.16` fixed-point vectors & `SHA-256` save-file provenance receipts)

---

## 1. Why Cellular Sheaves Replace "Boolean Flag Rot"

Traditional open-world RPGs track world state using thousands of disconnected boolean flags (`megaton_saved = true`, `tenpenny_hostile = false`, `brotherhood_alerted = true`). As quests interact across towns, combinatorial edge cases explode—leading to broken NPC dialogue, contradictory quest states, and brittle `if/else` spaghetti.

**Cellular Sheaf Cohomology** replaces ad-hoc boolean flags with a clean mathematical graph:
* **Vertices (Settlements & Factions):** Each hub (`megaton`, `rivet_city`, `citadel`, `tenpenny_tower`) holds a multi-channel `Q16.16` state vector (**Stalk**), such as `[Karma, Order, Scarcity, Hostility]`.
* **Edges (Alliances, Trade Routes & Rivalries):** Weighted restriction maps connect settlements. When your actions shift Megaton's state, **coboundary inconsistency energy** (`computeCoboundaryEnergyQ16`) automatically measures how much political friction that creates with Rivet City or the Brotherhood of Steel.
* **Path-Ordered Holonomy (`holonomyAccumQ16`):** Because `traverseNodeAction` signs impulses by path parity, **the order in which you visit towns and resolve quests leaves a topological memory trace**—allowing NPCs to react differently if you sabotaged a water purifier *before* negotiating peace versus *after*.

---

## 2. Dual-Ledger Architecture (`Ledger 1` vs. `Ledger 2`)

```text
[Player Quest Choice / Dialogue Action: { nodeId, deltaVectorQ16 }]
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 1: Cellular Sheaf World State (Deterministic)     │
│ • Faction Stalk Vectors in Q16.16 (traverseNodeAction)   │
│ • Inter-Faction Tension (computeCoboundaryEnergyQ16)     │
│ • Rumor & Trade Equilibrium Propagation (sheafifyStep)   │
│ • Save-File Integrity Hash (sha256Hex)                   │
└─────────────────┬────────────────────────────────────────┘
                  │ Read-Only Stalk & Holonomy Snapshot
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 2: Dialogue Trees, Radio & World Dressing         │
│ • Branching NPC dialogue filters & Pip-Boy status text   │
│ • Three-Dog / Radio broadcast commentary selection       │
│ • Settlement banner swaps & ambient music mood           │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Wiring the Math Toy into an Open-World RPG P0 Slice

### A. Modeling Faction Stalks & Rumor Propagation (`Toy 02`)
Define a 4-channel `Q16.16` vector `[Reputation, Security, Prosperity, Unrest]` for every settlement in the wasteland, and link them with trade or ideological edges:

```javascript
import { toQ16, fromQ16, sha256Hex } from "../math-toys/00-core-q16/core.js";
import {
  createSheafGraph,
  addRestrictionEdge,
  traverseNodeAction,
  computeCoboundaryEnergyQ16,
  sheafifyStep,
} from "../math-toys/02-cellular-sheaf-holonomy/sheaf-holonomy.js";

export function initWastelandSheaf() {
  // Channels: [0: Reputation, 1: Security, 2: Prosperity, 3: Unrest]
  let world = createSheafGraph(["megaton", "rivet_city", "citadel", "tenpenny"], 4);

  // Positive weights = allied/trade partners; negative weights = ideological rivals
  world = addRestrictionEdge(world, "megaton", "rivet_city", 0.85);
  world = addRestrictionEdge(world, "rivet_city", "citadel", 0.75);
  world = addRestrictionEdge(world, "megaton", "tenpenny", -0.9);
  return world;
}

export function resolveQuestOutcome(world, settlementId, impactFloats) {
  const deltaQ16 = impactFloats.map(toQ16);
  let next = traverseNodeAction(world, settlementId, deltaQ16);

  // Propagate rumors and trade ripples across connected settlements
  next = sheafifyStep(next, 0.15);

  const tension = computeCoboundaryEnergyQ16(next);
  const receipt = sha256Hex(JSON.stringify({ path: next.pathHistory, holonomy: Array.from(next.holonomyAccumQ16) }));
  return { world: next, regionalTensionQ16: tension, receipt };
}
```

### B. Driving NPC Dialogue & Radio Broadcasts (`Ledger 2`)
Instead of checking 40 quest flags to pick an NPC greeting, `Ledger 2` inspects the local stalk and global coboundary energy:
* If `stalk[Reputation] > +0.5` and `regionalTensionQ16` is low: NPCs greet you as a wasteland peacekeeper.
* If `stalk[Reputation] > +0.5` locally, but `regionalTensionQ16` is high: Guards warn you that neighboring rival settlements are mobilizing against your allies.
* If `holonomyAccumQ16[0] !== 0` on a closed loop (`megaton -> tenpenny -> megaton`): Companions comment on your double-dealing path history.

---

## 4. Common Open-World RPG Failure Traps & How This Kit Prevents Them

| Failure Trap | Why It Breaks Open-World RPGs | Kit Guardrail |
| :--- | :--- | :--- |
| **Boolean Flag Explosion** | $2^N$ combinations of quest flags create impossible states and soft-locks. | Continuous `Q16.16` stalk vectors + `sheafifyStep` naturally reconcile local actions across the graph. |
| **Order-Blind Quests** | Doing Quest B before Quest A produces identical dialogue to A before B. | `holonomyAccumQ16` records path-ordered non-commutative loop history automatically. |
| **LLM / Dialogue Hallucinations** | Generative NPC text accidentally granting items or altering faction standing. | Strict `Ledger 2` read-only rule: dialogue can read stalks, never write to `Ledger 1`. |

---

## 5. Minimum Playable P0 Checklist

- [ ] A 4-node wasteland map (`megaton`, `rivet_city`, `citadel`, `tenpenny`) initialized with `createSheafGraph`.
- [ ] Two moral-choice quest triggers that call `traverseNodeAction` with opposing `[Reputation, Security, Prosperity, Unrest]` vectors.
- [ ] A live "Wasteland Tension" meter displaying `computeCoboundaryEnergyQ16` and path holonomy.
- [ ] A deterministic unit test (`node --test`) proving that visiting `A -> B -> A` yields a distinct holonomy trace from `B -> A -> B`.
