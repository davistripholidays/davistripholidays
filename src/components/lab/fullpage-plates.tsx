"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { SmartImage } from "@/components/site/smart-image";
import { whatsappLink } from "@/lib/site-config";

/**
 * LAB EXPERIMENT C — Full-page section plates. STATUS: PROMOTED — LIVE.
 *
 * What it tests: the owner's site-wide request — "only one section of
 * the website is seen at once, not half, not another section". Every
 * section becomes exactly one viewport; when scrolling stops, ONE
 * section owns the whole screen.
 *
 * This demo is ISOLATED: it runs inside its own fixed-height scroll
 * box (.fp-demo), so the lab page around it scrolls normally. The real
 * implementation is now LIVE on the homepage — same mechanics on the
 * document scroller, with a folio rail for wayfinding.
 *
 * How it avoids the scroll-jacking trap (the details that matter):
 *   - Native CSS scroll-snap on a normal document scroll — no JS takes
 *     the wheel. Fast scroll, backwards, keyboard, hash links: all fine.
 *   - R14: mandatory + snap-stop always on EVERY device — one gesture,
 *     one plate, on desktop AND phones (plus a settle watchdog that
 *     glides to the owning plate if a browser under-snaps).
 *   - Reduced motion / no-JS: the classic long page, untouched.
 *   - Sections taller than one viewport (e.g. the FAQ with an answer
 *     open) scroll freely INSIDE their plate before releasing.
 */

const DEMO_PLATES = [
  { id: "c1", label: "Cover" },
  { id: "c2", label: "A swiping rail" },
  { id: "c3", label: "One quote" },
  { id: "c4", label: "The close" },
];

export function FullpagePlates({ images }: { images: string[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const dark = active === 0 || active === DEMO_PLATES.length - 1;

  const onScroll = useCallback(() => {
    const el = boxRef.current;
    if (!el) return;
    const plate = el.querySelector<HTMLElement>("[data-demo-plate]");
    if (!plate) return;
    const idx = Math.round(el.scrollTop / plate.offsetHeight);
    setActive(Math.min(Math.max(idx, 0), DEMO_PLATES.length - 1));
  }, []);

  return (
    <section
      id="experiment-c"
      className="border-b border-[var(--ink)] bg-[var(--paper)]"
      aria-label="Full-page plates experiment"
    >
      {/* Experiment header — the lab's consistent lockup */}
      <div className="mx-auto max-w-[1600px] px-5 pt-14 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[60ch] flex-col gap-4 border-b border-[var(--ink)] pb-8">
          <div className="flex items-baseline justify-between gap-4">
            <p className="eyebrow-ink">Experiment C</p>
            <span className="inline-flex items-center gap-1.5 bg-[var(--ink)] px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[var(--paper)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7FBF8E]" aria-hidden />
              Live on the site
            </span>
          </div>
          <h2
            className="font-display text-display-lg text-[var(--ink)]"
            style={{ fontVariationSettings: '"opsz" 72' }}
          >
            One plate at a time.
          </h2>
          <p className="text-[15px] leading-[1.55] text-[var(--ink-soft)]">
            Your site-wide request, in isolation: each section is exactly one
            screen. Scroll the box below — slowly, then fast. At rest, ONE
            section always owns the whole screen. Your scroll is never
            hijacked: no traps, no rubber-banding, keyboard works, and
            sections taller than a screen (like an open FAQ answer) still
            scroll inside their own plate.
          </p>
          <p className="caption">
            This pattern is now LIVE on the homepage — 11 plates, a folio rail
            for wayfinding, and a scroll cue on the cover.{" "}
            <Link href="/" className="border-b border-[var(--ink)] text-[var(--ink)]">
              See it on the real site
              <ArrowUpRight className="ml-1 inline h-3 w-3" aria-hidden />
            </Link>
          </p>
        </div>
      </div>

      {/* The isolated demo box — its own scroll container */}
      <div
        ref={boxRef}
        onScroll={onScroll}
        className="fp-demo relative"
        aria-label="Full-page plates — scroll inside this box"
      >
        {/* Plate C1 — cover */}
        <div id="c1" data-demo-plate className="fp-plate bg-[var(--pine-deep)] text-[var(--paper)]">
          <div className="fp-inner flex flex-1 flex-col justify-between px-6 py-10 sm:px-12">
            <div className="flex items-baseline justify-between">
              <p className="eyebrow-light">Demo · a mini homepage</p>
              <p className="caption-light tabular-nums">Plate 01 / 04</p>
            </div>
            <div>
              <p
                className="font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[0.95] tracking-[-0.03em] text-[var(--paper)]"
                style={{ fontVariationSettings: '"opsz" 96' }}
              >
                Mountains, one
                <br />
                <em className="font-display italic font-light">screen at a time.</em>
              </p>
              <p className="mt-5 max-w-[46ch] text-[14px] leading-[1.55] text-[rgba(246,241,232,0.7)]">
                Each section of the page becomes a full viewport. You never
                see two half-sections fighting for your attention.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="fp-cue" aria-hidden>
                <span className="fp-cue-label" style={{ color: "rgba(246,241,232,0.65)" }}>
                  Scroll inside this box
                </span>
                <span className="fp-cue-line" style={{ background: "rgba(246,241,232,0.5)" }} />
              </div>
              <ArrowDown className="h-4 w-4 text-[rgba(246,241,232,0.5)]" aria-hidden />
            </div>
          </div>
        </div>

        {/* Plate C2 — a swiping rail inside a plate */}
        <div id="c2" data-demo-plate className="fp-plate bg-[var(--paper)]">
          <div className="fp-inner px-6 py-10 sm:px-12">
            <div className="flex items-baseline justify-between border-b border-[var(--ink)] pb-5">
              <p className="eyebrow-ink">Section 01 — destinations</p>
              <p className="caption-ink tabular-nums">Plate 02 / 04</p>
            </div>
            <p className="mt-6 max-w-[52ch] text-[14px] leading-[1.55] text-[var(--ink-soft)]">
              A section with more cards than one screen can hold gets an inner
              rail — swipe the photos. The plate itself stays one screen.
            </p>
            <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {images.slice(0, 4).map((src, i) => (
                <div
                  key={src + i}
                  className="img-sharp relative w-[62%] max-w-[340px] shrink-0 snap-start overflow-hidden bg-[var(--paper-soft)]"
                >
                  <div style={{ aspectRatio: "4 / 3" }}>
                    <SmartImage
                      src={src}
                      alt={`Demo destination card ${i + 1}`}
                      width={800}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="absolute left-3 top-3 z-10 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 tabular-nums">
                    Card {String(i + 1).padStart(2, "0")} · swipe →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plate C3 — one quote */}
        <div id="c3" data-demo-plate className="fp-plate bg-[var(--paper)]">
          <div className="fp-inner flex flex-1 flex-col justify-center px-6 sm:px-12">
            <div className="mx-auto flex max-w-[720px] flex-col items-start gap-6">
              <div className="flex w-full items-baseline justify-between">
                <p className="eyebrow-ink">Section 05 — a quote</p>
                <p className="caption-ink tabular-nums">Plate 03 / 04</p>
              </div>
              <blockquote
                className="pullquote"
                style={{ fontVariationSettings: '"opsz" 96' }}
              >
                One idea per screen. The page reads like plates in a field
                journal — you turn one at a time.
              </blockquote>
              <p className="caption-ink">The behaviour, in one sentence</p>
            </div>
          </div>
        </div>

        {/* Plate C4 — the close */}
        <div id="c4" data-demo-plate className="fp-plate bg-[var(--ink)] text-[var(--paper)]">
          <div className="fp-inner flex flex-1 flex-col justify-center px-6 sm:px-12">
            <div className="mx-auto flex max-w-[720px] flex-col items-start gap-6">
              <div className="flex w-full items-baseline justify-between">
                <p className="eyebrow-light">Final section — the ask</p>
                <p className="caption-light tabular-nums">Plate 04 / 04</p>
              </div>
              <p
                className="font-display text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1] tracking-[-0.03em] text-[var(--paper)]"
                style={{ fontVariationSettings: '"opsz" 96' }}
              >
                Then the page ends{" "}
                <em className="font-display italic font-light">cleanly.</em>
              </p>
              <a
                href={whatsappLink("Hi Davis Trip Holidays! I tested the lab — the full-page plates feel right.")}
                className="btn-solid"
                style={{ background: "var(--paper)", color: "var(--ink)" }}
              >
                Tell us your verdict
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>

        {/* In-box folio rail — same wayfinding as the live site */}
        <div className="fp-rail" style={{ position: "absolute" }} aria-hidden>
          {DEMO_PLATES.map((p, i) => (
            <button
              key={p.id}
              type="button"
              tabIndex={-1}
              onClick={() => {
                const el = boxRef.current?.querySelector<HTMLElement>(`#${p.id}`);
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`fp-rail-item ${i === active ? "is-active" : ""} ${
                i === active && dark ? "fp-rail-on-dark" : ""
              }`}
            >
              <span className="fp-rail-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="fp-rail-tick" />
            </button>
          ))}
        </div>
      </div>

      {/* Outro */}
      <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-10">
        <p className="mx-auto max-w-[60ch] font-display text-[17px] italic font-light text-[var(--ink-soft)]">
          R14: every device now gets the same hard lock — one gesture, one
          plate, on desktop and phones alike, with a settle watchdog that
          glides home if a browser stops short. Reduced-motion visitors
          get the classic long page — the experiment never fights the
          people it serves.
        </p>
      </div>
    </section>
  );
}
