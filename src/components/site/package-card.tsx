"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SmartImage } from "@/components/site/smart-image";
import type { PackageCardData } from "@/lib/types";

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

/**
 * PackageCard v6 — Editorial Himalayan.
 *
 * REWRITE RATIONALE:
 *   v5 had: 16px rounded corners, dual pill badges on image (duration + category),
 *   checkmark bullet list inside card, large bold Playfair price (1.5rem bold),
 *   green "View itinerary" button at bottom. VLM flagged: "information density
 *   & visual weight imbalance", "muddy palette", "ambiguous CTAs", "lack of
 *   editorial confidence".
 *
 *   v6 philosophy (informed by Intrepid Travel + Scott Dunn):
 *   1. Sharp 4px border-radius. Hairline border (no shadow on default).
 *   2. NO pills on image. Duration moves to subtitle line. Category removed
 *      (it's redundant with name; trust signals belong in detail page).
 *   3. NO checkmark bullet list inside card. Card shows: destination eyebrow,
 *      package name, short subtitle, hairline, price, single text link CTA.
 *   4. Price in Playfair italic 400 22px (not bold), with "FROM" eyebrow in
 *      Inter 600 11px uppercase tracking 0.14em ink-muted color. Reads as
 *      editorial, not "ransom note".
 *   5. CTA is a text link "View itinerary →", not a solid button. Solid
 *      button competes with the hero CTA (button soup defect).
 *   6. Hover: image scales 1.04, card lifts -2px with subtle shadow.
 */
export function PackageCard({ p }: { p: PackageCardData }) {
  const onRequest = !p.priceFrom || p.priceFrom <= 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[4px] border border-[var(--hairline)] bg-card transition-all duration-500 ease-[cubic-bezier(0.22,0.65,0.35,1)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-16px_rgba(20,17,14,0.18)]">
      {/* Image — pure photography, sharp corners, no overlays */}
      <Link
        href={`/packages/${p.slug}`}
        className="img-sharp relative block aspect-[4/3] overflow-hidden focus-visible:outline-2 focus-visible:outline-[var(--pine)] focus-visible:outline-offset-2"
        aria-label={`${p.name} — ${p.duration}`}
      >
        <SmartImage
          src={p.heroImage}
          alt={p.heroAlt}
          width={800}
          height={600}
          loading="lazy"
          decoding="async"
          className="img-zoom h-full w-full object-cover"
        />
        {/* Most-booked badge — owner-verified best-sellers (PDF drop
            2026-08-31). The one ember accent in the card system. */}
        {p.bestseller && (
          <span className="absolute left-4 top-4 z-10 bg-[var(--ember)] px-2.5 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#F9F4EA]">
            Most booked
          </span>
        )}
      </Link>

      {/* Content well — generous padding (VLM fix: was cramped) */}
      <div className="flex flex-1 flex-col gap-2.5 p-7">
        {/* Eyebrow — destination */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--pine)]">
          {p.destinationName}
        </p>

        {/* Title — Playfair 500 (NOT bold) — bumped to 24px per VLM "title size" feedback */}
        <h3 className="font-display text-[24px] font-medium leading-[1.2] tracking-[-0.015em] text-[var(--ink)]">
          <Link
            href={`/packages/${p.slug}`}
            className="transition-colors hover:text-[var(--pine)] focus-visible:outline-2 focus-visible:outline-[var(--pine)] focus-visible:outline-offset-2"
          >
            {p.name}
          </Link>
        </h3>

        {/* Subtitle — duration */}
        <p className="text-[13px] leading-[1.5] text-[var(--ink-soft)]">
          {p.duration}
        </p>

        {/* Price — hairline above, larger editorial numerals (VLM fix:
            "price typography too small and timid") */}
        <div className="mt-auto pt-6">
          <div className="border-t border-[var(--hairline)] pt-5">
            {onRequest ? (
              <p className="font-display text-[18px] font-normal italic tracking-[-0.005em] text-[var(--ink-soft)]">
                Priced on request
              </p>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                  From
                </span>
                <span className="font-display text-[28px] font-normal italic tracking-[-0.015em] text-[var(--ink)]">
                  {inr(p.priceFrom)}
                </span>
              </div>
            )}

            {/* View itinerary — subtle outlined button (VLM fix:
                "floating without clear button styling") */}
            <Link
              href={`/packages/${p.slug}#itinerary`}
              className="group mt-5 inline-flex h-10 items-center gap-1.5 rounded-[4px] border border-[var(--ink)] px-4 text-[13px] font-medium text-[var(--ink)] transition-all hover:bg-[var(--ink)] hover:text-[var(--paper)]"
            >
              View itinerary
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
