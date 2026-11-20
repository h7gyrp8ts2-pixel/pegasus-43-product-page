# Prompt notes

The exact prompts used to build and iterate on this page, in order.

## 1. Initial build

> Create a Next.js app in this folder and build a phone product page for the Nike Pegasus 43, 375 px wide.
>
> Use only the data in nike_pegasus_size_stock.json. Don't invent any values.
>
> Page order: photo in a fixed-height box, shoe name with price and colorway, size buttons, tech copy, reviews.
>
> Size buttons: one for each of the 26 sizes, 44 × 44 px, sorted by display_order, each showing its size_label. In-stock sizes are normal and tappable. Low-stock sizes get a small "Few left" marker. Sold-out sizes are greyed out and not tappable, but keep their place so no other button moves.
>
> Add a full-width "Add to bag" button fixed to the bottom of the screen, disabled until a size is selected, with space below the reviews so nothing is hidden behind it.
>
> When it's done, start the dev server and tell me the link to open it in my browser.

## 2. Baseline performance trace

> Start the Next.js dev server if it isn't running. Then use Chrome DevTools MCP to record a performance trace of the Pegasus 43 shoe page, from first paint to fully loaded.
>
> Phone screen: 375 x 812 CSS px viewport, 3x pixel density, mobile on.
> Network and CPU: throttle to Slow 4G with 150 ms round trip and 1638.4 Kbps, plus a 4x CPU slowdown.
>
> Hand back: each element that moves the element with data-testid="size-grid", how many px it moves the grid, and when in the load it happens. Don't change any code yet.

## 3. Real photo + aspect-ratio box

> Right now the photo is a placeholder with an inline SVG. Swap in the real Pegasus 43 photo as an image, give it a fixed aspect-ratio box so its space is held before it loads, and load it early (priority). Then record the same Slow 4G, 4x CPU trace again and tell me how far the element with data-testid="size-grid" moves, if at all.

## 4. Price line + font

> Now do the same for the price and its font. Check that the price is in the first server response, the font is preloaded with a size-matched fallback, and the price line has a fixed height. Then record the same Slow 4G, 4x CPU trace again and tell me how far the element with data-testid="size-grid" moves, if at all.

## 5. Repo audit

> Check that the repo nike-pegasus-phone-page contains speed-budget.json, my trace findings and my prompt notes. If anything is missing or not yet committed, add it, commit and push. Then give me the repo link.

(The repo is actually named `pegasus-43-product-page` — confirmed with the user, who meant this repo.)

---

Two decisions made along the way, confirmed with the user rather than assumed:

- **No Chrome DevTools MCP server was configured in-session.** Performance traces (prompts 2-4) were instead recorded by driving Chrome directly over the DevTools Protocol with Puppeteer — same engine, same trace format.
- **The product photo** resolves to a **Nike Pegasus 42 SE** image (not the Pegasus 43, and a different colorway than the stock JSON) sourced from Nike's own CDN via a Google Images link the user provided. The user explicitly chose to use it anyway as a visual stand-in, after being flagged on both the copyright provenance and the model mismatch.
