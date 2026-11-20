# 🟧 Explainer 07: Sensory Regulation Envelope (Why Less Flash & Softer Sound Make Games Safer!)

**Altitude:** `A7` (Public-Facing Plain-Language Guide • Zero Jargon)  
**Companion Math Toy:** [`math-toys/07-sensory-regulation-envelope/sensory-envelope.js`](../math-toys/07-sensory-regulation-envelope/sensory-envelope.js)  

---

## ⭐ The Big Idea (Bill Nye Style)

> “Kids!  
> 
> Not every player's nervous system wants loud explosions, flashing strobe lights, or sudden buzzing controllers! For neurodivergent players, migraine sufferers, or anyone sensitive to sensory overload, **turning down visual flash, camera shake, and sharp high-pitched audio** turns an overwhelming screen into a calm, welcoming space—without changing a single rule of the underlying game math!”

---

## 🛡️ Three Guardrails Inside `sensory-envelope.js`

1. **Zero-Strobe & Reduced Motion (`filterVisualStimuli`):**  
   When `noFlash` and `reducedMotion` are enabled, screen flashes, camera shake offsets, and decorative particle bursts clamp cleanly to `0` inside `Ledger 2`—leaving `Ledger 1` collision physics completely untouched.
2. **Gentle Low-Pass Audio Limiter (`clampGentleAudioParams`):**  
   Caps audio gain (`<= 0.06`), rolls off harsh upper frequencies above `850 Hz`, and enforces a soft `25 ms` attack swell so no sound ever startles.
3. **Comfortable Pacing (`scalePacingStepQ16`):**  
   Scales the timestep deterministically in `Q16.16` (`0.25x` to `1.5x`) so players can slow down fast action whenever they want.
