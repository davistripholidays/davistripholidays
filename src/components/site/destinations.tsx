"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SmartImage } from "@/components/site/smart-image";
import type { DestinationCardData } from "@/lib/types";

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

/**
 * Destinations v4 — Atlas Field Journal, full-page plate + snap rail.
 *
 * R11 (owner's one-section-at-a-time experiment, promoted site-wide):
 * the 6-card vertical grid (2133px tall — three and a half viewports)
 * becomes ONE viewport plate. All six destinations stay reachable via
 * a horizontal snap rail — Experiment A from the design lab, promoted
 * to the live site after the owner's verdict. Desktop gets arrows +
 * drag; mobile gets the thumb-swipe with an edge peek of the next card.
 *
 * Mechanics (identical to the lab rail — proven):
 *   - overflow-x-auto + snap-x snap-mandatory + per-card snap-start
 *   - cards 78vw on phones so the next card peeks (affordance)
 *   - live counter tracks the nearest snap point
 *   - NO scroll trap: vertical page scroll is completely unaffected
 */
export function Destinations({
  destinations,
}: {
  destinations: DestinationCardData[];
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const onScroll = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-dest-card]");
    if (!card) return;
    const gap = 24;
    const step = card.offsetWidth + gap;
    const idx = Math.round(el.scrollLeft / step);
    setActive(Math.min(Math.max(idx, 0), destinations.length - 1));
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, [destinations.length]);

  useEffect(() => {
    onScroll();
  }, [onScroll]);

  const nudge = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-dest-card]");
    if (!card) return;
    const step = card.offsetWidth + 24;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section
      id="destinations"
      className="fp-plate section-y mx-auto w-full max-w-[1600px] bg-[var(--paper)]"
      aria-label="Destinations"
    >
      <div className="fp-inner w-full px-5 sm:px-8 lg:px-10">
        {/* Section header — numeral + heading + rail counter/arrows.
            R12 mobile: numeral 56 → 44px — two stacked display elements
            (numeral + H2) owned 180px of a 780px plate at 390px. */}
        <div className="section-intro grid grid-cols-12 gap-x-6 gap-y-3 border-b border-[var(--ink)] pb-6 sm:gap-y-4 sm:pb-8 lg:pb-10">
          <div className="col-span-12 sm:col-span-2 lg:col-span-1 self-baseline">
            <span className="font-display text-[44px] font-light leading-[0.85] tracking-[-0.05em] text-[var(--ink)] tabular-nums sm:text-[56px] lg:text-[72px]">
              01
            </span>
          </div>

          <div className="col-span-12 sm:col-span-7 lg:col-span-7">
            <p className="eyebrow mb-3">Where we take you</p>
            <h2
              className="font-display text-display-lg text-[var(--ink)]"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Manali &amp; Spiti.{" "}
              <em className="font-display italic font-light">One local team.</em>
            </h2>
          </div>

          {/* Right rail — counter + arrows + all-destinations */}
          <div className="col-span-12 flex items-center justify-between gap-4 self-baseline sm:col-span-3 sm:justify-end lg:col-span-4">
            <div className="flex items-center gap-3" aria-hidden>
              <span className="font-display text-[20px] font-light tabular-nums text-[var(--ink)]">
                {String(active + 1).padStart(2, "0")}
                <span className="text-[var(--ink)] opacity-40">
                  {" "}
                  / {String(destinations.length).padStart(2, "0")}
                </span>
              </span>
              <div className="flex items-center gap-1" aria-hidden>
                {destinations.map((_, i) => (
                  <span
                    key={i}
                    className={`h-[2px] w-4 transition-colors ${
                      i === active ? "bg-[var(--ink)]" : "bg-[var(--hairline-strong)]"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={() => nudge(-1)}
                disabled={atStart}
                aria-label="Previous destinations"
                className="flex h-10 w-10 items-center justify-center border border-[var(--hairline)] text-[var(--ink)] transition-colors hover:border-[var(--ink)] disabled:opacity-30 disabled:hover:border-[var(--hairline)]"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => nudge(1)}
                disabled={atEnd}
                aria-label="Next destinations"
                className="flex h-10 w-10 items-center justify-center border border-[var(--hairline)] text-[var(--ink)] transition-colors hover:border-[var(--ink)] disabled:opacity-30 disabled:hover:border-[var(--hairline)]"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <Link
              href="/destinations"
              className="arrow-link hidden text-[13px] text-[var(--ink)] sm:inline-flex"
            >
              All destinations
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        {/* The rail — one viewport of swiping cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div
            ref={railRef}
            onScroll={onScroll}
            className="mt-4 flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto pb-2 pt-3 sm:mt-6 sm:pt-4 [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
            aria-label="Destinations — swipe or drag horizontally"
          >
            {destinations.map((d, i) => (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                data-dest-card
                aria-label={`${d.name} — ${d.packageCount} packages${d.fromPrice ? ` from ${inr(d.fromPrice)}` : ""}`}
                className="group w-[78vw] max-w-[420px] shrink-0 snap-start focus-visible:outline-offset-8 sm:w-[400px] lg:w-[420px]"
              >
                {/* Image — 4:3 landscape plate (rail proportion) */}
                <div className="img-sharp relative w-full overflow-hidden bg-[var(--paper-soft)]">
                  <div style={{ aspectRatio: "4 / 3" }}>
                    <SmartImage
                      src={d.heroImage}
                      alt={d.heroAlt}
                      width={1200}
                      height={900}
                      loading={i < 2 ? "eager" : "lazy"}
                      decoding="async"
                      className="img-zoom h-full w-full object-cover object-[center_35%]"
                    />
                  </div>
                  <span className="absolute left-3 top-3 z-10 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 tabular-nums">
                    Plate · {d.region}
                  </span>
                </div>

                {/* Caption — same typographic system as the grid card */}
                <div className="pt-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3
                      className="font-display text-[22px] font-normal leading-[1.05] tracking-[-0.025em] text-[var(--ink)] transition-colors group-hover:text-[var(--pine)]"
                      style={{ fontVariationSettings: '"opsz" 60' }}
                    >
                      {d.name}
                    </h3>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-[var(--ink-muted)] transition-colors duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--pine)]"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-2 line-clamp-1 text-[13px] leading-[1.45] text-[var(--ink-soft)]">
                    {d.tagline}
                  </p>
                  <hr className="hairline mt-3.5 mb-3" />
                  <div className="flex h-[20px] items-center justify-between gap-3 [font-feature-settings:'tnum'_1]">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-muted)] tabular-nums whitespace-nowrap">
                      {d.packageCount} {d.packageCount === 1 ? "trip" : "trips"}
                    </span>
                    {d.fromPrice != null ? (
                      <span className="text-[12px] font-medium tracking-[0.01em] text-[var(--ink)] tabular-nums whitespace-nowrap">
                        From {inr(d.fromPrice)}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-muted)] whitespace-nowrap">
                        On request
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Edge fade affordance — "more cards this way" */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-[var(--paper)] to-transparent sm:block"
            aria-hidden
          />
        </motion.div>

        {/* Custom-trip CTA + swipe hint */}
        <div className="mt-3 flex flex-col gap-3 border-t border-[var(--hairline)] pt-4 sm:mt-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:pt-5">
          <p className="font-display text-[17px] italic font-light text-[var(--ink-soft)]">
            Looking for somewhere else?{" "}
            <Link
              href="/customize"
              className="group inline-flex items-baseline gap-1.5 border-b border-[var(--ink)] pb-0.5 font-light text-[var(--ink)]"
            >
              Plan a custom trip
              <ArrowRight
                className="h-3.5 w-3.5 self-center transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </p>
          <p className="caption sm:hidden" aria-hidden>
            Swipe for both →
          </p>
          <p className="caption hidden sm:block" aria-hidden>
            Drag or use the arrows — Manali &amp; Spiti
          </p>
        </div>
      </div>
    </section>
  );
}
