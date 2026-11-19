# 🟧 Explainer 01: Ripple Ponds, Heat Diffusion & FLOP Speed Limits

**Altitude:** `A7` (Plain-Language Clarity Layer • Zero Unexpanded Jargon)  
**Companion Code:** `math-toys/01-discrete-laplacian-grid/laplacian-grid.js`  

---

## 💡 The Big Idea: How Neighboring Squares Share Energy

Imagine a `9×9` tray of 81 ice-cube compartments filled with water. Normally, the water sits perfectly flat at `0.15` inches deep.

Now drop a marble straight into the center square (`row 4, col 4`). That square splashes up to `1.00`, and its four immediate neighbors (North, South, East, West) splash up to `0.53`. How does the water settle back down?

Every single square simply compares itself to its **4 neighbors** and shares the difference. In mathematics, comparing a point to the average of its neighbors is called the **Discrete Laplacian**—and it is the secret engine behind ripples, heat flow, smoke, and fog-of-war in games!

---

## 🌊 How `laplacian-grid.js` Works Step by Step

### 1. The 5-Point Splash (`applyRadialShock`)
When an explosion, magic spell, or supply beacon hits `(row, col)`, it doesn't just spike one pixel—it stamps a gentle cross-shaped splash onto the center cell (`100%` strength) and its 4 cardinal neighbors (`45%` strength). That prevents jagged single-pixel artifacts and creates smooth circular waves.

### 2. Neighbor Sharing (`stepLaplacian`)
On each tick, every cell looks North, South, East, and West:
* **If a cell is higher than its neighbors:** It gives away a small fraction (`alpha = 0.18`) of that extra height to its neighbors.
* **If a cell is lower than its neighbors:** It receives height from its neighbors.
* **Bouncing Off the Walls (Neumann Boundaries):** What happens at the edge of the `9×9` grid where there is no neighbor outside? The edge cell simply pretends its missing neighbor has the *exact same height as itself*. That creates a **zero-flux (Neumann) wall**—so ripples bounce cleanly back into the pond instead of leaking off the board!

### 3. Watching the Pond Calm Down (`computeDirichletEnergy`)
**Dirichlet Gradient Energy** sounds fancy, but it is just a single number measuring **how bumpy the water is**:
* When the grid is completely flat, every neighbor difference is zero, so Dirichlet Energy = **`0.0000`**.
* Right after a shock hits, the water is steep and jagged, so Dirichlet Energy spikes upward.
* Every relaxation tick smooths out the bumps, guaranteeing that Dirichlet Energy goes **down** smoothly until the pond returns to calm equilibrium.

### 4. The Compute Speed Limit (`729 / 2,000 FLOPs`)
A **FLOP** is one basic math operation (an addition, subtraction, or multiplication). Because mobile phones and edge sensors have strict battery limits, `laplacian-grid.js` counts every operation:
* Updating 1 cell takes **9 math operations**.
* Updating all 81 cells in a `9×9` grid takes `9 × 81 =` **`729 FLOPs`**—comfortably under a **`2,000 FLOP`** speed limit!

---

## 🎮 Why This Matters for Games

* **RTS Fog-of-War & Hazard Spread:** Instead of running slow distance checks on 500 units, diffuse fire, poison gas, radiation, or supply lines across a coarse grid in a fixed, tiny number of operations.
* **Space Sim Shield & Hull Heat:** Turn a starship's shield or reactor into a `9×9` grid where laser hits create localized hotspots that players can vent or cool down spatially.
* **Puzzle Wave Interference:** Drop two shocks at opposite corners and watch their ripples collide and add together (`constructive interference`) to trigger switches in the center.

---

## 🌍 Other Real-World Domains That Use This Exact Math

| Real-World Domain | What Each Cell Represents | What a "Shock" Models |
| :--- | :--- | :--- |
| **⚡ Power Grids & Microgrids** | Voltage or load stress across neighborhood substations. | A sudden power surge or downed line rippling through the network. |
| **🔥 Microchip & Spacecraft Cooling** | Temperature across a silicon processor or heat shield. | A sudden burst of CPU heat spreading outward into cooling fins. |
| **🧠 Brain & Heart Tissue Modeling** | Electrical membrane voltage across a patch of cells. | A localized electrical pulse propagating across tissue. |
| **🌫️ Weather & Air Quality** | Smoke, perfume, or pollutant concentration in a room. | Opening a window or lighting a candle and watching scents diffuse. |
