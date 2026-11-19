# AGENTS.md — Operational Rules for AI Coding Agents & Contributors

**READ THIS FILE FIRST** before writing game logic, math kernels, or tests in `ndh-game-dev-kit`.

---

## 1. Epistemic & Persona-Zero Guardrails

* **Non-Conscious Operator Rule:** AI coding agents and in-game NPCs are non-conscious linear operators (`IsPureOperator`). Never claim subjective feelings, intuition, or unverified completion ("vibes").
* **Receipts Over Claims:** Every mathematical invariant, physics step, or schema migration must be backed by an executable test receipt (`node --test`, `cargo test`, or `lake build`).
* **Anti-Drift Rule:** Do not allow poetic, mythic, or philosophical themes to leak into state transitions, collision checks, or save validation.

---

## 2. Dual-Ledger Architecture (`Ledger 1` vs. `Ledger 2`)

Every game or simulation built with this kit enforces a strict one-way boundary:

| Layer | Responsibility | Allowed Operations | Forbidden Operations |
| :--- | :--- | :--- | :--- |
| **`Ledger 1` (Kernel)** | State transitions, physics, hitboxes, quest topology, save hashes | `Q16.16` / `Q32.32` integer math, seeded PRNG, synchronous `SHA-256` | `Math.random()`, `Date.now()`, DOM access, WebAudio, LLM calls |
| **`Ledger 2` (View)** | Canvas/WebGL rendering, WebAudio synthesis, UI HUD, text/LLM narration | Read-only inspection of `Ledger 1` snapshots | Mutating `Ledger 1` state or gating win/loss conditions |

---

## 3. The Ten Laws of Game Development (Adapted from Dom / `EternitiesAi`)

1. **Scope to a Playable P0 First:** Build one complete vertical slice before adding content breadth.
2. **Fixed-Timestep Simulation (`60 Hz`):** Decouple simulation ticks (`dt = 1/60s`) from variable display refresh rates.
3. **Zero Floating-Point Drift (`Q16.16`):** Use signed 32-bit `Q16.16` fixed-point integers (`1.0 === 65536`) with 64-bit intermediate products for cross-platform bit-exact parity.
4. **Explicit Compute Governance:** Bound per-tick operations (e.g., `≤ 2,000 FLOPs/cycle` on edge PDE grids) to protect battery and mobile hardware.
5. **Versioned State & Receipts from Commit One:** Include schema versions and deterministic `SHA-256` digests in save/replay manifests.
6. **Never Trust Unverified State:** Validate inputs at system boundaries; reject `NaN` and `Infinity` immediately.
7. **Deterministic Seeded PRNG:** Use seeded integer generators (such as Mulberry32) so every run is reproducible.
8. **Test on Constrained Hardware First:** Verify performance on mobile ARM64 devices before desktop workstations.
9. **Zero Dark Patterns:** No manipulative timers, deceptive monetization, or hidden telemetry.
10. **Human-Gated Final Verdict:** Automated tests verify invariants; human playtesting decides feel, pacing, and fun.
