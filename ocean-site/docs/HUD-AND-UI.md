# HUD and interface

The fixed interface that sits over the ocean, matched to *The Sea We Breathe*.

## Header (`.hud-top`)

- **Logo** (`.mark`): hidden while loading, fades in with the site. Clicking it goes to the surface.
- **Telemetry** (`.telemetry`): three lines (Detail, Location, Coordinates) that scramble in during the
  loader (`telemetryLine`). Visible on the surface only (`html:not(.on-home) .telemetry{opacity:0}`).
  Values live in each `<li>`'s `data-k` (label), `data-v` (first value), `data-r` (final value).
- **Book a call** (`.hud-btn.book`, desktop): goes to the intake form. **Menu** (`#menu-btn`): opens the
  full-screen menu; items slide up, their depth labels scramble.

## Depth readout (`.hud-loc`, bottom left)

| Line | Source |
| --- | --- |
| Globe + zone name | `#hud-globe` canvas (`drawGlobe`, spins faster after each stop), `#r-zone` = the stop's `data-loc`, or the zone for the depth |
| Discovery progress | `discoveredPct()`: stops visited ÷ all stops across the four dives |
| Progress bar | `#r-bar`, same value |
| Depth / Temp | `metersAt(camera y)`, `tempAt(metres)` |

`readout(y)` updates it every frame. It hides on *Choose your dive*, under the form, and while the
scroll prompt shows (dimmed).

## Dive-page extras (`80-dive-stops.css`)

- **Progress path** (`#jprog`, left edge): an SVG curve; one `.jp-mark` button per stop, placed with
  `getPointAtLength`; the filled part and the arrow follow `STAGE.p`. Markers are clickable.
- **Scroll prompt** (`#sprompt`): appears after 3.5 s idle at a stop: dashed circle turning every 11 s,
  blinking chevrons, "Scroll to explore" scrambling in.
- **Vignette** (`.vig`): darkness at the edges, strength from the stop theme (`--vig`).
- **Edges** (`.edge-t`, `.edge-b`): gradients so text scrolling under the header or readout fades out.

## Sound (`20-sound.js`, button `#audio`)

All generated with the Web Audio API, no audio files. Off until the visitor taps the button.

| Sound | Function | When |
| --- | --- | --- |
| Ambient water | `update(dt, depth, above)` | Always (when on); filtered noise whose low-pass drops from ~1,600 Hz at the surface to ~180 Hz in the abyss, plus a slow swell |
| Bubbles | `bubble()` | Randomly underwater |
| Whoosh | `whoosh(seconds)` | Page transitions, stop travel, splashes |
| Ticks | `tick('hover' / 'click' / 'done')` | Every link and button (delegated in `40-dive-stops.js`) |
| Ducking | `duck(v)` | Lowers the ambience while narration speaks |

Narration stops use the device's speech voice (`speechSynthesis`) only when sound is on; otherwise the
words light up at reading pace without audio.

## Menu (`<nav class="menu">`)

Full-screen overlay. Each link uses `data-go`; `--d` on each sets its stagger delay. Escape closes it.

## The jellyfish guide (`#guide`, `#guide-btn`)

- Opened by tapping the jellyfish or the round button above the sound button. Desktop: a panel on the
  right, the jellyfish swims beside it. Phone: a bottom sheet, the jellyfish moves above it.
- Answers come from Claude when the page runs inside claude.ai and the visitor allows it (one-time
  prompt, `window.claude.use('sample')`), strictly limited to `FACTS`. Otherwise from the built-in
  `KB` keyword matcher. Either way, answers can add a "Take me to…" button.
- While answering, the jellyfish pulses (`guide.talking`).
- **Styling note:** the chat panel's CSS uses `#guide`, never `.guide`, because the loader's SVG also has
  elements with class `guide`. Keep it that way.

## Project spotlight modals

`openModal(id)` clones a `<template>` into `#modal-body`, scales the panel in (1.5 s), wipes the title,
rotates the copy in, scrambles stats, starts the globe or carousel. Escape, the close button or a click
outside closes it; Tab is trapped inside; focus returns to the button that opened it. Stop input is
paused while it's open.

## Accessibility checklist (keep these true)

- Every button has a visible label or `aria-label`; icon-only buttons are at least 44×44 px.
- Decorative SVGs and the canvas are `aria-hidden`.
- The menu, guide and modals close with Escape and return focus.
- `prefers-reduced-motion` is respected everywhere (`reduce`).
- Text contrast: body text is `--ink` (`#eaf4f9`) or `--soft` (`#c9dfea`) on dark water, with a soft
  dark pool behind each text block (`.stop-in::before`, `.inner::before`), never text shadows.
