"""Smoke test for dolonia.cloud.

Checks every page loads without JavaScript errors (WebGL off, so it runs fast anywhere), nothing is wider
than a phone screen, and a dive can be scrolled from the first stop to the last.

    pip install playwright && python -m playwright install chromium
    npm run build && python3 tests/smoke.py
"""
import asyncio, pathlib, sys
from playwright.async_api import async_playwright

DIST = pathlib.Path(__file__).resolve().parent.parent / 'dist' / 'index.html'
URL = DIST.as_uri()
NO_WEBGL = "(function(){ var g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(t){ return /webgl/i.test(t) ? null : g.apply(this, arguments); }; })();"
PAGES = ['home', 'dives', 'interfaces', 'systems', 'ai', 'work']

async def main():
    failures = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(args=['--allow-file-access-from-files'], **({'executable_path': __import__('os').environ['CHROME']} if __import__('os').environ.get('CHROME') else {}))
        phone = await browser.new_context(viewport={'width': 375, 'height': 812}, is_mobile=True, has_touch=True)
        await phone.add_init_script(NO_WEBGL)
        for name in PAGES:
            page = await phone.new_page(); errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            await page.goto(f'{URL}#{name}')
            await page.wait_for_timeout(11000)
            active = await page.evaluate("document.querySelector('.page.is-active') && document.querySelector('.page.is-active').dataset.page")
            width = await page.evaluate("document.documentElement.scrollWidth")
            ok = not errors and active == name and width <= 375
            print(f"{'PASS' if ok else 'FAIL'}  #{name:<11} active={active} width={width} errors={errors[:2]}")
            if not ok: failures.append(name)
            await page.close()
        desk = await browser.new_context(viewport={'width': 1200, 'height': 760})
        await desk.add_init_script(NO_WEBGL)
        page = await desk.new_page(); errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        await page.goto(f'{URL}#interfaces'); await page.wait_for_timeout(11000)
        await page.mouse.move(600, 380); seen = set()
        total = await page.evaluate("document.querySelectorAll('.page[data-page=\"interfaces\"] .stop').length")
        for _ in range(90):
            await page.mouse.wheel(0, 120); await page.wait_for_timeout(110)
            h = await page.evaluate("location.hash")
            seen.add(int(h.split('/')[1]) if '/' in h else 0)
        ok = not errors and max(seen) == total - 1
        print(f"{'PASS' if ok else 'FAIL'}  scroll through #interfaces: reached stop {max(seen)} of {total - 1} errors={errors[:2]}")
        if not ok: failures.append('scroll')
        await browser.close()
    if failures:
        print('Failed:', ', '.join(failures)); sys.exit(1)
    print('All smoke checks passed.')

asyncio.run(main())
