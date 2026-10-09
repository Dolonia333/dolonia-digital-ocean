# Animation and transitions

Every moving thing in the HTML layer, and every move between pages, with the file, the function and
the numbers to change.

## Motion tokens

| Token | Value | Use |
| --- | --- | --- |
| `--expo-out` / `EXPO_OUT` | `cubic-bezier(.16,1,.3,1)` | Arrivals: fast start, long gentle finish. The default for almost everything |
| `--expo-in` | `cubic-bezier(.7,0,.84,0)` | Exits |
| `--expo-io` | `cubic-bezier(.87,0,.13,1)` | Long moves, ring markers |
| `--snap` | `cubic-bezier(.76,0,.24,1)` | Button fills, card open |
| `E.out`, `E.inn`, `E.io3`, `E.io4`, `E.ios`, `E.out2`, `E.out3`, `E.lin` | JS easings in `10-motion-and-loader.js` | Pass to `tween(seconds, ease, fn)` |

`tween(dur, ease, fn)` calls `fn(progress)` every animation frame and returns a Promise. `wait(seconds)`
returns a Promise. Chain them: `wait(.3).then(() => tween(1.5, E.io4, p => …))`.

## Text effects

| Effect | Function | Used on | Feel |
| --- | --- | --- | --- |
| Scramble | `scramble(el, text, dur, delay)` | Telemetry, kickers, stats, captions | Random glyphs settle left to right |
| Flicker | `flicker(el)` | Zone name, dial labels | Opacity 0.8, 0.3, 0.8, 0.3, 1 in 0.4 s |
| Line wipe | `wipeLines(el, delay)` (+ `presplit(el)`) | `.wl`, `.h-wipe` | Each line slides up from a mask, 90 ms apart, 1.4 s |
| Line rotate | `rotateIn(el, delay)` | `.rot` paragraphs, modal copy | Lines swing up from 6°, 110 ms apart, 1.5 s |
| Letter shuffle | `shuffleIn(el)` | `.statement`, solved text | Letters appear in random order over ~1.4 s |
| Title lines | CSS: `.st-title .line > span` | Headlines | `translateY(105%)` → 0 when the stop gets `.is-on` |

`presplit` measures line breaks while the screen is covered by a transition, so the later reveal never
stutters. Effects restore the original HTML when they finish, so text re-flows correctly on resize.

## The loader (`runIntro`, `finishIntro`)

1. Dial scales in (1 s, expo out); the outer ring swings on a 5 s loop.
2. A mask draws the tick ring around in 2 s; ticks thicken.
3. Telemetry lines scramble in one after another (`telemetryLine`): key, value, blinking dots, final value.
4. Legal lines scramble in at the bottom right.
5. The fill follows real loading (`markProgress`), never faster than one sweep per 2 s. 25/50/75/100 flicker on as it passes.
6. "Loading Experience" flickers to "Connection Established".
7. Exit: the mask undraws (0.8 s), the dial shrinks (0.5 s), the background fades (2.6 s), `is-live` is added and the hero cascades in.

Sizes and type for the loader are in `10-intro-loading-dial.css`; it is matched to the reference
screenshots (dial ≈ 54vw, telemetry 0.47 rem wide-spaced, legal 0.5 rem light blue, background `#1b3a5e`).

## Home → Choose your dive: the scrubbed dive (`D`, `completeDive`, `diveFrame`)

- On the home page, wheel and swipe don't scroll; they move `D.p` from 0 (surface) to 1 (underwater).
- Let go before `D.p > 0.24` and it floats back up. Past it, `completeDive()` finishes the dive on its own.
- At `D.p > 0.5` the mackerel school starts forming from particles (`formSchool`).
- At `D.p > 0.62` the page swaps behind the camera.
- When the camera crosses the waterline, `splash()` fires a burst of bubbles and a 1.3 s water ripple in the composite shader.

## The current tunnel (between dives)

`go()` → vortex branch in `30-pages-guide-intake.js`, visuals in `updateTunnel()` in `50-scene.js`.

**Timing:** one continuous driver, `T_IN = 2.2 s` (sine ease in), `T_HOLD = 1.0 s` at full speed (the page
swaps here), `T_OUT = 2.6 s` (sine ease out). The camera pushes forward 3 units → 0 during the exit.
New page text starts revealing 1 s into the exit.

**Layers (all children of the camera, so they stay in front of it):**

| Layer | What it is | Knobs |
| --- | --- | --- |
| `veil` | Full-screen dark blue cover | Opacity `smooth(0.12, 0.72, amt) × 0.97` |
| `tunTube` | A winding tube with moving strands of light | Strand noise in its fragment shader |
| `tunDots` / `tunLines` | 2,000 particles + 650 streaks flowing past | `speed = 4 + 62·amt²`, streak length `0.2 + 5·amt²` |
| `tunBokeh` | A few soft out-of-focus specks near the lens | `NB2`, sizes 14–40 |
| `tunGoal` | The destination light that grows as you arrive | `uSize = 50 + 650·prog³` |

**The path winds slowly:** `pcx/pcy` (and their GLSL twins in `PATH_GLSL`) bend the tunnel about once
every 10 s at full speed. Change both JS and GLSL together if you edit them.

**Colour per destination:** `TINTS` in `50-scene.js`.

**From Choose your dive:** `flyInto()` first pushes the camera forward 9 units over 1.3 s (ease in) before
the tunnel starts.

## Dive pages: stop travel (`40-dive-stops.js`)

| Knob | Where | Current | Effect |
| --- | --- | --- | --- |
| Wheel sensitivity | `nudge(d/750)` | 750 px per stop | Lower = faster |
| Touch sensitivity | `nudge(dy/430)` | 430 px per stop | Lower = faster |
| Swipe momentum | `stTouch.v*0.55` | 0.55 | Carry after lifting your finger |
| Slow-down near a stop | `near ... ? 0.75 : 1` | 75% within 0.2 of a stop | Lower = stronger catch |
| Glide speed | `Math.exp(-3.4*dt)` | 3.4 | Higher = snappier |
| Panel hides at | `> 0.22` | 0.22 stops away | |
| Panel catches at | `dist < 0.12` | 0.12 stops | |
| Pause after catching | `lockIn = now + 200` | 200 ms | Longer = harder to skip past stops |
| Settle when idle | `> 450` | 450 ms | |

Stop panels animate with CSS: `.stop .stop-in` starts at `translate3d(0,24px,-80px) rotateX(4deg)` and
eases to rest when the stop gets `.is-on` (1.6 s). Leaving adds `.is-off` (0.7 s exit).

**Themes:** `ENV` presets blend over ~1 s (`envTick`): water tint multiplier, light shaft strength,
bloom, and the CSS vignette (`--vig`).

**Forward motion:** `TRAVEL = 16 × STAGE.p` slides marine snow (`uTravel` in the snow shader), the
sunlit seabed and the abyssal props toward the camera, and adds a slow left-right yaw.

## Choose your dive and the normal-scroll pages

`flowPanels()` fades and drifts `.panel`s by their distance from the middle of the screen. On reveal,
panels get `.in`, which drives the CSS line wipes, list rules and fades.

## Reduced motion

`reduce` is true when the visitor asks for less motion. Then: transitions become instant swaps, text
effects show immediately, the scrubbed dive jumps, the tunnel is skipped, camera parallax and path yaw
are off, and continuous loops (spinning globes, dashed circles) stop. Keep this working when you add
animation: check `reduce` and provide the plain version.
