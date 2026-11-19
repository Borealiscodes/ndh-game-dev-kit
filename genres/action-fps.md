# 🎯 Genre Blueprint 04: Action & First-Person Shooter (FPS)

**Target Shape:** High-speed 3D or 2.5D movement shooter / arena FPS with deterministic projectile ballistics, dash/jump kinematics, zero-float hit registration, and replay/rollback verification.  
**Primary Math Toys:**
* `math-toys/04-symplectic-ballistics/symplectic-ballistics.js` (`60 Hz` kick-drift-kick Störmer–Verlet kinematics & 64-bit squared-distance hitboxes)
* `math-toys/00-core-q16/core.js` (`Q16.16` fixed-point arithmetic, Mulberry32 spread PRNG, synchronous `SHA-256` replay receipts)

---

## 1. Why Symplectic `Q16.16` Ballistics Eliminate "Ghost Hits" & Replay Drift

In fast-paced Action and FPS games, players notice immediately when a rocket clips through a wall on high-ping clients, when grenade arcs land differently at `60 FPS` vs. `144 FPS`, or when a speedrun replay desyncs halfway through a level.

Using **60 Hz Störmer–Verlet Integration (`stepStormerVerletQ16`)** paired with **64-bit integer hitboxes (`checkCircleHitQ16` / 3D sphere-capsule extensions)** guarantees:
* **Frame-Rate Independence:** Simulation ticks advance at an exact `60 Hz` (`DT_60HZ_Q16 = 1092`), while `Ledger 2` smoothly interpolates camera pitch/yaw and weapon bob at native monitor refresh rates (`60–240 Hz`).
* **Symplectic Energy Conservation:** Kick-drift-kick integration prevents parabolic grenade and rocket arcs from gaining or losing artificial energy over long flights.
* **Exact Hit Verification:** Computing squared distances in `BigInt` (`dx*dx + dy*dy + dz*dz <= rSum*rSum`) avoids `Math.sqrt` precision loss and overflows even across massive arena coordinates.

---

## 2. Dual-Ledger Architecture (`Ledger 1` vs. `Ledger 2`)

```text
[Player Input Frame: { tick, moveVec, aimAnglesQ16, fireTrigger }]
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 1: Authoritative 60 Hz Ballistics & Hit Kernel    │
│ • Player Dash, Jump & Gravity Verlet (Toy 04: Q16.16)    │
│ • Projectile Arcs & 64-Bit Sphere/Capsule Hit Checks     │
│ • Deterministic Pellet Spread (Mulberry32 Seeded PRNG)   │
│ • Rollback Snapshot & Replay Digest (sha256Hex)          │
└─────────────────┬────────────────────────────────────────┘
                  │ Read-Only Transform & Hit Event Buffer
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 2: 3D/2.5D Viewport, Recoil Camera & WebAudio     │
│ • Sub-tick visual interpolation (alpha = accum / 16.67ms)│
│ • Screen-shake, muzzle flash, decals & hitmarker HUD     │
│ • Procedural WebAudio gunfire, ricochet & bass impacts   │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Wiring the Math Toys into an Action / FPS P0 Slice

### A. 3D Sphere Hitbox Extension & Projectile Step (`Toy 04`)
Extend `checkCircleHitQ16` to 3D `(xQ16, yQ16, zQ16)` bounding spheres for rockets, plasma bolts, and character hurtboxes while keeping all arithmetic strictly in `BigInt`:

```javascript
import { qAdd, qSub, toQ16, createSeededRng } from "../math-toys/00-core-q16/core.js";
import { stepStormerVerletQ16 } from "../math-toys/04-symplectic-ballistics/symplectic-ballistics.js";

export function checkSphereHit3DQ16(a, b) {
  const dx = BigInt(qSub(a.xQ16, b.xQ16));
  const dy = BigInt(qSub(a.yQ16, b.yQ16));
  const dz = BigInt(qSub(a.zQ16, b.zQ16));
  const rSum = BigInt(qAdd(a.radiusQ16, b.radiusQ16));
  return dx * dx + dy * dy + dz * dz <= rSum * rSum;
}

export function spawnShotgunSpread(origin, baseVxQ16, baseVyQ16, rngNext, pellets = 6) {
  const shots = [];
  for (let i = 0; i < pellets; i++) {
    const jitterX = toQ16(((rngNext() % 400) - 200) / 10.0);
    const jitterY = toQ16(((rngNext() % 400) - 200) / 10.0);
    shots.push({
      xQ16: origin.xQ16,
      yQ16: origin.yQ16,
      vxQ16: qAdd(baseVxQ16, jitterX),
      vyQ16: qAdd(baseVyQ16, jitterY),
      radiusQ16: toQ16(2.5),
    });
  }
  return shots;
}
```

### B. Separating Recoil Feel from Ballistic Truth (`Ledger 2`)
* **Visual Kick (`Ledger 2`):** Apply snappy camera recoil curves, weapon viewmodel kickback, and FOV surges on fire without altering the deterministic aim vector stored in `Ledger 1`.
* **Deterministic Spread (`Ledger 1`):** Drive shotgun pellet cones or automatic bloom exclusively from `createSeededRng(matchSeed ^ tick)` so killcams and anti-cheat replays reproduce every pellet impact down to the exact bit.

---

## 4. Common Action / FPS Failure Traps & How This Kit Prevents Them

| Failure Trap | Why It Breaks Action & FPS Games | Kit Guardrail |
| :--- | :--- | :--- |
| **Refresh-Rate-Dependent Jumps** | Players jump higher at `144 Hz` than `60 Hz` when `dt` is tied to `requestAnimationFrame`. | Locked `60 Hz` fixed-timestep accumulator (`DT_60HZ_Q16`) + `Ledger 2` render interpolation. |
| **32-Bit Distance Overflow** | Squaring large arena coordinates (`> 180 px` in `Q16.16`) overflows signed `Int32`. | `BigInt` 64-bit intermediate products in `checkCircleHitQ16` and `checkSphereHit3DQ16`. |
| **Non-Reproducible Killcams** | `Math.random()` bullet spread causes replays to miss shots that hit live. | Seeded Mulberry32 PRNG + `sha256Hex` state verification at match end. |

---

## 5. Minimum Playable P0 Checklist

- [ ] A player controller with `60 Hz` movement, jump gravity, and dash impulse powered by `stepStormerVerletQ16`.
- [ ] One projectile weapon (`spawnShotgunSpread` or parabolic grenade) evaluated via `checkSphereHit3DQ16`.
- [ ] Sub-tick visual interpolation in `Ledger 2` so movement looks smooth at `120+ Hz` while physics stays locked at `60 Hz`.
- [ ] A deterministic `node --test` replay test confirming identical `sha256Hex` arena state after 300 ticks of movement and firing.
