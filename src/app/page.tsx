"use client";

import { useMemo, useState } from "react";
import stockData from "@/data/nike_pegasus_size_stock.json";

type StockStatus = "in_stock" | "low_stock" | "sold_out";

interface SizeStock {
  sku: string;
  style_code: string;
  product_name: string;
  colorway: string;
  price: number;
  size_label: string;
  size_us_men: number;
  size_us_women: number;
  size_eu: string;
  display_order: number;
  in_stock: boolean;
  stock_quantity: number;
  stock_status: StockStatus;
  launch_date: string;
}

const sizes = (stockData as SizeStock[])
  .slice()
  .sort((a, b) => a.display_order - b.display_order);

const product = sizes[0];

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Home() {
  const [selectedSku, setSelectedSku] = useState<string | null>(null);

  const selectedSize = useMemo(
    () => sizes.find((s) => s.sku === selectedSku) ?? null,
    [selectedSku]
  );

  return (
    <div className="mx-auto flex min-h-screen w-[375px] flex-col bg-white">
      {/* Photo */}
      <div className="relative h-[375px] w-[375px] flex-shrink-0 overflow-hidden bg-gradient-to-b from-neutral-100 to-neutral-200">
        <svg
          viewBox="0 0 300 160"
          className="absolute left-1/2 top-1/2 h-32 w-64 -translate-x-1/2 -translate-y-1/2 text-neutral-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 120 C 20 90, 60 70, 90 72 C 110 60, 150 40, 190 42 C 220 30, 255 35, 280 55 C 295 65, 295 90, 280 105 C 250 125, 60 130, 20 128 C 12 127, 8 124, 10 120 Z" />
          <path d="M90 72 C 100 85, 120 95, 150 98" />
          <path d="M190 42 C 195 60, 210 75, 230 82" />
        </svg>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] text-neutral-400">
          Product image placeholder
        </span>
      </div>

      {/* Name, price, colorway */}
      <div className="px-4 pt-4">
        <h1 className="text-lg font-medium text-neutral-900">
          {product.product_name}
        </h1>
        <p className="mt-0.5 text-sm text-neutral-500">{product.colorway}</p>
        <p className="mt-1 text-base font-semibold text-neutral-900">
          {priceFormatter.format(product.price)}
        </p>
      </div>

      {/* Size buttons */}
      <div className="px-4 pt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-neutral-900">
            Select size
          </span>
          {selectedSize && (
            <span className="text-xs text-neutral-500">
              {selectedSize.size_label}
            </span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-5 gap-x-2 gap-y-3">
          {sizes.map((size) => {
            const isSoldOut = size.stock_status === "sold_out";
            const isLowStock = size.stock_status === "low_stock";
            const isSelected = size.sku === selectedSku;

            return (
              <div
                key={size.sku}
                className="flex flex-col items-center gap-1"
              >
                <button
                  type="button"
                  disabled={isSoldOut}
                  aria-disabled={isSoldOut}
                  aria-pressed={isSelected}
                  onClick={() => {
                    if (!isSoldOut) setSelectedSku(size.sku);
                  }}
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-md border text-xs font-medium transition-colors",
                    isSoldOut
                      ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400"
                      : isSelected
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "cursor-pointer border-neutral-300 bg-white text-neutral-900 hover:border-neutral-900",
                  ].join(" ")}
                >
                  {size.size_label.split(" / ")[0].replace(/^[MW]\s/, "")}
                </button>
                <span className="h-3 text-[9px] leading-3 text-amber-600">
                  {isLowStock ? "Few left" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech copy */}
      <div className="mt-4 border-t border-neutral-200 px-4 py-5">
        <h2 className="text-sm font-medium text-neutral-900">Why we love it</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          The Pegasus 43 keeps the responsive ride the line is known for, with
          a foam midsole tuned for daily miles and an engineered mesh upper
          that moves with your foot. A durable rubber outsole adds grip and
          traction from the first step to the last.
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-neutral-600">
          <li>• Responsive foam midsole for an everyday ride</li>
          <li>• Breathable engineered mesh upper</li>
          <li>• Durable rubber outsole for traction</li>
          <li>• Padded collar for a comfortable fit</li>
        </ul>
      </div>

      {/* Reviews */}
      <div className="border-t border-neutral-200 px-4 py-5 pb-28">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-neutral-900">
            Ratings &amp; Reviews
          </h2>
          <span className="text-sm text-neutral-600">4.6 ★ (128)</span>
        </div>

        <div className="mt-4 space-y-4">
          {sampleReviews.map((review) => (
            <div key={review.author} className="border-b border-neutral-100 pb-4 last:border-none">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">
                  {review.author}
                </span>
                <span className="text-xs text-neutral-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add to bag */}
      <div className="fixed bottom-0 left-1/2 w-[375px] -translate-x-1/2 border-t border-neutral-200 bg-white px-4 py-3">
        <button
          type="button"
          disabled={!selectedSize}
          className={[
            "w-full rounded-md py-3 text-sm font-semibold transition-colors",
            selectedSize
              ? "cursor-pointer bg-neutral-900 text-white"
              : "cursor-not-allowed bg-neutral-200 text-neutral-400",
          ].join(" ")}
        >
          {selectedSize ? "Add to Bag" : "Select a size"}
        </button>
      </div>
    </div>
  );
}

const sampleReviews = [
  {
    author: "Jordan R.",
    rating: 5,
    text: "My go-to daily trainer. Light enough for faster runs but still cushioned for long ones.",
  },
  {
    author: "Alex M.",
    rating: 4,
    text: "Great ride and true to size. Wish the upper breathed a little better in summer heat.",
  },
  {
    author: "Priya S.",
    rating: 5,
    text: "Replaced my last three pairs of Pegasus with this one. Consistent and reliable.",
  },
];
