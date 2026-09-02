"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/site/smart-image";
import type { PackageCardData } from "@/lib/types";

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

/**
 * LAB EXPERIMENT B — Full-screen scroll-driven package deck.
 *
 * What it tests: the owner's idea — when you reach the packages, the FIRST
 * package owns the whole screen (image + name + highlights + price + CTA,
 * nothing else visible); scroll once and the NEXT package takes over the
 * whole screen; and so on. Desktop too, as a split-screen spread.
 *
 * HOW THIS AVOIDS THE CLASSIC TRAP:
 *   The naive implementation (nested 100vh scroll container with
 *   snap-mandatory) is the "scroll-jacking" pattern users universally hate —
 *   research: disorientation, lost control, hard to escape. This version
 *   uses the Apple AirPods technique instead:
 *
 *   - A tall track (1 + N pages of runway) sits in the NORMAL page flow.
 *   - A sticky 100svh viewport frame pins to the top of the screen while
 *     you scroll through the runway.
 *   - Progress through the runway drives a crisp crossfade to the next
 *     package at each 50% mark — the user NEVER loses scroll control,
 *     can scroll backwards, fast, or jump away at any moment.
 *   - Reduced motion: no pinning, cards render as a simple vertical stack.
 */
export function FullscreenDeck({ packages }: { packages: PackageCardData[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0 when track top hits viewport top; 1 when runway is exhausted
      const total = rect.height - viewport;
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);
      const idx = Math.min(
        Math.round(progress * (packages.length - 1)),
        packages.length - 1,
      );
      setActive(idx);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, packages.length]);

  if (reduced) {
    // Reduced-motion fallback: plain stacked cards, no pinning
    return (
      <section className="bg-[var(--paper)] py-10">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-10">
          <p className="eyebrow-ink mb-2">Experiment B</p>
          <h2 className="font-display text-display-lg text-[var(--ink)]">
            Full-screen deck.
          </h2>
          <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.55] text-[var(--ink-soft)]">
            Reduced motion is on, so the deck renders as a simple stack.
          </p>
          <div className="mt-8 flex flex-col gap-10">
            {packages.map((p) => (
              <DeckCard key={p.slug} p={p} index={0} total={packages.length} flat />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const N = packages.length;

  return (
    <section className="bg-[var(--paper)]" aria-label="Full-screen package deck experiment">
      {/* Intro — scrolls normally before the deck pins */}
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-14 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[60ch] flex-col gap-4">
          <div className="flex items-baseline justify-between gap-4">
            <p className="eyebrow-ink">Experiment B</p>
            <span className="inline-flex items-center gap-1.5 border border-[var(--ink)] px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--hairline-strong)]" aria-hidden />
              In the lab — not live
            </span>
          </div>
          <h2
            className="font-display text-display-lg text-[var(--ink)]"
            style={{ fontVariationSettings: '"opsz" 72' }}
          >
            Full-screen scroll deck.
          </h2>
          <p className="text-[15px] leading-[1.55] text-[var(--ink-soft)]">
            Scroll down slowly. Each package takes over the ENTIRE screen —
            image, details, price, CTA, nothing else. One smooth scroll step =
            next package. Your scroll stays fully under your control (no
            hijacking): scroll fast to skip, backwards to return, and the
            page continues normally after the deck ends.
          </p>
        </div>
      </div>

      {/* Track: intro page + (N-1) transitions of runway */}
      <div ref={trackRef} style={{ height: `${(1 + (N - 1)) * 100}svh` }}>
        {/* Sticky viewport frame — the "screen" */}
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {packages.map((p, i) => (
            <DeckCard
              key={p.slug}
              p={p}
              index={i}
              total={N}
              activeIdx={active}
            />
          ))}

          {/* Progress indicator — top right, journal style */}
          <div className="absolute right-5 top-5 z-20 flex items-center gap-3 bg-[var(--paper)] px-3 py-2 sm:right-8 sm:top-8">
            <span className="font-display text-[20px] font-light leading-none tabular-nums text-[var(--ink)]">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="text-[11px] tabular-nums text-[var(--ink)] opacity-40">
              / {String(N).padStart(2, "0")}
            </span>
            <div className="ml-1 flex items-center gap-1" aria-hidden>
              {packages.map((_, i) => (
                <span
                  key={i}
                  className={`h-[2px] w-4 transition-colors ${
                    i === active ? "bg-[var(--ink)]" : "bg-[var(--hairline-strong)]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Outro — page continues normally */}
      <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-8 lg:px-10">
        <hr className="hairline-ink mb-6" />
        <p className="font-display text-[18px] italic font-light text-[var(--ink-soft)]">
          Deck ends here — the page scrolls on normally.{" "}
          <Link href="/lab" className="text-[var(--ink)] not-italic">
            Back to top
          </Link>
        </p>
      </div>
    </section>
  );
}

function DeckCard({
  p,
  index,
  total,
  activeIdx,
  flat = false,
}: {
  p: PackageCardData;
  index: number;
  total: number;
  activeIdx?: number;
  flat?: boolean;
}) {
  const onRequest = !p.priceFrom || p.priceFrom <= 0;
  const isActive = flat || activeIdx === index;

  return (
    <div
      className={`${
        flat
          ? "relative"
          : "absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      } ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}`}
      style={!flat ? { visibility: isActive ? "visible" : "hidden" } : undefined}
    >
      <div className="flex h-full flex-col lg:grid lg:grid-cols-2">
        {/* Image — top ~42% on mobile, left half on desktop */}
        <div className="relative h-[42svh] shrink-0 overflow-hidden bg-[var(--pine-deep)] lg:h-full">
          <SmartImage
            src={p.heroImage}
            alt={p.heroAlt}
            width={1400}
            height={1600}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <span className="absolute left-5 top-5 z-10 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 tabular-nums">
            Feature · {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Content — fills the rest, CTA pinned to bottom */}
        <div className="flex flex-1 flex-col justify-between gap-6 overflow-y-auto px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-10 lg:py-10 lg:pr-16">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <p className="eyebrow-ink">{p.destinationName}</p>
              <p className="caption-ink tabular-nums">{p.duration}</p>
            </div>
            <h3
              className="mt-3 font-display text-display-lg text-[var(--ink)]"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              {p.name}
            </h3>
            <ul className="mt-5 flex flex-col gap-2.5">
              {p.highlights.slice(0, 3).map((h, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 text-[14px] leading-[1.55] text-[var(--ink-soft)]"
                >
                  <span className="caption-ink tabular-nums w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <hr className="hairline-ink mb-5" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="caption-ink mb-1">From</p>
                {onRequest ? (
                  <p className="font-display text-[22px] font-normal italic text-[var(--ink-soft)]">
                    On request
                  </p>
                ) : (
                  <p
                    className="font-display text-[30px] font-light italic tracking-[-0.02em] text-[var(--ink)] tabular-nums"
                    style={{ fontVariationSettings: '"opsz" 72' }}
                  >
                    {inr(p.priceFrom)}
                  </p>
                )}
              </div>
              <Link href={`/packages/${p.slug}`} className="btn-solid h-12">
                View itinerary
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            {flat && (
              <p className="caption mt-4">
                Card {String(index + 1).padStart(2, "0")} of{" "}
                {String(total).padStart(2, "0")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
