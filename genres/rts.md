# 🏰 Genre Blueprint 01: Real-Time Strategy (RTS)

**Target Shape:** Tactical top-down or isometric RTS with territory control, supply/morale wavefronts, deterministic lockstep multiplayer, and bounded-CPU unit pathing/combat.  
**Primary Math Toys:**
* `math-toys/01-discrete-laplacian-grid/laplacian-grid.js` (Supply propagation, fog-of-war decay, terrain hazard spread)
* `math-toys/04-symplectic-ballistics/symplectic-ballistics.js` (60 Hz unit movement & artillery/projectile hitboxes)
* `math-toys/00-core-q16/core.js` (`Q16.16` fixed-point arithmetic, Mulberry32 PRNG, `SHA-256` lockstep sync receipts)

---

## 1. Why Deterministic Fixed-Point Math Is Mandatory for RTS

In an RTS with dozens or hundreds of units, transmitting every unit's position every frame saturates network bandwidth. Instead, RTS engines use **Deterministic Lockstep**: peers only transmit player commands (`move`, `build`, `attack`) tagged with a simulation tick number, and every machine simulates the exact same `60 Hz` step locally.

If even **one floating-point rounding difference** occurs between an ARM64 tablet and an x86 desktop, a unit turns left on one screen and right on the other—causing total **desync**. Using `Q16.16` fixed-point integers (`Ledger 1`) and periodic `sha256Hex()` state hashes guarantees bit-exact lockstep parity.

---

## 2. Dual-Ledger Architecture (`Ledger 1` vs. `Ledger 2`)

```text
[Player Commands: { tick, playerId, cmd }]
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 1: Deterministic Lockstep Simulation (60 Hz)      │
│ • Unit Kinematics & Hitboxes (Toy 04: Q16.16 Verlet)     │
│ • Territory / Supply / Hazard PDE (Toy 01: Laplacian)    │
│ • Periodic Sync Checksum (sha256Hex every 60 ticks)      │
└─────────────────┬────────────────────────────────────────┘
                  │ Read-Only State Snapshot
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 2: Presentation & Selection UI (Variable FPS)     │
│ • Smooth camera pan/zoom & interpolated sprite visuals   │
│ • Fog-of-war shader & supply heatmap overlay             │
│ • WebAudio unit acknowledgment bleeps & battle SFX       │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Wiring the Math Toys into an RTS P0 Slice

### A. Territory Supply, Radiation, or Fire Spread (`Toy 01`)
Instead of expensive per-unit aura radius loops ($O(N^2)$), represent strategic map sectors as a coarse **discrete Laplacian lattice** (e.g., `9×9` or `16×16` tiles):
* **Supply Depots & Beacons:** Call `applyRadialShock(grid, depotRow, depotCol, +0.9)` each second to inject positive supply/morale pressure.
* **Artillery Strikes & Hazard Zones:** Call `applyRadialShock(grid, impactRow, impactCol, +1.2)` on a hazard layer; `stepLaplacian(grid)` smoothly diffuses smoke, radiation, or morale shockwaves across neighboring tiles under a strict FLOP ceiling (`≤ 2,000 FLOPs/cycle`).

### B. Unit Movement & Artillery Ballistics (`Toy 04`)
Store every unit's position `(xQ16, yQ16)`, velocity `(vxQ16, vyQ16)`, and collision radius `radiusQ16` in signed 32-bit `Q16.16` integers:

```javascript
import { toQ16 } from "../math-toys/00-core-q16/core.js";
import { stepStormerVerletQ16, checkCircleHitQ16 } from "../math-toys/04-symplectic-ballistics/symplectic-ballistics.js";
import { createLaplacianGrid, applyRadialShock, stepLaplacian } from "../math-toys/01-discrete-laplacian-grid/laplacian-grid.js";

export function stepRtsTick(world, commands) {
  // 1. Apply deterministic lockstep commands for this tick
  for (const cmd of commands) {
    if (cmd.type === "ARTILLERY_STRIKE") {
      world.hazardGrid = applyRadialShock(world.hazardGrid, cmd.row, cmd.col, 1.1);
    }
  }

  // 2. Diffuse hazard/supply PDE every 10 ticks (FLOP-governed)
  if (world.tick % 10 === 0) {
    world.hazardGrid = stepLaplacian(world.hazardGrid);
  }

  // 3. Advance projectiles & check 64-bit integer hitboxes
  world.projectiles = world.projectiles.map((p) => stepStormerVerletQ16(p, 0, toQ16(4.9)));
  for (const proj of world.projectiles) {
    for (const unit of world.units) {
      if (checkCircleHitQ16(proj, unit)) {
        unit.hp -= proj.damage;
        proj.expired = true;
      }
    }
  }
}
```

---

## 4. Common RTS Failure Traps & How This Kit Prevents Them

| Failure Trap | Why It Breaks RTS Games | Kit Guardrail |
| :--- | :--- | :--- |
| **Multiplayer Desync** | `Float64` math (`Math.sin`, `Math.sqrt`) differs across CPU/browser builds. | `Q16.16` integer math + `sha256Hex()` lockstep digest verification every 60 ticks. |
| **Late-Game Frame Collapse** | 300 units running $O(N^2)$ aura/visibility checks each tick. | Coarse `Laplacian` grid diffuses territory/hazard fields in `O(cells)` bounded FLOPs. |
| **UI State Leakage** | Selection boxes or camera culling altering simulation unit order. | Strict `Ledger 1` / `Ledger 2` boundary enforced in `AGENTS.md`. |

---

## 5. Minimum Playable P0 Checklist

- [ ] A `9×9` or `16×16` sector grid with two opposing base nodes (`Q16.16` coordinates).
- [ ] Click-to-select and click-to-move for 4–8 units using `stepStormerVerletQ16`.
- [ ] One area-of-effect ability (`applyRadialShock`) that visibly diffuses across sectors via `stepLaplacian`.
- [ ] A deterministic replay test (`node --test`) verifying that feeding the same command list twice produces the exact same `sha256Hex` state digest.
