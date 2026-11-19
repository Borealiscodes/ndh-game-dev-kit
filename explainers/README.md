# 🟧 Plain-Language Explainers (`explainers/`): Altitude A7 Clarity Layer

> **Design Principle:** If you cannot explain a mathematical invariant with a wooden ruler, a pond, or socks and shoes, you are hiding behind jargon.

Every file in this folder translates one zero-float kernel from `math-toys/` into an accessible, **Altitude A7** plain-language guide—written so game designers, artists, students, and non-mathematicians can understand *why* each invariant works, *how* it behaves in code, and *what* real-world domains use the exact same math.

---

## 📚 Index of Explainers

| # | Explainer Guide | Everyday Analogy | Companion Code (`math-toys/`) | Unlocked Game Genres |
| :- | :--- | :--- | :--- | :--- |
| **00** | [`00-q16-fixed-point-and-receipts.md`](00-q16-fixed-point-and-receipts.md) | **65,536-Tick Integer Ruler & Wax Seals** | `00-core-q16/core.js` | Every deterministic genre (`RTS`, `FPS`, `Arcade`, `Co-op`) |
| **01** | [`01-discrete-laplacian-ponds.md`](01-discrete-laplacian-ponds.md) | **Ripple Ponds & Compute Speed Limits** | `01-discrete-laplacian-grid/laplacian-grid.js` | `RTS` supply/hazards, `Space Sim` hull thermal grids |
| **02** | [`02-cellular-sheaves-and-loops.md`](02-cellular-sheaves-and-loops.md) | **Faction Webs & Labyrinth Path Memory** | `02-cellular-sheaf-holonomy/sheaf-holonomy.js` | `Fallout 3` Open-World RPG, `Disco Elysium`, `Zork` |
| **03** | [`03-lie-commutators-and-order.md`](03-lie-commutators-and-order.md) | **Socks Before Shoes (Order Matters)** | `03-lie-commutator-co-op/lie-commutator.js` | `Dungeon Siege 3` Co-op ARPG, multi-step puzzles |
| **04** | [`04-symplectic-ballistics.md`](04-symplectic-ballistics.md) | **Bouncing Orbits & No-Square-Root Hitboxes** | `04-symplectic-ballistics/symplectic-ballistics.js` | `Bullet-Hell Arcade`, `Action / FPS`, `Space Sim` |
| **05** | [`05-verlet-ribbons-and-lanes.md`](05-verlet-ribbons-and-lanes.md) | **Flowing Silk Scarves & Parallel Lanes** | `05-verlet-ribbon-resonance/verlet-ribbon.js` | `Journey`-style Traversal, `Art Canvas`, grappling ropes |
| **06** | [`06-meadow-brushes-and-palettes.md`](06-meadow-brushes-and-palettes.md) | **Kaleidoscope Geometry & Safe Radii** | `06-surrealist-brush-adapter/surrealist-brush-adapter.js` | `Interactive Art Canvas`, generative magic/rune tools |

---

## 🧭 How to Use These Guides

1. **Start With Intuition, Not Equations:** Read the explainer first to see the physical or everyday picture behind a toy before inspecting its `Q16.16` implementation.
2. **Mix & Match Across Domains:** Each explainer ends with a **Real-World Domain Table** (power grids, acoustics, robotics, molecular dynamics, supply chains) showing how the exact same `Ledger 1` math powers non-game simulations.
3. **Keep `Ledger 2` Descriptive:** All analogies and educational prose live strictly in documentation and `Ledger 2` presentation layers—never inside deterministic `Ledger 1` physics or verification gates.

---

## ✍️ Checklist for Contributing a New Explainer

* [ ] Opens with a concrete, everyday physical analogy (no unexpanded Greek symbols or category-theory jargon).
* [ ] Walks through the exact exported functions in its matching `math-toys/` module.
* [ ] Explains at least 3 concrete game mechanics unlocked by the math.
* [ ] Includes a 4-row table mapping the identical algorithm to real-world scientific or engineering domains.
