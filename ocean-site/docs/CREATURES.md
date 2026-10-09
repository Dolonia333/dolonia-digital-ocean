# Creatures

Every animal is built in code (no 3D model files): geometry from math, shading in GLSL, motion from
research. Each section lists where it lives, what it's based on, and the numbers to tune.

General pattern for every engine:

```js
var thing = createThing(THREE, { quality: small ? 'low' : 'high', pixelRatio: PR });
scene.add(thing.group);            // or .root
// each frame:
thing.update(dt, clock, …);        // returns false when fully hidden, so callers can skip work
```

Which animals appear where is decided by `creaturesFor(page)` and the `ZONE` / `ZONE2` maps in
`50-scene.js`.

| Zone | Pages | Animals |
| --- | --- | --- |
| Sunlight | `dives`, `interfaces` | Jellyfish guide, Atlantic mackerel school, manta rays, sardine ball, sunlit seabed (Interfaces only) |
| Twilight | `systems` | Lanternfish school, comb jellies, distant sperm whale |
| Midnight | `ai` | Humpback anglerfish, lanternfish prey, deep-sea shrimp, Atolla jellyfish |
| Abyssal plain | `work` | Seafloor with glass sponges, sea pens, brittle stars |

---

## Blue blubber jellyfish (the guide), `engines/jellyfish.js` → `createBlubber`

**Species:** *Catostylus mosaicus*. Research used: Dawson 2005 (morphology); Neil & Askew 2018,
*Journal of Experimental Biology* (swimming).

**Anatomy built:** a sub-hemispherical bell (height ≈ 60% of diameter) with a finely granulated top
(procedural cell texture); 112 velar lappets around the margin (14 per octant, `NL = 112`); 8 rhopalia
(tiny glowing sense organs); visible radial canals and the stomach cross through the bell; **no
tentacles**; 8 three-winged, cauliflower-textured oral arms in 4 pairs (`initArms`, `stepArms`), each a
parametric surface along a 7-node Verlet chain so the arms trail and swing; 4 glassy oral pillars.

**Motion:** `contraction(phase)`: a quick squeeze (~34% of the cycle) and an elastic rebound, with ±14%
cycle-to-cycle jitter. `period` (0.95 s here) sets the pulse. Each contraction pushes it forward and
blows the arms back. `startle(k)` makes a fast burst; turning starts from one side of the bell
(`uAsym`, `uTurn`).

**Interaction (in `50-scene.js`):** click/tap the jellyfish to open the guide; drag to spin it; tap the
water to drop plankton that drifts into its arms (`spawnFood`, `updateFood`).

**Knobs:** `JSCALE` (1.8 desktop, 1.05 phone), `targetX/targetY` (where it sits per page/stop),
`deepA/deepB` (glow colours with depth), `J.uniforms.uGlow`.

Also in this file: `createBloom`, the glow post-processing (bright-pass, blur, composite with grading,
vignette, water ripple `warp`, zoom blur `radial`, colour split `chroma`).

---

## Atlantic mackerel and lanternfish, `engines/fish-school.js` → `createSchool`

One engine, two species (`opts.species = 'lantern'` switches shape, colours and behaviour).

**Mackerel body:** a fusiform body (34 rings × 18 segments on desktop), pointed snout, thin caudal
peduncle; deeply forked tail; two dorsal fins, anal fin, pectorals and five finlets.
**Shading:** silver flanks act as mirrors of the water column (`envAt(reflect(...))`) so they flash as fish
turn; wavy dark "tiger" bars on the back; a lateral line; eyes; caustic light on backs in shallow water;
fine scale shimmer up close; blue water extinction with distance (`uExt`); darker fish inside the school
(`aOcc`).

**Swimming (vertex shader):** a carangiform body wave: amplitude envelope `A(z) = 0.02 − 0.0825z + 0.1625z²`
(smallest just behind the head, largest at the tail, the published mackerel curve), wavelength 0.95 body
lengths. Tail-beat frequency comes from the Strouhal relation `St = f·A/U ≈ 0.25` with tail amplitude
≈ 0.2 body lengths, so faster fish beat faster, not wider. Turning bends the body (`aBend`) and banks it.

**Schooling (CPU, `steer`):** each fish follows its **7 nearest neighbours** (topological, not a radius);
alignment is the strongest pull; repulsion inside ~0.55 body lengths; only **16% "informed" fish** steer
toward the goal, the rest follow, which makes turns ripple through the school. Each fish has its own
cruising speed; a fast cursor pass triggers a fast-start escape (`panic`).

**Particle formation:** `form(center)` swirls a particle cloud in and settles each particle onto a point
on its fish, then fades the fish in, the "particles become a school" effect from the reference.

**Lanternfish:** blunter, darker body with big eyes, rows of glowing blue photophores (light organs) on
the belly and lower flank, looser spacing, slower cruise.

**Prey features (used by the anglerfish):** `state.attract = {p, r, k}` draws fish toward a light;
`capture(i, fn)` sucks fish `i` toward `fn()` and hides it; eaten fish respawn at the edge after 4–9 s.

**Knobs:** `count`, `perFish` (formation particles), `setBox(cy, cx)`, `setBoxSize(hx, hy, hz)`; cruise
speed and repulsion near the top of `steer`.

---

## Humpback anglerfish, `engines/anglerfish.js` → `createAngler`

**Species:** female *Melanocetus johnsonii*. Sources: Wikipedia (Humpback anglerfish, Anglerfish, Esca),
FishBase summary 2292, Luck & Pietsch 2008 *Copeia* (in-situ ROV observations of a ceratioid anglerfish),
and deep-water observations of *Lophius piscatorius* (hunting behaviour).

**Anatomy built:**
- Short, globular body with a humped back and a soft, deep belly (the distensible stomach).
- A huge head with a nearly vertical mouth; the lower jaw projects and hinges open (`uJaw`). The mouth
  opens into a real gap (fragments between the jaws are discarded), dark red inside.
- Long, slender fangs that curve inward and back (two rows, `NU = 15` per side on desktop).
- Tiny eyes; smooth, velvety dark skin with minute spinules (normal noise), a gill opening behind each
  pectoral, a faint row of lateral-line pores.
- One dorsal fin far back above a small anal fin; small rounded pectorals; rounded tail; no pelvic fins.
- The illicium (fishing rod) is about half the body length, ending in a glowing esca with dark crests.
  The esca is the scene's only light for her: skin, teeth, nearby marine snow and prey are lit by it.

**Behaviour (`update`), from the in-situ footage:**

| Mode | What she does | Trigger |
| --- | --- | --- |
| `drift` | Hangs passively, slowly tilting and rolling to odd angles | Default |
| `swim` | Slow intermittent swims, ~0.24 body lengths/s, pectorals beating in phase, a small surge each stroke | Every 5–12 s |
| `stalk` | Freezes, rights herself, faces the prey, raises the dorsal fin, breathes slower, casts the lure (harder the closer the prey) | Fish or shrimp within 2.4 body lengths |
| strike | Jaw opens in 0.05 s, lunge, closes over 0.35 s; then a gulp bulge travels down the throat and the belly swells | Prey near the lure or mouth (checked in `50-scene.js`) |
| `flee` | Bolts with hard tail beats, then settles | Cursor rushing at her body |

**Soft-body motion:** turning, pitch and roll are damped springs (slight overshoot); the body bends into
turns (`uBend`) and a wave runs to the tail (`uWave`); the belly jiggles (`uJiggle`); the rod swings on
its own spring (`rodA`, `rodB`) and the esca twitches to mimic prey.

**Knobs:** `root.scale` (2.6 desktop, 1.7 phone); `region` in `50-scene.js` (her patch of water);
`detectR`; spring constants `kY`, `kP`; strike timing in the `snapT` block; `uLureCol` (lure colour).

## Deep-sea shrimp, `engines/anglerfish.js` → `createShrimp`

Pandalid-style shrimp, the anglerfish's most common recorded prey: arched segmented body, forward
rostrum, tail fan, paddling swimmerets, walking legs and very long antennae. Red pigment reads black in
the deep, so they're only visible where the lure lights them. They drift toward the light and tail-flip
backward when a strike happens nearby (`startle`). Same `available/capture` API as fish.

---

## Sea life extras, `engines/sea-life.js` → `createExtras`

`setZone(zone, shelfOn)` fades groups in and out; `update(dt, time, camY, travel)` animates them.

### Giant manta ray (*Mobula birostris*)

Sources: Wikipedia (Manta ray), Springer *Marine Biodiversity Records* (giant manta identification),
Fish et al. (manta swimming kinematics), MDPI *Aerospace* 2016 (manta propulsion review).

- **Shape:** diamond disc ~2.4× wider than long; highly tapered, swept, falcate wings; rolled cephalic
  fins either side of a wide terminal mouth; eyes on the sides of the head; five pairs of ventral gill
  slits; short whip tail with a small dorsal fin.
- **Markings:** black above with two right-angled white shoulder patches leaving a dark "T"; white below
  with dark spots on the lower abdomen, charcoal trailing edges and a dark mouth.
- **Stroke:** ~0.3 strokes/s (`uFreq`), tip-to-tip height ~0.74 body lengths (`uAmp`), quicker downstroke
  (`stroke()` skew), waves running out along the span and back along the chord (lag measured in real
  chord length so thin tips bend instead of twisting), body nearly level.
- **Path:** long lazy loops with banking turns and gentle pitch.

### Others

| Animal | Look | Motion |
| --- | --- | --- |
| Sardine bait ball | 520 tiny silver fish | Swirl around a moving centre, each with its own speed and radius |
| Comb jellies | Clear ovals with 8 comb rows | Rainbow light travelling along the rows; slow drift and tumble |
| Sperm whale | Huge square-headed silhouette, far off | Crosses the background slowly; tail flukes beat |
| Atolla jellyfish | Deep red bell, one long trailing tentacle | A blue ring of light chasing around the bell (its "burglar alarm" display) |
| Sunlit seabed (Interfaces) | Sand with moving caustics and ripples, ~2,600 seagrass blades in clumps, mossy rocks, starfish | Slides toward the camera with `travel`; grass sways |
| Abyssal floor (Work) | Dark sand, lattice glass sponges, sea pens, brittle stars | Props drift past with `travel`; sea pens sway, brittle stars crawl |

---

## Adding a new animal

1. Write `createX(THREE, opts)` in a new file under `src/js/engines/` (or inside `sea-life.js` if it's
   small). Return `{ group, update(dt, time, …) }`. Build geometry once; animate in the vertex shader;
   keep per-frame CPU work small.
2. Add a `<script>/*@engine:x.js*/</script>` line in `src/index.html` before the site script.
3. In `50-scene.js`: create it, `scene.add(...)`, call `update` in `frame()`, show/hide it in
   `creaturesFor`, and hide it when `covered` (the tunnel hides the scene).
4. Use the water colour for fog (`fogIt`, `uFog`) so it sits in the water instead of floating on top.
5. Research first: shape, colour, how it moves (frequency, amplitude), where it lives. Put the sources in
   a comment at the top of its code and in this file.
