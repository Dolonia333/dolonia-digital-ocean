# Pages and content

Everything a visitor reads lives in `src/index.html`. This guide shows where each piece is and how to
change it without breaking the motion around it.

## Page map

| Hash | `<section data-page>` | What's on it |
| --- | --- | --- |
| `#home` | `home` | Hero title, subline, Dive in / Book a call |
| `#dives` | `dives` | "Choose your dive" title, intro, three dive cards in a zig-zag |
| `#interfaces` | `interfaces` | Dive 1, sunlight zone: 8 stops |
| `#systems` | `systems` | Dive 2, twilight zone: 7 stops |
| `#ai` | `ai` | Dive 3, midnight zone: 6 stops |
| `#work` | `work` | Process, federal details, glass sponge, intake form: 4 stops |

The menu (`<nav class="menu">`) lists the same pages; keep it in sync when you add or rename one.

## Editing copy

- **Headlines** use two lines inside `.line` spans so they can wipe up line by line:
  ```html
  <h2 class="st-title"><span class="line"><span class="outline">The part your</span></span><span class="line"><span class="solid-ui">customers touch</span></span></h2>
  ```
  `outline` = hollow letters, `solid-ui` = light cyan, plain = white. Keep each line short (under ~16 characters on phones).
- **Paragraphs** with class `wl` wipe in line by line; `rot` rotate in line by line. Plain text only
  inside them (the effect re-flows the words; inline tags are restored afterwards, but keep them simple).
- **Statements** (`<p class="statement">`) shuffle in letter by letter. One sentence, under ~70 characters.
- **Small labels** with class `scr` scramble in (kickers, "Here's a fact", species Latin names).

Copy rules the site follows: sentence case in body text, no exclamation marks, no unverified numbers.
Every statistic on the site is either Dolonia's own (the two-day storefront demo, federal identifiers)
or comes from published research (creature facts).

## Dive pages are made of stops

Each stop is one screen the camera travels to:

```html
<div class="stop" data-type="fact" data-side="left" data-env="teal" data-loc="Sunlight zone">
  <div class="stop-in fact"> … </div>
</div>
```

| Attribute | Values | Effect |
| --- | --- | --- |
| `data-type` | `title`, `statement`, `textimage`, `fact`, `species`, `slider`, `quiz`, `narrated`, `end`, `contact` | Which entrance animation and behaviour runs (see below) |
| `data-side` | `left`, `right`, `center` | Where the panel sits. The jellyfish moves to the opposite side |
| `data-env` | `bright`, `teal`, `dusk`, `dark`, `abyss` | Water theme while this stop is showing (`ENV` in `40-dive-stops.js`) |
| `data-loc` | any text | Location name in the HUD while this stop is showing |
| `data-answer` | `0`–`3` | Quiz only: index of the correct button |
| `id` | e.g. `contact` | Lets links jump straight to a stop: `data-go="work" data-to="contact"` |

### Stop types and their markup

| Type | Inner pieces | Notes |
| --- | --- | --- |
| `title` | `.back`, `.kicker.scr`, `h2.st-title`, `p.wl.lead` | First stop of a dive |
| `statement` | `p.statement` | Big centred sentence |
| `textimage` | `.ti` grid → `.ti-text` (`.mk`, `h3.h-wipe`, `p.rot`, optional `button.cut[data-modal]`) + `figure.card` (an `<svg>` illustration + `figcaption.cap[data-scramble]`) | Add `.rev` to `.ti` to put the card on the left |
| `fact` | `svg.ring` + `.sub.scr` + `h3.big.h-wipe` (wrap the key phrase in `<em>` to tint it) | Ring draws itself |
| `species` | `svg.ring` + Latin name `.sub.scr` + `h3.big.h-wipe` + `.depthbar span` + `p.rot` | For the animals on screen |
| `slider` | `.ba-frame` with `.ba-before` svg, `.ba-after` div, `.ba-handle` | Drag to compare. Releasing past 90% glides to the end |
| `quiz` | `.qz` with four `<button>`s + `p.qz-out` | Set `data-answer` on the stop |
| `narrated` | several `p.narr-line` + `button.narr-skip` | Lines play one at a time; words light up; read aloud when sound is on |
| `end` | `.end` (`h3.end-t`, `ul.points` of three `li`, `.actions`) + two `a.side-dive.left/.right` | Last stop of a dive |
| `contact` | `.contact.stop-scroll` | Scrolls inside itself. Only one per site is expected |

Card illustrations are inline SVG mock-ups (320×210 viewBox). To use a real screenshot, replace the
`<svg>` with `<img src="@asset:yourfile.png" alt="">` and add the PNG and a `.mime` file to `src/assets/`
(copy `logo.png.mime`).

### Add a stop

1. Copy an existing stop of the type you want into the dive's `.content`, in the order you want it.
2. Change the copy and the `data-*` attributes.
3. Rebuild. The progress path, discovery percentage and camera spacing adjust automatically, because
   the camera range `y0 → y1` is divided evenly between however many stops there are.

### Add a whole dive

1. **Depth:** add an entry to `PAGE` in `src/js/site/00-core.js`, e.g. `security:{ y0:-58, y1:-70, dive:true, stage:true }`,
   and shift neighbouring ranges so they don't overlap.
2. **HTML:** copy a `<section class="page stage" data-page="…">` block in `src/index.html`.
3. **Menu:** add a link in `<nav class="menu">`.
4. **Journeys menu:** add a `.dive` card on the `dives` page (the zig-zag CSS handles 3 cards; for 4,
   adjust `.dive:nth-child(n)` rules in `50-pages.css`).
5. **Tunnel colour:** add the page to `TINTS` in `50-scene.js`.
6. **Animals:** add it to `ZONE` (schools / anglerfish) and `ZONE2` (sea-life extras) in `50-scene.js`.
7. **Guide:** add it to `GPAGES` in `30-pages-guide-intake.js` so answers can link to it.

## Choose your dive (journeys menu)

Each card:
```html
<div class="dive fade">
  <span class="orb" aria-hidden="true"><svg viewBox="0 0 24 24">…</svg></span>
  <h3><span>The part your</span> <span>customers touch</span></h3>
  <a class="cut" href="#interfaces" data-go="interfaces" aria-label="Dive in: …"><span class="fill"></span>Dive in</a>
</div>
```
The orb icons are 24×24 line icons (stroke only).

## Project spotlights (modals)

Spotlights are `<template id="m-…">` blocks near the top of `<body>`. Any element with
`data-modal="m-storefront"` opens the matching template. Inside a template you can use:

- `.m-title` with two `<span>`s (wipe in), `.m-copy` paragraphs (rotate in), `.m-stats` (`dt`/`dd`, numbers scramble),
- a `.carousel` with SVGs or images inside `.car-track` and prev/next buttons,
- or `.m-globe` with `<canvas class="m-globe-c">`, which draws a wireframe globe marking Oklahoma City.

## The jellyfish guide

In `30-pages-guide-intake.js`:

- `KB` is the built-in FAQ. Each entry: `k` (keywords that score a match), `q` (the question as a chip),
  `a` (the answer), optional `go` (a page id, or `contact`, for the "Take me to…" button).
- `CHIPS` picks which `KB` entries appear as one-tap questions.
- `FACTS` is generated from `KB` and is the only knowledge the AI is allowed to use. **Anything you add
  to `KB` becomes something the AI can say.** Keep it true.
- When the AI isn't available (outside claude.ai, or permission declined) `localAnswer()` scores keywords
  and falls back to "I don't have that one…" with an intake-form button.

## The intake form

Markup: `#intake` in the `work` page. Logic: the intake block in `30-pages-guide-intake.js`.

- Three steps (`.ik-step[data-step]`), validated by `check(n)`. Required fields are marked by `data-req`.
- To add a field: add the markup in the right step, read it in the `data` object in the submit handler,
  and if required add a rule to `check()`.
- Submission: `INTAKE_ENDPOINT` (empty by default) receives a JSON POST. While it's empty, the form opens
  the visitor's email app with everything filled in. See DEPLOY.md to wire it to n8n or Supabase.
- A hidden honeypot field (`name="website"`) silently drops bots.

## Legal and identity text

- Loader corner: `.intro .legal` spans (`data-text` is what scrambles in).
- Work page footer: `.foot`.
- Federal identifiers: the `work` page stats stop and the `m-federal` template. Update both together.
