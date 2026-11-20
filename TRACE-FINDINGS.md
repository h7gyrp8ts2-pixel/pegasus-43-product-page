# Trace findings

Performance traces recorded against the Next.js dev server (`npm run dev`), driving Chrome directly over the DevTools Protocol (via Puppeteer, since no Chrome DevTools MCP server was available in-session — same underlying engine and trace format).

**Conditions, held constant across all three experiments:**
- Viewport: 375 × 812 CSS px, 3x device pixel ratio, mobile mode on
- Network: Slow 4G — 150ms round-trip latency, 1638.4 Kbps down / 750 Kbps up
- CPU: 4x slowdown
- Target element: the size grid (addressed via `.grid.grid-cols-5` — the page has no `data-testid="size-grid"` attribute, so no code was added solely to satisfy that selector)
- Each experiment was run twice to confirm determinism, and cross-checked against both the `layout-shift` PerformanceObserver API and the raw Chrome trace file's `LayoutShift` events.

## Experiment 1 — baseline (inline SVG photo placeholder)

- Grid laid out once at **~713-725ms**, position `top: 521px`.
- Never moves again through `window.load` (~5.0-5.1s) or 3-6s of settle time.
- 0 layout-shift events (PerformanceObserver and raw trace both empty).

## Experiment 2 — real product photo, fixed aspect-ratio box, `priority` load

Change: replaced the SVG placeholder with `next/image`, in a container sized by `style={{ aspectRatio: "1872 / 2340" }}` (the photo's native ratio) and the `priority` prop (eager, high fetch-priority, no lazy loading).

- Grid laid out once at **~730-736ms**, position `top: 614.75px` (93.75px lower than experiment 1 — exactly the extra height of the taller aspect-ratio box vs. the old fixed 375px box; expected, not a shift).
- Image element found in DOM at ~590-600ms (`complete: false`); its `load` event fires at **~1.79-1.81s** once the throttled download finishes.
- Grid position is identical before and after the image's `load` event — the space was already fully reserved by the aspect-ratio box, so the image appearing is a pure repaint, not a reflow.
- 0 layout-shift events (PerformanceObserver and raw trace both empty), across 2 runs.

## Experiment 3 — price line: real font, preloaded + size-matched fallback, fixed height

Change: the price previously rendered in plain system Arial — `globals.css`'s `body { font-family: Arial, Helvetica, sans-serif; }` silently overrode the unused `--font-geist-sans` variable, so experiments 1-2 never actually exercised a text font-swap. Added `font-sans` (→ Geist Sans) and a fixed `h-6 leading-6` (24px) box to the price `<p>`.

Verified before tracing:
- Price (`$140.00`) is present in the raw first-response SSR HTML.
- Next emits `font` preload hints for 2 `.woff2` files in that same first response.
- Generated CSS defines a `"Geist Fallback"` `@font-face` with `ascent-override: 95.94%`, `descent-override: 28.16%`, `size-adjust: 104.76%`, `line-gap-override: 0.0%` — Next's automatic size-matched fallback metrics.

Trace result:
- Grid laid out once at **~732-737ms**, same position (`top: 614.75px`) as experiment 2.
- `document.fonts` fires `loadingdone` at **~997-1003ms** (confirms the real Geist Sans file is actually being fetched and parsed now, not skipped).
- Grid position is unchanged before and after the font swap, the image load (~1.79-1.81s), and full `window.load` (~5.4-5.6s).
- 0 layout-shift events (PerformanceObserver and raw trace both empty), across 2 runs.

## Summary

Across all three experiments (6 total throttled runs), the size grid moves **0px**. The fixed-height photo box, `priority`-loaded image, and preloaded/fallback-matched/fixed-height price line each reserve their final space before first paint, so nothing downstream ever has to push the grid around.

## Known gaps / follow-ups

- All numbers above are from `next dev`, not a production build (`next build && next start`) — dev mode compiles on first request and ships more JS, so load-event timing is pessimistic relative to production.
- The product photo's committed source file (`public/images/pegasus-43.jpg`, 354KB) is larger than it needs to be; `next/image` serves a much smaller optimized version (~51KB at 1080w/q75) so this doesn't affect what ships to the browser, but the source should still be compressed before more images are added.
- The photo is a **Nike Pegasus 42 SE** stock photo (not the actual Pegasus 43, and a different colorway than the stock JSON's "Black/White-Volt") used as an explicitly-approved visual stand-in — see PROMPT-NOTES.md and README.md.
