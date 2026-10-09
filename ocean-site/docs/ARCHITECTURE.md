# Architecture

How dolonia.cloud is put together, from the build down to a single frame.

## 1. One file, two layers

The site is a single HTML page with two layers stacked on top of each other:

| Layer | What it is | Where |
| --- | --- | --- |
| **WebGL canvas** (`#sea`, fixed, full screen, behind everything) | The ocean: sky, surface, water colour, light shafts, marine snow, every animal, the current tunnel, bloom/glow | `src/js/engines/*`, `src/js/site/50-scene.js` |
| **HTML layer** (on top) | Loader, HUD, menu, page text, panels, the intake form, the jellyfish guide, modals | `src/index.html`, `src/styles/*`, `src/js/site/10…40` |

The HTML never scrolls like a normal website except on the surface and *Choose your dive* pages.
On the four dive pages the page is locked (`html.staged`) and scrolling moves the **camera** instead.

If WebGL is unavailable the scene code bails out early (`root.classList.add('no-webgl')`) and a
lightweight loop keeps the HUD, page flow and dive stops working on a plain gradient.

## 2. The build

`scripts/build.mjs` reads `src/index.html` and fills five kinds of markers:

| Marker | Replaced with |
| --- | --- |
| `/*@styles*/` (inside `<style>`) | Every `src/styles/*.css`, sorted by filename |
| `@asset:logo.png` | `data:image/png;base64,…` built from `src/assets/logo.png` + `logo.png.mime` |
| `/*@engine:NAME.js*/` | `src/js/engines/NAME.js` (each sits in its own `<script>` tag in `index.html`) |
| `/*@site*/` | Every `src/js/site/*.js`, sorted by filename, **joined into one script** |

Script load order in the page: Three.js (CDN) → jellyfish → ocean → fish-school → anglerfish →
sea-life → site. The engines only define global factory functions (`createBlubber`, `createSurface`,
`createSchool`, `createAngler`, `createShrimp`, `createExtras`, `createBloom`); nothing runs until the
site script calls them.

### The shared site scope

`00-core.js` starts with `(function(){` and `50-scene.js` ends with `})();`. Everything between is one
closure, so files freely use each other's variables and functions. Practical consequences:

- **Order matters for code that runs immediately**, not for function declarations (those are hoisted).
  Example: `40-dive-stops.js` reads the DOM at load time (`TOTAL_STOPS`), fine because scripts run
  after the HTML.
- **Hooks are declared early and filled in later.** `30-pages-guide-intake.js` declares
  `var formSchool = function(){}, creaturesFor = function(){}, tint = function(){};` and
  `50-scene.js` replaces them once the 3D objects exist. If WebGL fails they stay as no-ops.
- **Name collisions are real.** Prefix new globals or keep them inside a function.

## 3. Startup sequence

1. HTML paints the loader (`#intro`). `<html class="on-home">` keeps telemetry visible.
2. `10-motion-and-loader.js` → `runIntro()` starts the dial, telemetry and legal scramble.
3. `50-scene.js` builds the renderer and every creature, calling `markProgress(0.55 … 1)` as it goes;
   the dial's fill follows real progress.
4. When progress hits 1, `finishIntro()` plays the exit (dial shrinks, background fades) and calls
   `enterSite()`.
5. `enterSite()` reads the URL hash (`#ai/3` → page `ai`, stop 3), calls `swap(page)` and
   `arrive(page)`, and adds `is-live` to `<html>`, which fades the HUD in.

## 4. The depth model

Everything is placed on one vertical axis. `PAGE` in `00-core.js` gives each page a camera range in
world units (negative is deeper):

| Page | `y0 → y1` | Zone shown in HUD | Type |
| --- | --- | --- | --- |
| `home` | 3.2 → 3.2 | Surface | above water |
| `dives` | −9 → −9 | Sunlight zone | normal scroll |
| `interfaces` | −5 → −17 | Sunlight zone | stage (stops) |
| `systems` | −21 → −37 | Twilight zone | stage |
| `ai` | −41 → −56 | Midnight zone | stage |
| `work` | −60 → −74 | Abyssal plain | stage |

`metersAt(y)` maps a camera height to the metres shown in the HUD (power curve to 4,200 m),
`tempAt(m)` interpolates temperature, `zoneFor(m)` names the zone. Water colour comes from
`bgAt(depthFraction)` in `50-scene.js` (6 colour stops from `#2a6f92` to `#01060e`).

## 5. Pages and transitions (`30-pages-guide-intake.js`)

- Each page is a `<section class="page" data-page="NAME">`. Only one has `.is-active`.
- `go(to)` is the single way to change page. It picks a transition:
  - **home → dives:** `completeDive()`, the scroll-scrubbed dive (see ANIMATION-AND-TRANSITIONS.md).
  - **anything → home:** a camera rise.
  - **everything else:** the current tunnel. From *Choose your dive* it first calls `flyInto(to)`.
- `swap(to)` does the instant switch while the screen is covered: hides the old page, shows the new,
  resets scroll, toggles `on-home` / `on-dives` / `staged`, updates the title and menu, calls
  `creaturesFor(to)` to bring in that depth's animals.
- `arrive(to, delay)` reveals the new page after the transition. For stage pages it calls
  `stageEnter(page, stop)`.
- Links use `data-go="page"` (and optional `data-to="elementId"`); one delegated click handler routes them.
- The hash is kept in sync, so the back button and deep links work. Stop numbers are written with
  `history.replaceState`, so moving between stops never adds history entries.

## 6. Dive pages: the stage engine (`40-dive-stops.js`)

A dive page is a list of `.stop` elements. `STAGE` holds the state:

| Field | Meaning |
| --- | --- |
| `p` | Continuous camera position in stop units (2.5 = halfway between stops 2 and 3) |
| `target` | Where `p` is gliding to; input moves this, not `p` |
| `idx` | The stop whose panel is showing, or −1 while travelling between stops |
| `env` / `envTo` | Current and target water theme (tint, light shafts, bloom, vignette) |
| `visited` | Stops seen, across all dives, for *Discovery progress* |

Each frame `stageTravel(dt)` eases `p` toward `target`, hides the panel once the camera is 0.22 stops
away, catches the camera when it gets within 0.12 of a stop (shows that panel, snaps `target`, pauses
input 200 ms), and after 450 ms with no input settles on the nearer stop. The scene reads `STAGE.p` to
place the camera: height from the page's `y0 → y1`, sideways sway `1.3·sin(1.4p)`, and `TRAVEL = 16p`
world units, which slides the seabed, particles and seafloor props toward the camera.

## 7. The render loop (`frame()` in `50-scene.js`)

In order, every frame:

1. Clamp `dt` (max 50 ms), advance `clock`.
2. Camera height: scrubbed dive (`diveFrame`) → stage (`STAGE.p`) → normal page scroll.
3. Camera position, rotation (mouse parallax on desktop, gentle path yaw on dive pages, tunnel tilt),
   and FOV (wider during the tunnel and fly-in).
4. Splash bubbles when the camera crosses y = 0.
5. Jellyfish position (`targetX/targetY`), escape and drag physics, `J.update`.
6. Water colour × stop theme, sky/ocean, light shafts, bloom strength.
7. Marine snow, currents ribbons, the current tunnel, bubbles, sea-life extras.
8. Creatures: mackerel school (follows the camera's depth), lanternfish, anglerfish + prey + shrimp
   (strike detection happens here), feeding plankton.
9. HUD readout, stage frame (prompt, progress path, theme easing), HUD globe.
10. Hide whatever the tunnel fully covers (saves GPU), then `bloom.render(scene, camera)`.

## 8. Quality scaling

`small = window.innerWidth < 760` at load. On phones: pixel ratio capped at 1.3 (1.75 desktop), fewer
particles, fewer fish (70 vs 140), lower-poly bodies, no mouse parallax. `reduce` (prefers-reduced-motion)
turns transitions into quick fades and stops most continuous motion.

## 9. Key decisions

| Decision | Why | Trade-off |
| --- | --- | --- |
| Single file, no framework | Hosts anywhere, opens offline, nothing to install | Big source files; the build keeps editing sane |
| Three.js r128 from CDN | Stable API, matches every shader here | Newer Three releases changed some APIs; don't upgrade casually |
| Procedural creatures (code, not 3D model files) | Tiny download, tunable, animated in shaders | Each animal is a few hundred lines; see CREATURES.md before editing |
| Stops instead of free scroll on dives | Matches the reference; text only shows where it belongs | Content has to be written as stops |
| Generated sound (Web Audio) | No audio files to load | Ambient only; voice narration uses the device's speech voice |
