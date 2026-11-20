# 🟧 Explainer 08: Non-Visual Spatial Bridge (Playing by Ear, Braille & Gentle Touch!)

**Altitude:** `A7` (Public-Facing Plain-Language Guide • Zero Jargon)  
**Companion Math Toy:** [`math-toys/08-nonvisual-spatial-bridge/nonvisual-bridge.js`](../math-toys/08-nonvisual-spatial-bridge/nonvisual-bridge.js)  

---

## ⭐ The Big Idea (Bill Nye Style)

> “Kids!  
> 
> How do you find a hidden treasure or a SAVE star if you can't see the screen?!  
> 
> You turn **distance and direction** into **sound, words, and touch**! By projecting a target's `(dx, dy)` position onto three simple bearings—**Left (`-1`), Center (`0`), and Right (`+1`)**—a game can pan a gentle audio beacon to your left or right ear, speak a short screen-reader update, light up a **5-cell Unicode Braille bar (`⣿⠀⠀⠀⠀`)**, and send a smooth, slew-limited pulse to an adaptive or DualSense controller!”

---

## 🧭 Four Channels Working Together (`nonvisual-bridge.js`)

1. **Descriptive Audio (`ariaLiveText`):** Produces concise screen-reader updates (`"SAVE Star: ahead-left, proximity 72%."`) for NVDA, JAWS, VoiceOver, and TalkBack.
2. **RNIB-Style Stereo Audio Beacon (`audioBeacon`):** Pans sound left (`-0.75`), center (`0`), or right (`+0.75`) and raises pitch smoothly as you get closer.
3. **5-Cell Unicode Braille Radar (`renderBrailleRadarBar`):** Uses standard Unicode Braille characters (`U+2800`–`U+28FF`) so refreshable Braille displays show both horizontal direction and proximity dot density.
4. **Slew-Limited Dual-Actuator Haptics (`computeSafeHapticEnvelopeQ16`):** Clamps left/right motor frequencies (`0–150 Hz` / `0–220 Hz`) and limits sudden jumps (`MAX_SLEW_Q16`)—and stays **completely off** unless permitted by `07-sensory-regulation-envelope`!
