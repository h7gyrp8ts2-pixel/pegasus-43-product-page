"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
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
      {/* Photo: fixed aspect-ratio box holds its space before the image loads */}
      <div
        className="relative w-[375px] flex-shrink-0 overflow-hidden bg-neutral-100"
        style={{ aspectRatio: "1872 / 2340" }}
      >
        <Image
          src="/images/pegasus-43.jpg"
          alt="Nike Pegasus 43"
          fill
          priority
          sizes="375px"
          className="object-cover"
        />
      </div>

      {/* Name, price, colorway */}
      <div className="px-4 pt-4">
        <h1 className="text-lg font-medium text-neutral-900">
          {product.product_name}
        </h1>
        <p className="mt-0.5 text-sm text-neutral-500">{product.colorway}</p>
        <p className="mt-1 h-6 font-sans text-base font-semibold leading-6 text-neutral-900">
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
