# Pegasus 43 Product Page

A 375 px phone product page for the Nike Pegasus 43, built in Next.js.

## Build prompt

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

The "Why we love it" copy and sample reviews are placeholder content — they aren't in `nike_pegasus_size_stock.json`, which only covers size and stock data.

The product photo (`public/images/pegasus-43.jpg`) is a **Nike Pegasus 42 SE** stock photo, not the actual Pegasus 43, and a different colorway than this page's "Black/White-Volt". It's sourced from Nike's own CDN (`static.nike.com`) and used here as an explicitly-approved visual stand-in — see `PROMPT-NOTES.md` for how that was sourced and confirmed.

See `TRACE-FINDINGS.md` for the Chrome performance-trace results (layout-shift measurements under throttled network/CPU conditions) and `speed-budget.json` for the performance budget those traces are checked against.

## Sold-out sizes and the stock list

Each size button is rendered from an entry in `src/data/nike_pegasus_size_stock.json`, sorted by `display_order`. Every button reads its own `stock_status` from that entry:

- `in_stock` — normal, tappable button.
- `low_stock` — tappable, with a small "Few left" marker underneath.
- `sold_out` — the button gets `disabled`/greyed styling and ignores clicks.

All 26 buttons are always rendered in the same grid, regardless of status — a sold-out button stays in its slot instead of being removed, so no other button shifts position.

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).
