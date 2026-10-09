# Contributing

## Setup

```bash
git clone <repo> && cd dolonia-cloud
npm run dev            # build + serve on http://localhost:8080
```

No dependencies to install for building. Python + Playwright only for `npm test`.

## Workflow

1. Branch from `main`: `feature/short-name` or `fix/short-name`.
2. Change files in `src/` only. Run `npm run build` and check in the browser (desktop **and** phone width).
3. Commit **both** `src/` and the rebuilt `dist/index.html`, so `main` is always deployable.
4. Open a pull request using the checklist below. Include a screenshot or short screen recording for anything visual.

## Pull request checklist

- [ ] Built with `npm run build`; `dist/index.html` committed.
- [ ] `npm test` passes (no JS errors, no sideways overflow on phones).
- [ ] Looked at it on a real phone (or at least 375 px wide).
- [ ] Works with reduced motion turned on.
- [ ] Matches the reference's style (see TEMPLATE.md, "What makes it feel like the reference").
- [ ] New facts or numbers are true and sourced (creature research goes in CREATURES.md).
- [ ] Docs updated if you changed how something works.

## Code conventions

- **Plain ES5-style JavaScript in `src/js/site/`** (`var`, function declarations), matching the existing code.
  The site files are concatenated into one closure; don't add `import`/`export` there.
- **Engines are self-contained:** one `createX(THREE, opts)` per creature, attached to `window`, no
  reaching into site variables. The site passes everything they need.
- **Every per-frame function takes `dt`** and uses `1 - Math.exp(-k*dt)` for smoothing, so motion is
  frame-rate independent.
- **No allocations in hot loops:** reuse `THREE.Vector3`s declared outside `frame()`.
- **Respect `small` and `reduce`.**
- **CSS:** add to the file for that area; use the tokens in `00-base.css`; no text shadows (use the
  soft dark pools behind text).
- **Comments explain why** (the research, the reference), not what the line does.

## Dormant code (safe to remove, or revive)

These are switched off but still in the source:

| What | Where | State |
| --- | --- | --- |
| "Dive in with sound" start screen | `askSound()` in `10-motion-and-loader.js`, `.sound-card` CSS | Not called |
| Interactive problems (thermometer, hold, dial) with HUD threat mode | `setupProblem`, `solveProblem`, `lockedLimit` in `40-dive-stops.js`; `.prob`, `.therm`, `.hold`, `.pdial` CSS | No `data-type="problem"` stops remain |
| 3D icons on Choose your dive | `iconOf`, `updateIcons` in `50-scene.js` | Built but never shown (`want = 0`) |
| Scroll-linked panel flow | `flowPanels` | Only affects pages with `.panel`s (home, dives) |

Remove them in their own PR if you want a leaner template.

## Who to ask

Zion Van Zandt (owner): zionvanzandt@gmail.com
