# 🟧 Explainer 02: Faction Webs, Rumor Spread & Path Memory (Cellular Sheaves)

**Altitude:** `A7` (Plain-Language Clarity Layer • Zero Unexpanded Jargon)  
**Companion Code:** `math-toys/02-cellular-sheaf-holonomy/sheaf-holonomy.js`  

---

## 💡 The Big Idea: Replacing "Flag Spaghetti" With a Living Web

Imagine building a giant RPG with four towns: **Megaton**, **Rivet City**, **The Citadel**, and **Tenpenny Tower**. In traditional games, programmers track your choices using hundreds of true/false checkboxes (`megaton_saved = true`, `tenpenny_angry = false`, `guard_warned = true`).

By the time you have 30 quests, those checkboxes tangle into **boolean flag rot**—where two quests contradict each other, an NPC greets you like a hero and attacks you in the same sentence, or a door stays locked forever.

A **Cellular Sheaf** replaces messy checkboxes with a clean **map of connected buckets**:
* Each town (or room) is a **node** holding a neat bundle of numbers (**a Stalk**)—like `[Reputation, Safety, Wealth, Unrest]`.
* Roads, alliances, and rivalries between towns are **edges** that check whether neighboring towns agree or clash!

---

## 🕸️ How `sheaf-holonomy.js` Works Step by Step

### 1. Local Buckets & Roads (`createSheafGraph` & `addRestrictionEdge`)
Every location starts with its own `Q16.16` state vector (**Stalk**). When you connect two towns with an edge, you give that road a **weight**:
* **Positive weight (`+0.85`):** Allies or trade partners (if Megaton prospers, Rivet City expects to prosper too).
* **Negative weight (`-0.90`):** Bitter rivals (if Megaton thrives, Tenpenny Tower grows resentful).

### 2. Measuring Political Friction (`computeCoboundaryEnergyQ16`)
When you complete a quest in Megaton and boost its `[Reputation, Safety]`, Megaton's numbers suddenly don't match what Tenpenny Tower or Rivet City expect. 

`computeCoboundaryEnergyQ16` adds up all the disagreements across every road on the map into a single **Tension Score**:
* **Energy = `0`:** Total regional harmony—every town's local mood matches its neighbors.
* **High Energy:** Political friction—rumors are flying, caravans are nervous, and border guards are on high alert!

### 3. Spreading Rumors & Trade (`sheafifyStep`)
Instead of writing 50 custom scripts to update neighboring towns after a quest, calling `sheafifyStep()` gently nudges connected towns toward agreement along their edges—just like news and trade naturally rippling down a highway.

### 4. Remembering *How* You Got There (`traverseNodeAction` & Holonomy)
Suppose you walk a closed loop on the map: `Town A → Town B → Town C → Town A`. Even though you ended up back where you started, your journey changed the world!

`traverseNodeAction` tracks **Path-Ordered Holonomy (`holonomyAccumQ16`)** by flipping the sign (`+` or `-`) of each step based on path parity. That means **walking `A → B → A` leaves a different mathematical fingerprint than walking `B → A → B`**—giving your game topological memory of player betrayal, double-dealing, or maze orientation without storing gigantic history logs.

---

## 🎮 Why This Matters for Games

* **Fallout 3 / New Vegas Faction Politics:** Actions in one settlement automatically ripple into regional tension and companion commentary without brittle `if/else` quest scripts.
* **Disco Elysium Inner Polyphony:** Connect 24 psychological skills as nodes on a sheaf graph so boosting *Logic* or *Inland Empire* creates measurable internal coboundary tension across your psyche.
* **Zork-Style Non-Euclidean Mazes:** Detect whether a player walked clockwise or counter-clockwise around a twisty dungeon loop using `holonomyAccumQ16` to unlock secret passages.

---

## 🌍 Other Real-World Domains That Use Cellular Sheaves

| Real-World Domain | What Nodes & Stalks Represent | What Coboundary Tension Models |
| :--- | :--- | :--- |
| **🤖 Drone Swarms & Sensor Networks** | Individual robots estimating their position and wind speed. | Disagreements between neighboring sensors that `sheafifyStep` reconciles into group consensus. |
| **📦 Global Supply Chains** | Warehouses, ports, and factories tracking inventory levels. | Bottlenecks and shortages propagating across connected shipping routes. |
| **⚖️ Legal & Policy Auditing** | Overlapping local, national, and international regulations. | Contradictions between rules that apply to the same jurisdiction. |
| **🧠 Social Network Opinion Dynamics** | People holding beliefs connected by friendship or rivalry edges. | Echo chambers, polarization, and consensus formation over time. |
