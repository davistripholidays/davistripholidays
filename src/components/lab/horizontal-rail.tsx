"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/site/smart-image";
import type { PackageCardData } from "@/lib/types";

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

/**
 * LAB EXPERIMENT A — Horizontal snap rail (the "packages sideways" idea).
 *
 * What it tests: on mobile, instead of stacking package rows vertically
 * (long page scroll), packages swipe horizontally like every familiar
 * mobile content rail (Netflix / Airbnb / Instagram). One thumb swipe per
 * package, edge-peek of the next card, live counter.
 *
 * Key mechanics:
 *   - overflow-x-auto + snap-x snap-mandatory + per-card snap-start
 *   - cards ~82vw so the next card peeks (affordance: more content exists)
 *   - counter tracks nearest snap point via onScroll math
 *   - NO scroll trap: vertical page scrolling is completely unaffected.
 *   - Desktop: same rail, wider cards (440px) — evaluates fine at any width.
 */
export function HorizontalRail({ packages }: { packages: PackageCardData[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-rail-card]");
    if (!card) return;
    const step = card.offsetWidth + 20; // width + gap
    const idx = Math.round(el.scrollLeft / step);
    setActive(Math.min(Math.max(idx, 0), packages.length - 1));
  }, [packages.length]);

  return (
    <section
      id="experiment-a"
      className="border-b border-[var(--ink)] bg-[var(--paper)] py-10"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-10">
        {/* Lab lockup — consistent across all experiments */}
        <div className="mx-auto flex max-w-[60ch] flex-col gap-4">
          <div className="flex items-baseline justify-between gap-4">
            <p className="eyebrow-ink">Experiment A</p>
            <span className="inline-flex items-center gap-1.5 border border-[var(--ink)] px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">
              <span className="h-1.5 w-1.5 rotate-45 bg-[var(--ember)]" aria-hidden />
              Pattern live — destinations
            </span>
          </div>
          <h2
            className="font-display text-display-lg text-[var(--ink)]"
            style={{ fontVariationSettings: '"opsz" 72' }}
          >
            Horizontal snap rail.
          </h2>
          <p className="text-[15px] leading-[1.55] text-[var(--ink-soft)]">
            Packages swipe sideways (Netflix-style). Vertical page scroll
            stays untouched — no trap. One swipe per package, the next card
            peeks at the edge. The rail pattern now runs the destinations
            plate on the live homepage — this original stays for reference.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <span className="font-display text-[20px] font-light tabular-nums text-[var(--ink)]">
            {String(active + 1).padStart(2, "0")}
            <span className="text-[var(--ink)] opacity-40">
              {" "}
              / {String(packages.length).padStart(2, "0")}
            </span>
          </span>
          <div className="flex items-center gap-1.5" aria-hidden>
            {packages.map((_, i) => (
              <span
                key={i}
                className={`h-[2px] w-5 transition-colors ${
                  i === active ? "bg-[var(--ink)]" : "bg-[var(--hairline-strong)]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* The rail */}
      <div className="relative">
        <div
          ref={railRef}
          onScroll={onScroll}
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 pr-16 cursor-grab active:cursor-grabbing sm:px-8 sm:pr-20 lg:px-10 lg:pr-24 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Packages — swipe horizontally"
        >
        {packages.map((p, i) => {
          const onRequest = !p.priceFrom || p.priceFrom <= 0;
          return (
            <article
              key={p.slug}
              data-rail-card
              className="w-[82vw] max-w-[440px] shrink-0 snap-start sm:w-[440px]"
            >
              <Link
                href={`/packages/${p.slug}`}
                className="img-sharp group relative block aspect-[4/3] overflow-hidden bg-[var(--paper-soft)]"
                aria-label={`${p.name} — ${p.duration}`}
              >
                <SmartImage
                  src={p.heroImage}
                  alt={p.heroAlt}
                  width={1400}
                  height={1050}
                  loading="lazy"
                  decoding="async"
                  className="img-zoom h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 z-10 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 tabular-nums">
                  Feature · {String(i + 1).padStart(2, "0")}
                </span>
              </Link>
              <div className="pt-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="eyebrow-ink">{p.destinationName}</p>
                  <p className="caption-ink tabular-nums">{p.duration}</p>
                </div>
                <h3
                  className="mt-2 font-display text-display text-[var(--ink)]"
                  style={{ fontVariationSettings: '"opsz" 60' }}
                >
                  <Link href={`/packages/${p.slug}`} className="hover:text-[var(--pine)] transition-colors">
                    {p.name}
                  </Link>
                </h3>
                <ul className="mt-4 flex flex-col gap-2">
                  {p.highlights.slice(0, 2).map((h, j) => (
                    <li
                      key={j}
                      className="flex items-baseline gap-3 text-[13px] leading-[1.5] text-[var(--ink-soft)]"
                    >
                      <span className="caption-ink tabular-nums w-6 shrink-0">
                        {String(j + 1).padStart(2, "0")}
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <hr className="hairline mt-5 mb-4" />
                <div className="flex items-center justify-between gap-3">
                  {onRequest ? (
                    <p className="font-display text-[18px] font-normal italic text-[var(--ink-soft)]">
                      On request
                    </p>
                  ) : (
                    <p className="font-display text-[22px] font-light italic tabular-nums text-[var(--ink)]">
                      {inr(p.priceFrom)}
                    </p>
                  )}
                  <Link
                    href={`/packages/${p.slug}`}
                    className="btn-solid h-10 px-5 text-[11.5px]"
                  >
                    View
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
        </div>
        {/* Edge fade — the peek of the next card reads as an intentional
            affordance, not a clipped layout. Same treatment as the live
            destinations rail. */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[var(--paper)] to-transparent"
          aria-hidden
        />
      </div>
    </section>
  );
}
