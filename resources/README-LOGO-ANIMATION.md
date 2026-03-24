# Spaarke Logo Animation

Animated brand reveal for the Spaarke logo. A laser strikes blue material, beams flair outward past the frame, everything dissolves, then the full logo fades in from a distance.

## Animation Sequence

| Phase | Time | Description |
|-------|------|-------------|
| **Laser fire** | 0.0–0.42s | Red horizontal beam sweeps L→R via CSS `clip-path` reveal |
| **Impact** | 0.42s | White spark + blue radial flare expand from dot center |
| **Flair beams** | 0.42–0.67s | 3 beam rects extend to 5000 SVG units (3x past frame) in both directions |
| **Laser retract** | 0.42–1.2s | Laser retracts from left via `clip-path: inset(0 0 0 100%)` |
| **Dissolve** | 0.95–1.7s | Beams fade out while extended; blue dot fades; clean slate |
| **Logo reveal** | 1.7–2.9s | Full static logo (mark + wordmark) fades in with `scale(0.7→1)` |
| **Tagline** | 2.9–3.7s | "Legal Operations Intelligence" pops in letter-by-letter |

## Architecture

### Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Experiment definition (2 variants) |
| `src/LogoAnimationCSS.tsx` | **Variant A** — CSS keyframes for laser/dot/spark/flare/logo/tagline |
| `src/LogoAnimationWAAPI.tsx` | **Variant B** — Web Animations API for same elements |
| `src/beamAnimation.ts` | Shared beam animation (rAF + `setAttribute`) used by both variants |

### Beam Animation (beamAnimation.ts)

The beam width animation is the trickiest part. CSS `width`, CSS `scaleX`, and SMIL `<animate>` all had cross-browser issues with SVG rect elements that have `transform` attributes (rotations).

**Solution**: `requestAnimationFrame` loop that directly calls `rect.setAttribute('width', ...)` and `rect.setAttribute('x', ...)` on every frame. This is bulletproof — pure DOM manipulation, no abstraction layers.

Key technique for bidirectional extension:
```
x = centerX - width / 2
```
Each rect has a `data-cx` attribute storing its center X in local coordinates. As width grows, `x` shifts so the beam extends equally in both directions from center.

### SVG Structure

The SVG contains two layers:

1. **Animated elements** (used during opening, then fade to 0):
   - `#spaarke-laser` — horizontal beam (CSS clip-path)
   - `.ska-beam-rect` (×3) — flair beam rects (rAF-driven width + opacity)
   - `.ska-dot-fade` — blue dot group (CSS opacity fade)
   - `.ska-spark` / `.ska-flare` — impact effects (CSS transform + opacity)

2. **Static full logo** (`.ska-full-logo`):
   - Complete copy of the original SVG logo (mark + wordmark) at final sizes
   - Starts at `opacity: 0; transform: scale(0.7)`
   - Fades in + scales up after animated elements dissolve

### Beam Geometry

| Beam | Origin | Rotation | data-cx | Direction |
|------|--------|----------|---------|-----------|
| Diagonal (down-right) | (1016.1, 1358.1) | -45° | 1825.1 | Lower-left ↔ upper-right |
| Diagonal (up-right) | (1016, 214) | +45° | 1825 | Upper-left ↔ lower-right |
| Vertical | (1661.1, 0) | 90° | 2470.1 | Top ↔ bottom |

### Replay

Both variants use `key={animKey}` on the stage wrapper. Incrementing the key forces React to remount the entire SVG, restarting all CSS animations and the rAF loop cleanly.

## Source SVG

`Full Logo Aligned__ids_grouped_clean.svg` — the original brand SVG with grouped elements and IDs. Logo geometry is never altered; the animation only adds/controls visibility and positioning.

## Viewing

```
http://localhost:5173/__experiments → Logo Animation
```

Switch between CSS Keyframes and Web Animations API variants using the dropdown.
