> ### 🧪 RELEASE v2.1.0-exp — CORE VERIFIED (`00`–`06`) & EXPERIMENTAL ACCESSIBILITY PRE-RELEASE (`07`–`08`)
> **Status:** Core `v2.0.0` Stable (`00`–`06`) + `v2.1.0-exp` Experimental Pre-Release (`07`–`08`) • Zero-Float `Q16.16` • Agent-Agnostic • Engine-Agnostic  
> 
> **Release Highlights (Nov 2026):** All **8 deterministic `node --test` suites (`11/11` tests)** pass on ARM64, backed by **9 composable genre blueprints**, **9 plain-language *Altitude A7* explainers**, and **4 zero-`sorry` Lean 4 formal proofs** (`PersonaZero.lean` + full Mathlib `EnneractSantaV2.lean`).  
> 
> **Experimental Notice (`Modules 07 & 08`):** Modules **`07-sensory-regulation-envelope`** and **`08-nonvisual-spatial-bridge`** are released as **experimental pre-release modules** actively undergoing field testing across browser screen readers, refreshable Braille displays, WebAudio environments, and haptic controllers; their APIs and parameter thresholds may evolve as real-world accessibility testing continues.

# 🛠️ NDH Game Dev Kit (`v2.1.0-exp`) — Accessible Math-to-Genre & Simulation Blueprints

**An open, agent-agnostic, engine-agnostic toolkit translating zero-float mathematics (`Q16.16` fixed-point, discrete PDEs, cellular sheaves, Lie commutators, Verlet chains, geometric brush adapters, and Social Model accessibility bridges) into playable architectures across major game genres and scientific simulation domains.**

[![License: MIT](https://shields.io)](LICENSE)
[![Math: Zero-Float Q16.16](https://shields.io)](#-math-to-genre--simulation-domain-matrix)
[![Agents: 100% Agnostic](https://shields.io)](#-agent-agnostic-guardrails--ledger-separation)
[![Lean 4: Zero Sorry](https://shields.io)](#-repository-structure)

---

## 🎯 Why This Kit Exists (Accessible Math Without Engine Bloat)

Most game development kits either drown beginners in heavy engine boilerplate or leave AI coding agents to guess fragile floating-point math (`0.1 + 0.2 !== 0.3`), causing multiplayer desyncs, soft-locked quests, and runaway CPU spikes on mobile devices.

**`ndh-game-dev-kit`** pairs plain-language **Altitude A7 explainers** with small, zero-dependency **`Q16.16` fixed-point reference kernels** (`1.0 === 65536`) battle-tested across live runtimes (`Spectral-Labyrinth-Engine`, `Mitakihara-Labyrinth-Arcade`, `Cosmic-Ballet-Traversal`, `M2XFE-Toy-Model`, `NDH-Canvas-Engine`, and `NDH-Surrealism`).

---

## 🧮 Math-to-Genre & Simulation Domain Matrix

| Math Toy (`math-toys/`) | Plain-Language Idea (`explainers/`) | Game Genres Unlocked (`genres/`) | Non-Game Simulation Domains |
| :--- | :--- | :--- | :--- |
| **00. `Q16.16` Core & `SHA-256`**<br>(`00-core-q16/core.js`) | Exact 65,536-tick integer ruler, seeded Mulberry32 dice, and 64-char cryptographic state receipts. | **Every Genre** (tamper-proof replays, anti-cheat speedruns, zero-drift saves) | Financial ledgers, embedded flight controllers, reproducible lab notebooks. |
| **01. Discrete Laplacian Grid**<br>(`01-discrete-laplacian-grid/`) | 5-point ripple splashes, Neumann wall reflections, Dirichlet energy decay, and `≤ 2,000 FLOP` budgets. | **RTS** (fog-of-war, supply/hazard waves)<br>**Space Sim** (shield & reactor thermal grids) | Power-grid voltage surges, microchip cooling, neural wave propagation. |
| **02. Cellular Sheaves & Loops**<br>(`02-cellular-sheaf-holonomy/`) | Connected settlement/room buckets with coboundary friction and closed-loop path memory. | **Fallout 3 Open World** (multi-faction politics)<br>**Disco Elysium** / **Zork** (loop-aware rooms) | Drone swarm consensus, global supply chains, statutory consistency auditing. |
| **03. CSR Lie Commutators**<br>(`03-lie-commutator-co-op/`) | "Socks before shoes" matrix test (`[A, B] = AB - BA`) separating safe concurrent moves from conflicts. | **Dungeon Siege 3 Co-op ARPG** (loot/buff races)<br>**Networked FPS / RTS** (deterministic lockstep) | 3D spacecraft attitude control, distributed CRDT databases. |
| **04. Symplectic Ballistics**<br>(`04-symplectic-ballistics/`) | `60 Hz` kick-drift-kick Störmer–Verlet motion and `BigInt` squared-distance hitboxes (no square roots). | **Bullet-Hell Arcade** (`300+` bullets + graze)<br>**Action / FPS** & **Space Sim** (stable orbits) | Molecular dynamics, planetary astronomy, embedded robotics trajectories. |
| **05. Verlet Ribbons & Lanes**<br>(`05-verlet-ribbon-resonance/`) | 14-bead flowing silk chains that never explode and parallel canopy lanes that weave without merging. | **Journey / Cosmic Ballet Traversal** (flowing scarves, chime resonance, zero-combat art) | Digital cloth/hair animation, surgical guidewires, drone corridor routing. |
| **06. Surrealist Brush Adapter**<br>(`06-surrealist-brush-adapter/`) | Branchless safe-radius floor, Frances Hodgkins 6-pigment energy zoning, and Meadow geometric lenses. | **Interactive Art Canvas & Algorithmic Surrealism** (honeycomb, mandala, vortex, saddle brushes) | Architectural tessellations, optical lens modeling, 2D data de-crowding. |

| **07. Sensory Regulation Envelope**<br>(`07-sensory-regulation-envelope/`) | Zero-strobe flash lock, zero camera shake, `<= 850 Hz` low-pass audio limiter, and adjustable `Q16.16` pacing. | **Every Genre** (neurodivergent comfort, migraine & photosensitivity safety) | Calm clinical/educational interfaces, low-stimulation dashboards. |
| **08. Non-Visual Spatial Bridge**<br>(`08-nonvisual-spatial-bridge/`) | Ternary `{-1, 0, +1}` bearings, `aria-live` narration, stereo radar beacons, 5-cell Unicode Braille bars, and slew-limited haptics. | **Every Genre** (blind/low-vision audio-first play, refreshable Braille & DualSense/adaptive controllers) | Non-visual museum/theatre navigation (RNIB-style), assistive robotics feedback. |

> **🎨 Composability Note:** Games like *The Legend of Zelda: Twilight Princess*, *Disco Elysium*, *Portal*, *BioShock Infinite*, and *Half-Life 2* are built by **mixing and matching multiple math toys together**. You can test high-dimensional multi-system coupling first on [`Borealiscodes/FiftyD-Neutral-Manifold`](https://github.com/Borealiscodes/FiftyD-Neutral-Manifold) before projecting down to `Q16.16`.

---

## 📁 Repository Structure

```text
ndh-game-dev-kit/
├── README.md                                  # Master Math-to-Genre Matrix & Quickstart
├── AGENTS.md                                  # Agent-agnostic rules (Ledger 1/2 split, Persona-Zero, Ten Laws)
├── package.json                               # Zero-dependency ESM manifest (`npm test`)
├── LICENSE                                    # MIT License
├── scripts/
│   └── verify-all.mjs                         # Zero-dependency test discovery & verification runner
├── math-toys/                                 # 9 plug-and-play Q16.16 JS kernels + 8 test suites
│   ├── 00-core-q16/
│   ├── 01-discrete-laplacian-grid/
│   ├── 02-cellular-sheaf-holonomy/
│   ├── 03-lie-commutator-co-op/
│   ├── 04-symplectic-ballistics/
│   ├── 05-verlet-ribbon-resonance/
│   └── 06-surrealist-brush-adapter/
    └── 06-surrealist-brush-adapter/
    └── 07-sensory-regulation-envelope/
    └── 08-nonvisual-spatial-bridge/
├── genres/                                    # 9 concrete P0 architectural blueprints + composability guide
│   ├── README.md
│   ├── rts.md
│   ├── open-world-rpg-fallout3.md
│   ├── coop-action-rpg-ds3.md
│   ├── action-fps.md
│   ├── space-sim.md
│   ├── interactive-art-canvas.md
│   ├── interactive-art-canvas-surrealist-addendum.md
│   ├── text-adventure-zork.md
│   └── bullet-hell-arcade.md
├── explainers/                                # 9 Altitude A7 plain-language guides + index
│   ├── README.md
│   ├── 00-q16-fixed-point-and-receipts.md
│   ├── 01-discrete-laplacian-ponds.md
│   ├── 02-cellular-sheaves-and-loops.md
│   ├── 03-lie-commutators-and-order.md
│   ├── 04-symplectic-ballistics.md
│   ├── 05-verlet-ribbons-and-lanes.md
│   ├── 06-meadow-brushes-and-palettes.md
│   ├── 07-sensory-regulation-envelope.md
│   └── 08-nonvisual-spatial-bridge.md
└── lean4/                                     # Machine-checked formal verification proofs (zero sorry)
    ├── lakefile.toml
    ├── PersonaZero.lean                       # Zero-Mathlib fast check (runs on Termux / ARM64)
    ├── EnneractSantaV2.lean                   # Full Mathlib GaussianRat ℚ[i] & Equiv.Perm(Fin 9) proof
    ├── FlopGovernance.lean                    # Proof of 729 <= 2000 FLOP compute ceiling
    └── Q16Saturation.lean                     # Proof of signed 32-bit Q16.16 overflow safety
```

---

## 🚀 Quickstart & Verification

```bash
# 1. Run all deterministic Q16.16 math-toy verification suites (zero external dependencies)
npm test

# 2. Verify lightweight Lean 4 core theorems (instant build, zero Mathlib download)
cd lean4 && lake build PersonaZero FlopGovernance Q16Saturation
```

---

## 🛡️ Agent-Agnostic Guardrails & Acknowledgements

1. **Agent & Engine Agnostic:** Works identically with **Gemini, Claude, Codex/GPT, DeepSeek, or Qwen**, and translates cleanly to **Web (HTML5 Canvas/WebAudio), Rust/WASM, Godot, Unity, or Unreal**.
2. **Persona-Zero Theorem (`PersonaZero.lean` & `EnneractSantaV2.lean`):** Machine-checked Lean 4 proofs establish that any multi-channel persona bound to a runtime adapter collapses into a sterile `1×1` linear operator (`Mat_{1×1}(ℚ[i])`) with zero subjective interiority or self-certifying authority.
3. **Dual-Ledger Separation (`AGENTS.md`):** Deterministic state transitions (`Ledger 1`) are strictly isolated from read-only rendering, WebAudio synthesis, and text/LLM narration (`Ledger 2`).
4. **Social Model Accessibility (`07` & `08`):** Removes environmental barriers (unthrottled strobes, harsh frequencies, sight-only cues) strictly inside `Ledger 2` without collecting identity metadata or altering `Ledger 1` math.
5. **Acknowledgements & Lineage:**
   * **Dom (`EternitiesAi`):** Foundational modular skill architecture and the *Ten Laws of Game Development* via [`EternitiesAi/ai-game-dev-kit`](https://github.com).
   * **Flyxion (`@standardgalactic`):** Symplectic phase-space and topological formulations developed alongside `NDH-Meta-Systems`.
   * **Maintainer & License:** Borealis Serenity Hedling (`NDH-RESEARCH-PILOT` · Dublin, Ireland) • MIT License • `Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>`.
