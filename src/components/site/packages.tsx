"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Flame } from "lucide-react";
import { SmartImage } from "@/components/site/smart-image";
import type { PackageCardData } from "@/lib/types";

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

/**
 * Packages v4 — Atlas Field Journal, full-page plate.
 *
 * R11: the three 850px feature rows (2557px total — three viewports of
 * scrolling) become ONE viewport plate: a 3-column spread of the owner's
 * three most-booked group tours (source: owner's own PDF drop, the trips
 * "people mostly buy from them"). Desktop grid → mobile horizontal rail
 * (the same promoted Experiment A pattern the destinations plate uses).
 *
 * The "Most booked" badge is the single ember accent on the homepage —
 * reserved for exactly this owner-verified signal.
 */
export function Packages({ packages }: { packages: PackageCardData[] }) {
  return (
    <section
      id="packages"
      className="fp-plate section-y bg-[var(--paper)]"
      aria-label="Most-booked tour packages"
    >
      <div className="fp-inner mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-10">
        {/* Section header — R12 mobile: numeral 56 → 44px, tighter intro
            so the plate lands at ~780px (was 819). */}
        <div className="section-intro grid grid-cols-12 gap-x-6 gap-y-2 border-b border-[var(--ink)] pb-5 sm:pb-6 lg:pb-6">
          <div className="col-span-12 sm:col-span-2 lg:col-span-1 self-baseline">
            <span className="font-display text-[44px] font-light leading-[0.85] tracking-[-0.05em] text-[var(--ink)] tabular-nums sm:text-[56px] lg:text-[72px]">
              02
            </span>
          </div>

          <div className="col-span-12 sm:col-span-7 lg:col-span-7">
            <p className="eyebrow mb-2">Group tours · Delhi departures</p>
            <h2
              className="font-display text-display-lg text-[var(--ink)]"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Most-booked <em className="font-display italic font-light">journeys.</em>
            </h2>
          </div>

          <div className="col-span-12 self-baseline sm:col-span-3 sm:text-right lg:col-span-4">
            <Link
              href="/packages"
              className="arrow-link text-[13px] text-[var(--ink)]"
            >
              All packages
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        {/* The three bestsellers — grid on desktop, snap rail on phones */}
        <div className="mt-3 flex snap-x gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-4 lg:mt-5 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {packages.map((p, i) => (
            <BestsellerCard key={p.slug} p={p} index={i} />
          ))}
        </div>

        {/* Caption — the "what these are" line + honest pricing note */}
        <div className="mt-2 flex flex-col gap-2 border-t border-[var(--hairline)] pt-3 sm:mt-3 sm:flex-row sm:items-baseline sm:justify-between sm:pt-3">
          <p className="max-w-[80ch] text-[11.5px] leading-[1.55] text-[var(--ink-muted)]">
            Our three most-booked group trips — Delhi pickup & drop, personal
            cab, day-wise itinerary in writing. Prices per person, twin
            sharing. Every booking gets a GST invoice.
          </p>
          <p className="caption shrink-0 lg:hidden" aria-hidden>
            Swipe for all three →
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * BestsellerCard — compact editorial card for the plate.
 * Image 4:3 with the ember "Most booked" badge, caption block with
 * highlights, price + CTA. Same type system as every other card.
 */
function BestsellerCard({
  p,
  index,
}: {
  p: PackageCardData;
  index: number;
}) {
  const onRequest = !p.priceFrom || p.priceFrom <= 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group flex w-[80vw] shrink-0 snap-start flex-col sm:w-[420px] lg:w-auto"
    >
      <Link
        href={`/packages/${p.slug}`}
        className="img-sharp relative block w-full overflow-hidden bg-[var(--paper-soft)]"
        aria-label={`${p.name} — ${p.duration}`}
      >
        <div style={{ aspectRatio: "3 / 2" }}>
          <SmartImage
            src={p.heroImage}
            alt={p.heroAlt}
            width={1200}
            height={900}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            className="img-zoom h-full w-full object-cover"
          />
        </div>
        {/* Most-booked badge — THE one ember accent on the homepage */}
        {p.bestseller && (
          <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 bg-[var(--ember)] px-2.5 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#F9F4EA]">
            <Flame className="h-3 w-3" aria-hidden />
            Most booked
          </span>
        )}
        <span className="absolute right-4 top-4 z-10 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 tabular-nums">
          {String(index + 1).padStart(2, "0")} · {p.duration}
        </span>
      </Link>

      {/* Caption block — R12 mobile: title 24 → 22px, price 26 → 22px so
          the whole card + header + note lands in one phone viewport. */}
      <div className="flex flex-1 flex-col pt-3.5 sm:pt-4">
        <p className="eyebrow-ink">{p.destinationName}</p>
        <h3
          className="mt-1.5 font-display text-[22px] font-normal leading-[1.05] tracking-[-0.02em] text-[var(--ink)] sm:mt-2 sm:text-[24px] lg:text-[26px]"
          style={{ fontVariationSettings: '"opsz" 60' }}
        >
          <Link
            href={`/packages/${p.slug}`}
            className="transition-colors hover:text-[var(--pine)]"
          >
            {p.name}
          </Link>
        </h3>

        <ul className="mt-2.5 flex flex-col gap-1.5 sm:mt-3">
          {p.highlights.slice(0, 3).map((h, i) => (
            <li
              key={i}
              className="flex items-baseline gap-3 text-[13px] leading-[1.5] text-[var(--ink-soft)]"
            >
              <span className="caption-ink tabular-nums w-6 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="line-clamp-1">{h}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <hr className="hairline mt-3 mb-3 ml-9 sm:mt-4 sm:mb-3.5" />
          <div className="flex items-end justify-between gap-3 pl-9">
            <div>
              {onRequest ? (
                <p className="font-display text-[18px] font-normal italic text-[var(--ink-soft)]">
                  On request
                </p>
              ) : (
                <>
                  <p className="caption-ink mb-0.5">From · per person</p>
                  <p
                    className="font-display text-[22px] font-light italic tracking-[-0.02em] text-[var(--ink)] tabular-nums sm:text-[26px]"
                    style={{ fontVariationSettings: '"opsz" 72' }}
                  >
                    {inr(p.priceFrom)}
                  </p>
                </>
              )}
            </div>
            <Link
              href={`/packages/${p.slug}#itinerary`}
              className="btn-solid h-11 px-4 text-[11px] sm:h-10"
            >
              Itinerary
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
