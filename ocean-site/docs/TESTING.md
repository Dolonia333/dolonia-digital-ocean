# Testing

## Manual pass (10 minutes)

1. **Loader:** dial, telemetry and legal lines match the reference; no big dots; logo hidden until it opens.
2. **Surface:** scroll or swipe a little and let go: it floats back. Scroll more: it dives, bubbles at the
   waterline, the school forms from particles, *Choose your dive* writes itself in.
3. **Choose your dive:** zig-zag layout, glass orbs, currents drifting, no depth readout.
4. **Each dive:** scroll slowly through every stop: the camera glides, catches each stop, text animates
   in and out, nothing blocks you. Check the quiz, the slider, the narration Skip, a spotlight modal,
   the side links at the end.
5. **Tunnel:** move between dives through the end-frame links and the menu.
6. **Creatures:** jellyfish follows and opens the guide when tapped; anglerfish stalks and strikes within a
   couple of minutes; mantas loop; seabed slides past on Interfaces.
7. **Form:** all three steps, validation messages, submission path; it only scrolls vertically on a phone.
8. **Reduced motion:** turn on the OS setting and repeat 2–5; everything should still work, calmly.

Test in at least: iPhone Safari, Android Chrome, desktop Chrome, desktop Safari or Firefox.

## Automated smoke test

`tests/smoke.py` (Python + Playwright) loads every page with and without WebGL, checks for JavaScript
errors, checks nothing is wider than the screen on a phone, and scrolls through a dive.

```bash
pip install playwright && python -m playwright install chromium
npm run build && npm test
```

Software rendering in CI is slow (a few frames per second), so the test checks logic, layout and errors,
not smoothness. Judge motion on real devices.

## Debug helpers

- Deep links: `#interfaces/4` opens a stop directly.
- In the console, the scene is inside a closure. For debugging, temporarily expose what you need, e.g.
  add `window.__S = STAGE;` after `STAGE` is defined in `40-dive-stops.js`, then remove it.
