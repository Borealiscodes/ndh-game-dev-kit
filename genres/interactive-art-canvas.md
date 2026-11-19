# 🎨 Genre Blueprint 06: Interactive Art Canvas & Meditative Traversal (*Journey* / *Cosmic Ballet* Style)

**Target Shape:** Zero-combat, zero-timer meditative exploration canvas or audiovisual installation featuring flowing silk ribbons, harmonic chime waves, and non-merging chromatic companions.  
**Primary Math Toys:**
* `math-toys/05-verlet-ribbon-resonance/verlet-ribbon.js` (`14`-segment position-based Verlet silk chains & rest-length distance constraints)
* `math-toys/00-core-q16/core.js` (`Q16.16` fixed-point arithmetic & deterministic Mulberry32 PRNG)

---

## 1. Why Verlet Chains & Sealed Adjacency Make Calm Games Feel Effortless

In a meditative traversal game or interactive art canvas, there are no enemies or collision damage—so **the tactile quality of motion and sound carries the entire experience**. If a trailing scarf looks stiff or companion lights clump into a single tangled blob, the illusion of grace breaks immediately.

Combining **Position-Based Verlet Integration (`stepVerletRibbon`)** with **Sealed Adjacency** solves both problems mathematically:
* **Silky-Smooth Cloth & Ribbon Physics:** Each ribbon segment integrates damped inertia plus a gentle upward thermal breeze (`-0.22 px/tick`), then projects back onto its rest length (`6.0 px`). This creates fluid, organic trailing curves at `60 Hz` without unstable spring forces.
* **Sealed Adjacency (Interleaving Without Merging):** Companion nodes orbit dedicated harmonic canopy lanes whose spacing strictly exceeds their oscillation radius (`laneSpacing > 2 * orbitAmplitude`). Threads weave side-by-side in visual and acoustic harmony without ever collapsing into a degenerate point.

---

## 2. Dual-Ledger Architecture (`Ledger 1` vs. `Ledger 2`)

```text
[Touch / Cursor Glide & Chime Pulse: { targetPosQ16, chimeTrigger }]
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 1: Deterministic Glide & Ribbon Kernel (60 Hz)    │
│ • Viscous Wind-Glide Inertia (gamma = 0.955 in Q16.16)   │
│ • 14-Segment Verlet Silk Scarf Chain (Toy 05)            │
│ • Chime Wavefront Expansion & Sealed-Adjacency Orbits    │
└─────────────────┬────────────────────────────────────────┘
                  │ Read-Only Ribbon, Resonance & Alignment State
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 2: Twilight Sky Gradient, Curves & WebAudio Bells │
│ • Sky gradient shift driven by alignment ratio (0 -> 1)  │
│ • Quadratic Bézier arcs connecting aligned canopy nodes  │
│ • Mute-by-default WebAudio wind drone & pentatonic bells │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Wiring the Math Toy into an Interactive Art Canvas P0 Slice

### A. Gliding Traveler & Expanding Harmonic Chime (`Toy 05`)
Couple damped cursor/touch steering in `Ledger 1` with `stepVerletRibbon` and a circular chime wave that awakens nearby companion nodes:

```javascript
import { toQ16, fromQ16, qAdd, qSub, qMul } from "../math-toys/00-core-q16/core.js";
import { createVerletRibbon, stepVerletRibbon } from "../math-toys/05-verlet-ribbon-resonance/verlet-ribbon.js";

export function initArtCanvasState() {
  return {
    tick: 0,
    xQ16: toQ16(320),
    yQ16: toQ16(340),
    vxQ16: 0,
    vyQ16: 0,
    chimeRadiusQ16: 0,
    ribbon: createVerletRibbon(320, 340, 14, 6.0),
  };
}

export function stepArtCanvas(state, accelXQ16, accelYQ16) {
  const dampQ16 = toQ16(0.955);
  const dtQ16 = toQ16(1.0 / 60.0);

  const vxQ16 = qMul(qAdd(state.vxQ16, qMul(accelXQ16, dtQ16)), dampQ16);
  const vyQ16 = qMul(qAdd(state.vyQ16, qMul(accelYQ16, dtQ16)), dampQ16);
  const xQ16 = qAdd(state.xQ16, qMul(vxQ16, dtQ16));
  const yQ16 = qAdd(state.yQ16, qMul(vyQ16, dtQ16));

  const chimeRadiusQ16 =
    state.chimeRadiusQ16 > 0 && state.chimeRadiusQ16 < toQ16(150)
      ? qAdd(state.chimeRadiusQ16, toQ16(4.5))
      : 0;

  return {
    ...state,
    tick: state.tick + 1,
    xQ16,
    yQ16,
    vxQ16,
    vyQ16,
    chimeRadiusQ16,
    ribbon: stepVerletRibbon(state.ribbon, xQ16, yQ16, 6.0, 0.86),
  };
}
```

### B. Procedural WebAudio Pentatonic Soundscape (`Ledger 2`)
Keep all `AudioContext` synthesis strictly inside `Ledger 2`, mute-by-default until the user taps the canvas or audio button:
* **Ambient Drone Pad:** Sustain a low-pass filtered `C3–G3–D4` (`130.81 / 196.00 / 293.66 Hz`) sine pad with slow 4-second attack/release envelopes.
* **Harmonic Bell Chimes:** Map each chromatic companion node to a rising **C-major pentatonic pitch** (`261.63 Hz` up to `783.99 Hz`) with a subtle `2x` octave triangle overtone so every interaction sounds musical regardless of timing.

---

## 4. Common Art Canvas & Meditative Game Failure Traps

| Failure Trap | Why It Breaks Meditative Games | Kit Guardrail |
| :--- | :--- | :--- |
| **Spring Explosion on Fast Drag** | Hooke's law springs overshoot and jitter when a user swipes quickly across a touchscreen. | Position-based `stepVerletRibbon` clamps segment spacing directly without unstable spring stiffness. |
| **Companion Clumping** | Magnetic attraction pulls all floating lights onto the exact same pixel. | **Sealed Adjacency:** Enforce `laneSpacing > 2 * orbitAmplitude` in upper canopy coordinates. |
| **Autoplay Audio Errors** | Browsers block `AudioContext` before user gesture or overwhelm quiet scenes. | Mute-by-default toggle in `Ledger 2` + soft exponential gain envelopes (`peak <= 0.05`). |

---

## 5. Minimum Playable P0 Checklist

- [ ] A full-bleed responsive canvas with touch-and-drag / cursor wind-glide steering (`damp = 0.955`).
- [ ] A `14`-segment Verlet silk trail rendered with tapering width and opacity in `Ledger 2`.
- [ ] At least 5–9 chromatic companion nodes that awaken via an expanding chime ring and align into non-merging canopy lanes.
- [ ] A deterministic `node --test` check confirming `stepVerletRibbon` preserves segment rest-length bounds under rapid head displacement.
