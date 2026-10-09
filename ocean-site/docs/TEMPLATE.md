# Using this as a template

The engine (loader, HUD, router, tunnel, stop travel, creatures) is separate from the content, so a new
site mostly means new copy, colours and animals.

## Swap list

| What | Where |
| --- | --- |
| Brand name, title, meta description | `src/index.html` `<head>` |
| Logo and favicon | Replace `src/assets/logo.png` and `favicon.png` (keep the `.mime` files) |
| Colours | Tokens at the top of `src/styles/00-base.css` (`--navy`, `--deep`, `--ink`, `--soft`, `--ui`, `--light`); tunnel colours `TINTS` in `50-scene.js`; water colours `stops` in `bgAt` |
| Fonts | The Google Fonts link in `<head>` and `--display`, `--body`, `--hud` in `00-base.css` |
| Loader text | `.telemetry li` `data-*` attributes, `.intro .legal` spans |
| Pages | Sections in `src/index.html` + `PAGE` depths in `00-core.js` + menu links. See PAGES-AND-CONTENT.md |
| Stops | Copy stop blocks; every type is documented in PAGES-AND-CONTENT.md |
| Guide knowledge | `KB`, `CHIPS`, `GPAGES` in `30-pages-guide-intake.js`, plus the instruction text in `ask()` |
| Intake form | Markup in `#intake`, validation in `check()`, `INTAKE_ENDPOINT` |
| Animals | `ZONE`, `ZONE2`, `creaturesFor` in `50-scene.js`; engines in `src/js/engines/` |
| Legal/footer | `.foot` and the federal stats stop |

## Starting a new project from this repo

```bash
git clone <this repo> my-new-site && cd my-new-site
rm -rf .git && git init
# 1. swap the items above   2. npm run dev   3. test on a phone   4. deploy dist/index.html
```

## What makes it feel like the reference (keep these)

1. Every arrival eases out (`expo-out`); nothing pops in all at once (lines, words or letters are staggered).
2. Text only appears at stops; between stops you just travel.
3. Something always moves close to the camera when travelling (particles, seabed, props).
4. The HUD is quiet: small, wide, letter-spaced, light blue on dark.
5. Transitions carry you somewhere: the current tunnel ends at a light.
6. Animals are researched, not invented: shape, colour and movement from real sources.
