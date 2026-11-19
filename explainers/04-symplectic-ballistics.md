# 🟧 Explainer 04: Bouncing Orbits, 60 Hz Ticks & 64-Bit Hitboxes (Symplectic Ballistics)

**Altitude:** `A7` (Plain-Language Clarity Layer • Zero Unexpanded Jargon)  
**Companion Code:** `math-toys/04-symplectic-ballistics/symplectic-ballistics.js`  

---

## 💡 The Big Idea: Why Simple Game Physics Leaks Energy

Imagine pushing a child on a playground swing or watching a moon orbit a planet. In the real world, if there is no air friction, that orbit keeps the exact same energy and loops cleanly forever.

In many beginner games, programmers update movement using a shortcut called **Euler integration** (`position += velocity; velocity += gravity`). That shortcut makes a subtle timing mistake—applying gravity *after* moving—which secretly pumps fake energy into the system on every single frame! Before long, orbiting spaceships spiral off into deep space, bouncing balls bounce higher than where they started, and jump heights change depending on whether your monitor runs at `60 Hz` or `144 Hz`.

**Symplectic Störmer–Verlet Physics** fixes that energy leak with a clever three-step dance, while **64-Bit Squared-Distance Hitboxes** check hundreds of bullet collisions per frame without slow square roots.

---

## 🚀 How `symplectic-ballistics.js` Works Step by Step

### 1. The Locked 60 Hz Heartbeat (`DT_60HZ_Q16`)
Instead of letting faster or slower screens stretch the size of a physics step, `symplectic-ballistics.js` locks time to an exact **`60 Hz` metronome** (`1/60` of a second = `1092` ticks in `Q16.16`). Whether you play on a budget tablet or a gaming PC, every projectile travels the exact same arc on tick `120`.

### 2. The "Kick–Drift–Kick" Dance (`stepStormerVerletQ16`)
To keep orbits and parabolic grenade arcs rock-solid over millions of ticks, `stepStormerVerletQ16` splits each tick into three symmetric steps (**Störmer–Verlet integration**):
1. **Half-Kick:** Nudge the velocity forward by *half* a tick of gravity or thrust (`HALF_DT_60HZ_Q16`).
2. **Full-Drift:** Move the object's `(x, y)` position for one full tick using that balanced mid-step velocity.
3. **Half-Kick:** Nudge the velocity by the remaining *half* tick of acceleration.

Because the push happens symmetrically around the move, energy errors cancel out instead of piling up—a mathematical property called **symplectic volume preservation**.

### 3. Hitboxes Without Square Roots (`checkCircleHitQ16`)
To check if two circles touch, school geometry uses the Pythagorean theorem:

$$\text{distance} = \sqrt{dx^2 + dy^2} \le r_1 + r_2$$

Computing a square root ($\sqrt{\phantom{x}}$) is slow and introduces decimal rounding. Even worse, squaring a large `Q16.16` coordinate (`dx * dx`) overflows a standard 32-bit integer!

`checkCircleHitQ16` solves both tricks at once:
* **Skip the Square Root:** Instead of taking the square root of the left side, it simply squares the right side (`dx² + dy² <= (r1 + r2)²`)!
* **Use a 64-Bit Bucket (`BigInt`):** It pours `dx`, `dy`, and `r1 + r2` into 64-bit `BigInt` integers before squaring, guaranteeing exact, overflow-free collision checks across massive arenas.

---

## 🎮 Why This Matters for Games

* **Bullet-Hell Shmups & Arcade:** Check 300+ bullets against a tiny player core hitbox and a larger graze ring every frame at `60 Hz` with zero battery-draining square roots.
* **Space Sims & Orbital Slingshots:** Planets, moons, and satellites orbit stably for hours without spiraling outward or crashing due to integrator drift.
* **Action & FPS Ballistics:** Grenades, rockets, and jump arcs behave identically on `60 Hz` mobile screens and `240 Hz` monitors.

---

## 🌍 Other Real-World Domains That Use Störmer–Verlet Math

| Real-World Domain | How It Uses This Exact Math |
| :--- | :--- |
| **🧬 Molecular Dynamics & Drug Discovery** | Simulates millions of vibrating atoms and protein folds over billions of timesteps without artificial heat gain. |
| **🪐 Planetary Astronomy & Spacecraft Navigation** | Computes long-term asteroid trajectories and gravity-assist slingshots across the solar system. |
| **🦾 Embedded Robotics & Drone Controllers** | Runs fast integer-only trajectory checks on low-power microcontrollers without floating-point hardware. |
| **🏎️ Vehicle & Cloth Physics Engines** | Powers stable suspension springs and rigid-body constraints in real-time simulators. |
