# dolonia.cloud

An interactive 3D underwater website for **Dolonia Data Tech Solutions** (a DBA of 1921 Holding Co. LLC).
Visitors dive from the ocean surface down through four depth zones. Each zone is one part of what Dolonia
builds, and each has its own sea life: a blue blubber jellyfish guide, schooling mackerel, lanternfish,
a hunting anglerfish, manta rays and an abyssal seafloor.

The design follows Blue Marine Foundation's *The Sea We Breathe*: the same loader, HUD, journeys menu,
current-tunnel transitions and stop-by-stop camera travel. The content is Dolonia's.

> Everything ships as **one self-contained HTML file** (`dist/index.html`, about 380 KB). The only
> external request is Three.js r128 from cdnjs plus Google Fonts.

---

## Quick start (2 minutes)

```bash
node --version          # needs Node 18 or newer, no npm install required
npm run build           # src/ -> dist/index.html
npm run serve           # http://localhost:8080
```

Open `http://localhost:8080`. Edit anything in `src/`, run `npm run build`, refresh.

Useful URLs while working:

| URL | Goes straight to |
| --- | --- |
| `/#home` | The surface |
| `/#dives` | Choose your dive (journeys menu) |
| `/#interfaces` | Dive 1, first stop |
| `/#systems/3` | Dive 2, stop 4 (stops count from 0) |
| `/#ai` | Dive 3, the anglerfish |
| `/#work/3` | The intake form |

---

## Where things live

```
src/
  index.html                  Page skeleton: loader, HUD, menu, every page's HTML, the guide, modals
  styles/                     CSS, concatenated in filename order
    00-base.css               Tokens (colours, fonts, easings), resets, body type
    10-intro-loading-dial.css The loader: dial, telemetry, legal lines
    20-buttons.css            Corner-bracket buttons
    30-hud.css / 40-…css      Header, depth readout, sound button, menu, edges
    50-pages.css              Home, journeys menu, panels, lists, steps, stats
    60-intake-form.css        The three-step intake form
    70-the-jellyfish-guide.css The chat guide
    80-dive-stops.css         Dive pages: stops, panel types, progress path, prompt, modals
  assets/                     logo.png, favicon.png (inlined as data URIs at build time)
  js/
    engines/                  Self-contained 3D modules, each exposes one create* function
      jellyfish.js            createBlubber (the jellyfish), createBloom (glow post-processing)
      ocean.js                createSurface (sky dome + Gerstner-wave ocean)
      fish-school.js          createSchool (mackerel, lanternfish; boids + particle formation)
      anglerfish.js           createAngler, createShrimp
      sea-life.js             createExtras (mantas, sardines, comb jellies, whale, Atolla, seafloors)
    site/                     The site itself. ONE shared scope, concatenated in order
      00-core.js              Opens the IIFE. Depth model (PAGE), depth/temperature HUD readout
      10-motion-and-loader.js Easing, tween, scramble, flicker; the loader sequence
      20-sound.js             Generated ambient sound, whoosh, button ticks
      30-pages-guide-intake.js Text effects, page router + transitions, home dive, menu, intake, guide
      40-dive-stops.js        Dive pages: stop travel, panel types, quiz, narration, modals, globe
      50-scene.js             WebGL scene, all creatures, the current tunnel, input, render loop. Closes the IIFE
scripts/
  build.mjs                   Stitches src/ into dist/index.html (no dependencies)
  serve.mjs                   Local static server
dist/index.html               The built site. Deploy this one file
docs/                         How everything works (start with ARCHITECTURE.md)
tests/smoke.py                Headless smoke test (Playwright)
```

## Documentation

| Doc | Read it when you want to… |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Understand how the pieces fit: build, scope, render loop, page router, depth model |
| [docs/PAGES-AND-CONTENT.md](docs/PAGES-AND-CONTENT.md) | Change copy, add a stop, add a dive, edit the FAQ, the intake form or spotlights |
| [docs/ANIMATION-AND-TRANSITIONS.md](docs/ANIMATION-AND-TRANSITIONS.md) | Change the loader, the dive, the current tunnel, stop travel or text effects |
| [docs/CREATURES.md](docs/CREATURES.md) | Tune or add sea life: the research behind each animal and every knob |
| [docs/HUD-AND-UI.md](docs/HUD-AND-UI.md) | Work on the HUD, menu, sound, guide chat, modals, progress path |
| [docs/TEMPLATE.md](docs/TEMPLATE.md) | Reuse this as a template for a different brand or story |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Ship it, wire the intake form to n8n/Supabase, give the guide AI answers |
| [docs/TESTING.md](docs/TESTING.md) | Check changes on desktop, phone and without WebGL |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Work on it as a team: branches, conventions, review checklist |

## Rules of thumb

1. **Edit `src/`, never `dist/`.** `dist/index.html` is overwritten by every build.
2. **Site files share one scope.** A `var` in `00-core.js` is visible in `50-scene.js`. Keep the numeric order.
3. **Match the reference.** New features should look like something *The Sea We Breathe* would do. If it
   wouldn't, ask first.
4. **Test on a phone.** Most visitors are on mobile; the scene drops quality there automatically (see `small`).
5. **Respect reduced motion.** Everything checks `reduce` (the `prefers-reduced-motion` setting).

## Owner

Zion Van Zandt, Dolonia Data Tech Solutions: zionvanzandt@gmail.com, (405) 937-9610
