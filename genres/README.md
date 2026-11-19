# 🎨 Genre Blueprints (`genres/`): Painting With Mathematical Components

> **Important Note on Scope:** The blueprints in this directory are **not an exhaustive list of rigid genre boxes**. Think of them as **reusable mathematical instruments and architectural patterns** meant to be mixed, layered, and recombined across different embedding spaces.

---

## 1. Why Layered Games Are Built by Mixing Math Toys

Most memorable games do not belong to a single mathematical silo. When you treat game design like **painting with deterministic mathematical components**, complex multi-system worlds emerge naturally by layering distinct toys inside `Ledger 1` while keeping `Ledger 2` purely expressive:

| Reference Game | Layered Gameplay Systems | Mathematical Component Mix (`math-toys/`) |
| :--- | :--- | :--- |
| ***The Legend of Zelda: Twilight Princess*** | Dual-world realm transitions (Light vs. Twilight), dungeon puzzle state chains, wolf-sense aura fields, and responsive sword/claw combat. | **Cellular Sheaf & Holonomy (`Toy 02`)** for dungeon lock/realm state & non-commuting item sequences + **Discrete Laplacian (`Toy 01`)** for Twilight shadow/lantern aura diffusion + **60 Hz Symplectic Hitboxes (`Toy 04`)** for combat. |
| ***Disco Elysium*** | 24-skill internal polyphony, thought-cabinet political/psychological alignment, non-linear dialogue loops, and zero traditional combat. | **Cellular Sheaf Stalks & Loop Holonomy (`Toy 02`)** for multi-skill psyche state & ideological coboundary tension + **Non-Commuting Lie Brackets (`Toy 03`)** for order-dependent dialogue unlocks + **Strict `Ledger 2` Isolation** so prose never corrupts state. |
| ***Portal*** | Non-Euclidean spatial shortcuts, momentum-conserving portal transitions, laser/thermal redirection grids, and chained test-chamber switches. | **60 Hz Störmer–Verlet Kinematics (`Toy 04`)** for symplectic momentum conservation across portal boundaries + **Topological Graph Edges (`Toy 02`)** for non-Euclidean room adjacency + **Lie Commutators (`Toy 03`)** for multi-switch puzzle order. |
| ***BioShock Infinite*** | Multi-timeline Tear state shifts, Sky-Line rail spline traversal, Vigor elemental combos, and high-speed gunplay. | **Sheaf Restriction Maps & Holonomy (`Toy 02`)** for Tear timeline divergence without flag rot + **Position-Based Verlet Chains (`Toy 05`)** for Sky-Line rail kinematics + **60 Hz Symplectic Ballistics (`Toy 04`)** for Vigors and weapons. |
| ***Half-Life 2*** | Gravity-gun rigid-body physics, squad/strider pacing, hazardous radiation/fire spread, and seamless environmental storytelling. | **60 Hz Störmer–Verlet Physics & 64-Bit Hitboxes (`Toy 04`)** for prop trajectories + **FLOP-Bounded Discrete Laplacian (`Toy 01`)** for radiation, fire, and pheromone/scent diffusion + **`SHA-256` Deterministic State (`Toy 00`)**. |

---

## 2. Testing Layered Complexity on a 50D Neutral Manifold Substrate

When a game blends five or six interacting systems at once (such as spatial physics, faction politics, psychological skills, elemental diffusion, and timeline shifts), testing how those forces interact in flat 2D/3D space alone can hide coupling bugs or representation crowding.

**[`Borealiscodes/FiftyD-Neutral-Manifold`](https://github.com/Borealiscodes/FiftyD-Neutral-Manifold)** provides an ideal, system-agnostic **50-dimensional geometric testing substrate** for prototyping layered game designs before locking down runtime code:

* **Pure Neutral Coordinate Space:** Contains zero hardcoded physics, branding, or domain assumptions—letting you embed up to 50 orthogonal game channels (e.g., spatial coordinates, momentum, faction standings, skill weights, elemental tension, and narrative loop parity) into one clean mathematical manifold.
* **Scalar Gradients & Stability Surfaces:** Lets designers test whether coupled game mechanics remain bounded on stable regions (`stability_surfaces.py`) or blow up into degenerate exploits before writing engine code.
* **Clean Projection Down to `Ledger 1` (`Q16.16`):** Once your high-dimensional design invariants are verified on the 50D neutral substrate, project the active state slices down into the zero-float `Q16.16` runtime toys in `math-toys/` (`Ledger 1`) and map visual/audio feedback to `Ledger 2`.

---

## 3. Current Index of Starter Blueprints

Use these eight starter recipes as building blocks—combine two or three whenever your game crosses genre boundaries:

1. [`rts.md`](rts.md) — **Real-Time Strategy:** Discrete Laplacian supply/hazard wavefronts (`Toy 01`) + lockstep `SHA-256` receipts (`Toy 00`).
2. [`open-world-rpg-fallout3.md`](open-world-rpg-fallout3.md) — **Open-World RPG (*Fallout 3* Style):** Cellular sheaf faction stalks & loop holonomy (`Toy 02`).
3. [`coop-action-rpg-ds3.md`](coop-action-rpg-ds3.md) — **Co-op Action-RPG (*Dungeon Siege 3* Style):** CSR Lie commutator conflict resolution (`Toy 03`) + symplectic combat (`Toy 04`).
4. [`action-fps.md`](action-fps.md) — **Action & FPS:** `60 Hz` Störmer–Verlet ballistics & 64-bit integer hitboxes (`Toy 04`).
5. [`space-sim.md`](space-sim.md) — **Space Simulation:** Symplectic orbital trajectories (`Toy 04`) + `9×9` PDE shield/thermal hull grids (`Toy 01`).
6. [`interactive-art-canvas.md`](interactive-art-canvas.md) & [`interactive-art-canvas-surrealist-addendum.md`](interactive-art-canvas-surrealist-addendum.md) — **Interactive Art Canvas & Algorithmic Surrealism:** Verlet silk chains (`Toy 05`), Meadow brushes & Hodgkins phase zoning (`Toy 06`), and `Ledger 2` WebAudio synthesis.
7. [`text-adventure-zork.md`](text-adventure-zork.md) — **Text Adventure (*Zork* Style):** Topological room graphs (`Toy 02`), non-commuting puzzles (`Toy 03`), and sandboxed `Ledger 2` prose/LLM narration.
8. [`bullet-hell-arcade.md`](bullet-hell-arcade.md) — **Bullet-Hell Arcade (*Mitakihara Labyrinth* Style):** Precomputed `Q16.16` trig ring tables, Mulberry32 waves (`Toy 00`), and concentric core/graze hitboxes (`Toy 04`).

---

## 4. How to Invent Your Own Hybrid Genre Recipe

1. **Pick 2–3 Core State Slices:** Decide what actually needs mathematical truth (`Ledger 1`)—for example, *movement + faction trust + thermal diffusion*.
2. **Prototype Coupling on `FiftyD-Neutral-Manifold` (Optional):** Test scalar gradients and stability bounds across all channels together.
3. **Wire the Matching `math-toys/`:** Combine the corresponding `Q16.16` modules (`01` through `06`) under a single `60 Hz` fixed-timestep loop.
4. **Paint `Ledger 2` on Top:** Attach your 2D/3D renderer, shaders, WebAudio synthesizer, or dialogue system strictly as a read-only observer.
