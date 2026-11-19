# 🚀 Genre Blueprint 05: Space Simulation (Orbital Flight & Subsystem Thermal Grids)

**Target Shape:** Newtonian or semi-Newtonian space combat / exploration sim featuring gravity-well slingshots, directional shield harmonics, reactor heat dissipation, and deterministic flight-recorder telemetry.  
**Primary Math Toys:**
* `math-toys/04-symplectic-ballistics/symplectic-ballistics.js` (`60 Hz` kick-drift-kick Störmer–Verlet orbital integration & ballistic torpedoes)
* `math-toys/01-discrete-laplacian-grid/laplacian-grid.js` (`9×9` ship hull thermal dissipation & directional shield harmonic PDE lattice)
* `math-toys/00-core-q16/core.js` (`Q16.16` fixed-point arithmetic & `SHA-256` black-box telemetry receipts)

---

## 1. Why Symplectic Integrators & PDE Hull Grids Belong in Space Sims

Space simulations face two classic numerical breakdowns:
1. **Orbital Decay & Energy Drift:** Standard Euler integration (`x += v * dt; v += a * dt`) artificially adds energy to closed orbits over time, causing moons and satellites to spiral outward into deep space or crash into planets after a few minutes. **Störmer–Verlet integration (`stepStormerVerletQ16`)** is *symplectic*—it preserves phase-space area (Liouville's Theorem) so closed orbits remain stable across hours of flight.
2. **Flat Hit-Point Bars vs. Spatial Subsystem Stress:** Modeling a starship's hull or deflector shield as a **9×9 discrete Laplacian lattice (`Toy 01`)** turns shield management into genuine spatial physics: a laser hit on the port bow (`row 2, col 1`) injects a localized thermal/shield shock (`applyRadialShock`) that ripples across adjacent bulkheads and radiates away under strict `≤ 2,000 FLOP` governance.

---

## 2. Dual-Ledger Architecture (`Ledger 1` vs. `Ledger 2`)

```text
[Flight Controls: { thrustVecQ16, shieldShuntCoord, weaponFire }]
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 1: Symplectic Orbital & Hull PDE Kernel (60 Hz)   │
│ • Inverse-Square / Linear Gravity Kick-Drift-Kick (Toy 04)│
│ • 9×9 Starship Hull & Shield Thermal Lattice (Toy 01)    │
│ • Torpedo & Railgun 64-Bit Integer Hitboxes              │
│ • Black-Box Flight Recorder Digest (sha256Hex)           │
└─────────────────┬────────────────────────────────────────┘
                  │ Read-Only Ship & Lattice Snapshot
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 2: Cockpit HUD, Starfield & WebAudio Telemetry    │
│ • Parallax starfield, orbital trajectory prediction arc  │
│ • 9×9 MFD (Multi-Function Display) hull thermal heatmap  │
│ • Procedural WebAudio thruster rumble & hull alarm tones │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Wiring the Math Toys into a Space Sim P0 Slice

### A. Symplectic Gravity-Well Step (`Toy 04`)
Compute gravitational acceleration toward a planetary body in `Q16.16` and pass it into `stepStormerVerletQ16` so ships and probes maintain stable orbits without artificial drag:

```javascript
import { toQ16, fromQ16, qSub } from "../math-toys/00-core-q16/core.js";
import { stepStormerVerletQ16 } from "../math-toys/04-symplectic-ballistics/symplectic-ballistics.js";
import {
  createLaplacianGrid,
  applyRadialShock,
  stepLaplacian,
  computeDirichletEnergy,
} from "../math-toys/01-discrete-laplacian-grid/laplacian-grid.js";

export function stepShipOrbitQ16(ship, planet, thrustAxQ16 = 0, thrustAyQ16 = 0) {
  const dx = fromQ16(qSub(planet.xQ16, ship.xQ16));
  const dy = fromQ16(qSub(planet.yQ16, ship.yQ16));
  const distSq = Math.max(400, dx * dx + dy * dy);
  const dist = Math.sqrt(distSq);

  // Gravitational pull GM / r^2 projected onto unit vector
  const accelMag = planet.mu / distSq;
  const gxQ16 = toQ16((dx / dist) * accelMag) + (thrustAxQ16 | 0);
  const gyQ16 = toQ16((dy / dist) * accelMag) + (thrustAyQ16 | 0);

  return stepStormerVerletQ16(ship, gxQ16, gyQ16);
}

export function applyShieldImpact(hullGrid, sectorRow, sectorCol, weaponYield = 1.0) {
  let nextGrid = applyRadialShock(hullGrid, sectorRow, sectorCol, weaponYield);
  nextGrid = stepLaplacian(nextGrid);
  const structuralStress = computeDirichletEnergy(nextGrid);
  return { hullGrid: nextGrid, structuralStress };
}
```

### B. Cockpit Multi-Function Display (`Ledger 2`)
Render the `9×9` `hullGrid` directly on a cockpit MFD panel using `Ledger 2`:
* Firing overcharged railguns injects heat (`applyRadialShock`) at the weapon hardpoint cell (`row 1, col 4`).
* Diverting coolant or shield power calls `stepLaplacian` to diffuse thermal spikes into outer radiator fins before any single cell exceeds `2.0` (`hull breach`).

---

## 4. Common Space Sim Failure Traps & How This Kit Prevents Them

| Failure Trap | Why It Breaks Space Sims | Kit Guardrail |
| :--- | :--- | :--- |
| **Euler Orbital Spiral** | Non-symplectic integration causes satellites to gain energy and escape orbit. | Kick-drift-kick `stepStormerVerletQ16` preserves symplectic orbital energy bounds. |
| **Opaque Subsystem Damage** | Players can't tell *why* a reactor overheated from a single scalar HP bar. | `9×9` `Laplacian` grid visualizes exact heat propagation across ship sectors in `729 FLOPs`. |
| **Floating-Point Sector Jitter** | Distant coordinates (`> 10,000 px`) lose sub-pixel precision in `Float32`. | Signed 32-bit `Q16.16` coordinates + `BigInt` squared-distance collision checks. |

---

## 5. Minimum Playable P0 Checklist

- [ ] A central gravity well and player starship executing stable orbital slingshots via `stepShipOrbitQ16`.
- [ ] A `9×9` cockpit thermal/shield MFD lattice initialized with `createLaplacianGrid` (`baseline = 0.15`).
- [ ] Weapon firing and enemy impacts injecting localized thermal impulses via `applyRadialShock`.
- [ ] A deterministic `node --test` check confirming orbital energy stability over `1,000` ticks and `≤ 2,000 FLOP` hull diffusion compliance.
