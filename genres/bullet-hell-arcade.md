# 🌠 Genre Blueprint 08: Bullet-Hell Shmup & Arcade (*Mitakihara Labyrinth* Style)

**Target Shape:** Fast-paced vertical or twin-stick `60 Hz` bullet-hell shooter featuring dense radial boss danmaku rings, tiny precision player hitboxes, grazing/risk-reward meters, and deterministic high-score replays.  
**Primary Math Toys:**
* `math-toys/04-symplectic-ballistics/symplectic-ballistics.js` (`60 Hz` Störmer–Verlet projectile integration & 64-bit integer squared-distance hitboxes)
* `math-toys/00-core-q16/core.js` (`Q16.16` fixed-point arithmetic, Mulberry32 deterministic wave PRNG, synchronous `SHA-256` leaderboard receipts)

---

## 1. Why `Q16.16` Integer Hitboxes & Trig Tables Rule Bullet-Hell Games

In a bullet-hell shmup with **300+ active projectiles on screen at `60 Hz`**, players weave through razor-thin gaps where a single pixel decides survival. Floating-point `Math.sin`/`Math.cos` calls inside inner bullet loops waste mobile battery and can introduce subtle trajectory drift across devices.

Using **Precomputed `Q16.16` Trigonometric Ring Tables** paired with **64-bit Integer Circle Hitboxes (`checkCircleHitQ16`)** solves both performance and fairness:
* **Zero Inner-Loop `Math.sin` / `Math.sqrt`:** Boss spiral and radial patterns read velocity vectors directly from a 64-entry or 256-entry `Int32Array` lookup table (`Q16.16` cosine/sine), executing in pure integer array lookups.
* **Precision Core vs. Graze Rings:** Every player entity carries two concentric integer radii (`coreRadiusQ16 = toQ16(3.5)` for lethal hits; `grazeRadiusQ16 = toQ16(18.0)` for energy/score harvesting), evaluated via exact `BigInt` squared distance (`dx*dx + dy*dy <= rSum*rSum`).
* **Bit-Exact Replay Verification:** Because wave spawns pull exclusively from `createSeededRng(runSeed)`, any high-score run can be verified by replaying the input log and comparing `sha256Hex()`.

---

## 2. Dual-Ledger Architecture (`Ledger 1` vs. `Ledger 2`)

```text
[Touch-Drag / WASD Steering & Bomb/Ultimate Trigger]
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 1: 60 Hz Bullet-Hell Kernel (Zero-Float Q16.16)   │
│ • Player 8-Way / Touch Velocity & Arena Clamping         │
│ • Precomputed Q16.16 Trig Ring Boss Danmaku Spawners     │
│ • 64-Bit Integer Core Hitbox & Graze Ring Checks (Toy 04)│
│ • Mulberry32 Wave Scheduler & Run Receipt (sha256Hex)    │
└─────────────────┬────────────────────────────────────────┘
                  │ Read-Only Entity & Meter Snapshot
                  ▼
┌──────────────────────────────────────────────────────────┐
│ LEDGER 2: 2D Canvas Shmup Renderer, HUD & WebAudio Synth │
│ • Glowing projectile sprites, boss HP arc & graze sparks │
│ • Soul/Purity, Hope/Mana & Despair/Risk HUD progress bars│
│ • Mute-by-default WebAudio Baroque/Techno BGM & SFX      │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Wiring the Math Toys into a Bullet-Hell Arcade P0 Slice

### A. Precomputed `Q16.16` Ring Table & Boss Spiral Spawner (`Toy 04`)
Generate a deterministic 32-angle `Q16.16` unit circle once at startup so boss rings spawn with zero runtime floating-point trigonometry:

```javascript
import { toQ16, qMul, createSeededRng } from "../math-toys/00-core-q16/core.js";
import { stepStormerVerletQ16, checkCircleHitQ16 } from "../math-toys/04-symplectic-ballistics/symplectic-ballistics.js";

const RING_STEPS = 32;
const COS_TABLE_Q16 = new Int32Array(RING_STEPS);
const SIN_TABLE_Q16 = new Int32Array(RING_STEPS);

for (let i = 0; i < RING_STEPS; i++) {
  const theta = (2 * Math.PI * i) / RING_STEPS;
  COS_TABLE_Q16[i] = toQ16(Math.cos(theta));
  SIN_TABLE_Q16[i] = toQ16(Math.sin(theta));
}

export function spawnBossDanmakuRing(bossXQ16, bossYQ16, speedPxPerSec = 160, phaseOffset = 0) {
  const speedQ16 = toQ16(speedPxPerSec);
  const bullets = [];
  for (let i = 0; i < RING_STEPS; i += 2) {
    const idx = (i + phaseOffset) & (RING_STEPS - 1);
    bullets.push({
      xQ16: bossXQ16,
      yQ16: bossYQ16,
      vxQ16: qMul(COS_TABLE_Q16[idx], speedQ16),
      vyQ16: qMul(SIN_TABLE_Q16[idx], speedQ16),
      radiusQ16: toQ16(4.5),
    });
  }
  return bullets;
}
```

### B. Precision Core Hitbox vs. Graze Harvest (`Toy 04`)
Check both concentric circles in `Ledger 1` on every `60 Hz` tick:
* If `checkCircleHitQ16(bullet, playerCore)` is `true`: trigger invulnerability frames (`invulnTicks = 60`), decrement player health/purity, and clear nearby bullets.
* Else if `checkCircleHitQ16(bullet, playerGrazeRing)` is `true`: increment Ultimate/Hope gauge (`+1`) and award bonus graze score without harming the player.

---

## 4. Common Bullet-Hell Arcade Failure Traps & How This Kit Prevents Them

| Failure Trap | Why It Breaks Bullet-Hell Games | Kit Guardrail |
| :--- | :--- | :--- |
| **Unfair Sprite-Box Hits** | Visual bullet glow extends past the lethal core, causing frustrating deaths. | Render generous visual sprites in `Ledger 2`, but set `radiusQ16` to `65–75%` of visual radius in `Ledger 1`. |
| **Mobile Touch Finger Occlusion** | Player's thumb covers their own ship during touch-drag movement. | Use relative pointer deltas or a slight vertical offset in `Ledger 2` input mapping. |
| **WebAudio Garbage Collection Stutter** | Creating unstopped audio nodes on every `60 Hz` auto-fire frame. | Throttle shot SFX to every 2nd/3rd volley and always call `osc.stop()` cleanly inside `Ledger 2`. |

---

## 5. Minimum Playable P0 Checklist

- [ ] A `60 Hz` player ship with touch-drag and `WASD` steering, continuous auto-fire, and a screen-clearing Ultimate ability.
- [ ] At least 3 enemy wave archetypes driven by `createSeededRng` + a multi-phase boss using `spawnBossDanmakuRing`.
- [ ] Concentric `checkCircleHitQ16` checks separating lethal core hits from risk-reward graze bonuses.
- [ ] A deterministic `node --test` verification check confirming identical bullet positions and collision outcomes across runs.
