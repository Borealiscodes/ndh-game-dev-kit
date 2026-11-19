# 🟧 Explainer 00: Q16.16 Fixed-Point Math, Seeded Dice & SHA-256 Receipts

**Altitude:** `A7` (Plain-Language Clarity Layer • Zero Unexpanded Jargon)  
**Companion Code:** `math-toys/00-core-q16/core.js`  

---

## 💡 The Big Idea: Why Normal Computer Decimals Drift

Imagine measuring a wooden board with two different tape measures—one stretched slightly in the summer heat and one shrunk in the winter cold. Even if two carpenters follow the exact same blueprint, their cuts won't quite match.

Regular computer decimals (**floating-point numbers**, or `floats`) have that exact problem. In standard JavaScript or C++, `0.1 + 0.2` actually equals `0.30000000000000004`! Over thousands of frames in a game, tiny rounding differences between a phone's ARM chip and a desktop's Intel/AMD chip pile up until a bullet hits on one screen and misses on another.

**`Q16.16` Fixed-Point Math** fixes this forever by throwing away stretchy decimals and using an **exact integer ruler**.

---

## 📏 How `core.js` Works Under the Hood

### 1. The 65,536-Tick Ruler (`toQ16` & `fromQ16`)
Instead of storing `1.0` as a decimal, `Q16.16` chops every whole unit (`1.0`) into **`65,536` microscopic integer ticks** ($2^{16}$):
* `1.0` becomes the exact integer **`65536`**
* `0.5` becomes the exact integer **`32768`**
* `0.25` becomes the exact integer **`16384`**

Because every computer on Earth adds and subtracts whole integers the exact same way, `32768 + 16384` is **always** `49152` (`0.75`)—whether it runs on a 2015 Android tablet, a browser tab, or a supercomputer.

### 2. Safe 64-Bit Multiplication (`qMul`)
When you multiply two `Q16.16` numbers together (`65536 × 65536`), the temporary answer gets huge (`4,294,967,296`)—too big for a standard 32-bit box! `qMul` temporarily pours the numbers into a giant **64-bit bucket (`BigInt`)**, shifts back down by `16` bits (`>> 16n`), and clamps the result safely so your game never crashes from number overflow.

### 3. Reproducible Dice (`createSeededRng` — Mulberry32)
Standard `Math.random()` pulls unpredictable noise from your device, making it impossible to replay a game bug or verify a high score. `createSeededRng(seed)` is a **deterministic number blender**: give it the same starting seed number (`0x20260831`), and it deals the exact same sequence of "random" numbers every single time.

### 4. The Digital Wax Seal (`sha256Hex`)
At the end of a level or simulation, `sha256Hex()` reads the entire game state and crushes it into a **64-character fingerprint** (like `a3f9...81c2`). Change even **one single tick** out of `65,536` in one enemy's position, and the entire fingerprint changes completely—giving you tamper-proof replays and save receipts with zero external libraries.

---

## 🎮 Why This Matters for Games

* **Zero Multiplayer Desync:** Two players in an RTS or Co-op ARPG only need to send button presses over the network; `Q16.16` guarantees both devices simulate the exact same world.
* **Bit-Exact Replays & Speedruns:** Record the starting seed + player inputs, and anyone can replay the entire run and check the final `SHA-256` seal.
* **Battery-Friendly Mobile Speed:** Integer math runs fast and cool on mobile processors without heavy floating-point overhead.

---

## 🌍 Other Real-World Domains That Use Fixed-Point & Hash Seals

| Real-World Domain | How It Uses This Exact Math |
| :--- | :--- |
| **🏦 Banking & Ledgers** | Banks never store money as `floats` (`$0.10 + $0.20`); they store exact integer cents (`10 + 20 = 30`) so pennies never vanish. |
| **🛰️ Spacecraft & Robotics** | Flight computers and motor controllers use `Q16.16` / `Q32.32` fixed-point math for guaranteed real-time timing without hardware float exceptions. |
| **🎛️ Digital Audio & Synthesizers** | Guitar pedals and studio DSP chips use fixed-point integers to mix sound waves cleanly without distortion or clipping. |
| **🔬 Scientific Lab Notebooks** | Researchers hash raw data arrays with `SHA-256` to prove an experiment's results were never altered after the run. |
