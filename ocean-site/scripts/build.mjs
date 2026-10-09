#!/usr/bin/env node
/*
 * Build: stitches src/ into one self-contained page at dist/index.html.
 *
 *   src/index.html            the page skeleton, with markers the build fills in:
 *     /*@styles*\/            every file in src/styles/, in filename order
 *     @asset:NAME             src/assets/NAME as a base64 data URI (its .mime file holds the prefix)
 *     /*@engine:NAME*\/       src/js/engines/NAME, each in its own <script>
 *     /*@site*\/              every file in src/js/site/, in filename order, joined into ONE script.
 *                             The site files share one scope: 00-core.js opens an IIFE and
 *                             50-scene.js closes it, so order matters.
 *
 * No dependencies. Run:  node scripts/build.mjs
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (...p) => join(root, 'src', ...p);
const read = (p) => readFileSync(p, 'utf8');
const listSorted = (dir) => readdirSync(dir).filter((f) => !f.startsWith('.')).sort();

let html = read(src('index.html'));

const styles = listSorted(src('styles')).filter((f) => f.endsWith('.css')).map((f) => read(src('styles', f))).join('');
html = html.replace('/*@styles*/', () => styles);

html = html.replace(/@asset:([\w.-]+)/g, (_, name) => {
  const mime = read(src('assets', name + '.mime')).trim();
  return mime + ',' + readFileSync(src('assets', name)).toString('base64');
});

html = html.replace(/\/\*@engine:([\w.-]+)\*\//g, (_, name) => read(src('js', 'engines', name)));

const site = listSorted(src('js', 'site')).filter((f) => f.endsWith('.js')).map((f) => read(src('js', 'site', f))).join('');
html = html.replace('/*@site*/', () => site);

const left = html.match(/\/\*@(styles|site|engine:[\w.-]+)\*\/|@asset:[\w.-]+/g);
if (left) { console.error('Unfilled markers:', left); process.exit(1); }

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist', 'index.html'), html);
console.log(`Built dist/index.html (${(html.length / 1024).toFixed(0)} KB)`);
