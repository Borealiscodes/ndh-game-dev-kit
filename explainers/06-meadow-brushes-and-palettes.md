# 🟧 Explainer 06: Kaleidoscope Geometry, Safe Radii & Painterly Color Zoning

**Altitude:** `A7` (Plain-Language Clarity Layer • Zero Unexpanded Jargon)  
**Companion Code:** `math-toys/06-surrealist-brush-adapter/surrealist-brush-adapter.js`  

---

## 💡 The Big Idea: Painting With Geometry Instead of Random Noise

Most digital drawing tools either leave raw, jagged mouse lines on screen or rely on unpredictable random splatter brushes. What if your paintbrush itself understood **symmetry, perspective, and harmonious color palettes**?

**`surrealist-brush-adapter.js`** turns simple cursor or finger movements into structured geometric art using three clean mathematical tricks:
1. **Never Dividing by Zero (`safeRadiusQ16`):** Keeps math from crashing when a stroke passes dead-center through `(0, 0)`.
2. **Energy-to-Pigment Zoning (`evaluateSymplecticZoneQ16`):** Translates your stroke's speed and position into a curated 6-color modernist painting palette.
3. **Geometric Brush Lenses (`transformBrushStrokeQ16`):** Shapes a single touch into honeycomb tiles, kaleidoscopic mandalas, swirling spirals, or 3D saddle curves.

---

## 🎨 How `surrealist-brush-adapter.js` Works Step by Step

### 1. The Zero-Crash Safety Floor (`safeRadiusQ16`)
In geometry, formulas for ripples and spirals often divide by the distance from the center (`1 / r`). If your finger touches the exact center (`r = 0`), a computer tries to divide `1 ÷ 0` and produces `NaN` ("Not a Number") or `Infinity`—ruining the entire canvas!

`safeRadiusQ16` acts like a microscopic bumper: if the radius is `0`, it quietly substitutes the smallest possible `Q16.16` step (`1` tick = `1 / 65,536`), guaranteeing smooth, crash-free math everywhere on screen.

### 2. Automatic Painterly Color Zoning (`evaluateSymplecticZoneQ16`)
Instead of picking colors randomly—which often creates muddy, clashing mixtures—`evaluateSymplecticZoneQ16` multiplies your stroke's position slice (`q`) by its momentum slice (`p`), scales it down safely so bright colors don't blow out to white, and maps the energy into one of **six curated modernist pigments** inspired by New Zealand painter Frances Hodgkins and artist Simon Ingram:
* **Ibiza Ochre (`#D3A261`)** — Warm sunlit gold for energetic crests
* **Modernist Sage (`#7A8B7B`)** — Calm olive-green for balanced midtones
* **Terracotta Earth (`#C86A4B`)** — Rich clay-red for warm structural curves
* **Dunedin Cobalt (`#2C4A6F`)** — Deep twilight blue for quiet shadows
* **Muted Alabaster (`#EBE7DF`)** — Soft parchment white for breathing room
* **Deep Madder (`#4A2A2B`)** — Dark burgundy-brown for strong anchors

### 3. Four Geometric Brush Lenses (`transformBrushStrokeQ16`)
* **Honeycomb Tessellation (`tessellation`):** Snaps freehand strokes onto a staggered hexagonal honeycomb grid—turning rough sketches into crisp stained-glass mosaics.
* **Mandala Radial Ripple (`mandala`):** Copies your single brush point `N` times evenly around a circle (`3` to `12` folds), turning every swipe into an instant symmetrical kaleidoscope.
* **Rotational Vortex (`vortex`):** Twists coordinates smoothly around the center by a given angle, creating hypnotic spiral galaxies from straight lines.
* **Hyperbolic Saddle (`saddle`):** Curves points along a Pringle-chip saddle surface (`z = x² - y²`), spreading dense overlapping lines apart so details stay crisp instead of piling into a dark blob.

---

## 🎮 Why This Matters for Games & Creative Tools

* **Interactive Art Canvases & Toy Apps:** Lets players of any skill level draw stunning stained-glass mosaics, kaleidoscopes, and modernist landscapes with a single finger on a tablet.
* **Procedural World & Magic Rune Generators:** Generates symmetrical spell circles, alchemical sigils, and tiled dungeon floors deterministically from a single seed.
* **Interpretable AI Visualizers:** Shows exactly how high-dimensional data moves through space without hiding behavior inside opaque black-box filters.

---

## 🌍 Other Real-World Domains That Use These Geometric Primitives

| Real-World Domain | How It Uses This Exact Math |
| :--- | :--- |
| **🏛️ Architecture & Tiling Design** | Uses hexagonal tessellations and dihedral symmetry (`mandala`) to design load-bearing domes, acoustic panels, and mosaic floors. |
| **🔭 Optics & Lens Engineering** | Uses safe-radius radial functions to model light refraction through curved glass lenses without center singularities. |
| **📊 High-Dimensional Data Visualization** | Uses saddle projections (`z = x² - y²`) to prevent thousands of data points from crowding on top of each other on 2D screens. |
| **🧵 Textile & Generative Pattern Design** | Maps mathematical energy functions onto fixed dye palettes for weaving, wallpaper, and ceramic glazes. |
