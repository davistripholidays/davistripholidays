"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";
import { whatsappLink, RATINGS, BUSINESS } from "@/lib/site-config";
import { tracked } from "@/lib/analytics";

/**
 * Hero v8 — Atlas Field Journal, multi-plate cover.
 *
 * CHANGE FROM v7 (owner request, R10):
 *   v7 showed a single Spiti Valley photo — but we operate across six
 *   regions, and one Spiti frame reads as "we sell Spiti only". Instead of
 *   a generic "universal" image (which would say nothing), the cover now
 *   crossfades through four real destination plates — Spiti, Kashmir,
 *   Rajasthan, Goa — exactly like a magazine cycling cover plates.
 *
 *   - First plate (Spiti) stays the LCP image: priority + fetchPriority
 *     high. Other plates download after hydration, so LCP is unchanged.
 *   - 7s dwell, 1.2s crossfade, caption + plate ticks swap with a quiet
 *     600ms rise. Reduced motion: static first plate, no rotation.
 *   - Plate numbering ("Plate 02 · Cover image") keeps the Field Journal
 *     identity while telling the scope story without words.
 *
 * ALSO R10: primary CTA is now a solid editorial button (.btn-solid) —
 * text-link CTAs were too quiet for first-time web users (owner concern
 * about affordance). Secondary stays a quiet arrow-link. One button per
 * view, never button soup.
 */

const PLATES = [
  {
    src: "/images/spiti.jpg",
    name: "Spiti Valley, Himachal Pradesh",
    factLabel: "Altitude",
    factValue: "3,800 m",
    alt: "Snow-dusted Himalayan peaks above a winding river in Spiti Valley",
  },
  {
    src: "/images/plates/plate-02-kashmir.jpg",
    name: "Dal Lake, Srinagar · Kashmir",
    factLabel: "Elevation",
    factValue: "1,580 m",
    alt: "Shikara boat silhouetted against a sunset sky on Dal Lake, Srinagar",
  },
  {
    src: "/images/plates/plate-03-rajasthan.jpg",
    name: "Hawa Mahal, Jaipur · Rajasthan",
    factLabel: "Built",
    factValue: "1799",
    alt: "The pink lattice facade of Hawa Mahal palace in Jaipur, Rajasthan",
  },
  {
    src: "/images/plates/plate-04-goa.jpg",
    name: "Arabian Sea coast · Goa",
    factLabel: "Coastline",
    factValue: "101 km",
    alt: "Palm-lined beach on the Goan coast of the Arabian Sea",
  },
];

const PLATE_INTERVAL_MS = 7000;

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** Which plate is on the cover right now (static under reduced motion). */
function useActivePlate(count: number) {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced || count < 2) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % count);
    }, PLATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduced, count]);

  return active;
}

/** Stacked photo plates with a 1.2s opacity crossfade. */
function PlateStack({ active }: { active: number }) {
  return (
    <div className="absolute inset-0">
      {PLATES.map((p, i) => (
        <div
          key={p.src}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          <Image
            src={p.src}
            alt={p.alt}
            fill
            sizes="(min-width: 768px) 58vw, 100vw"
            priority={i === 0}
            fetchPriority={i === 0 ? "high" : "auto"}
            className="object-cover"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}

/** Plate ticks — four small folio marks, active one filled. */
function PlateTicks({ active, count }: { active: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-[2px] w-6 transition-colors duration-700 ${
            i === active ? "bg-[var(--paper)]" : "bg-white/40"
          }`}
        />
      ))}
    </div>
  );
}

/** Caption lockup under the photo — swaps with the active plate. */
function PlateCaption({
  active,
  compact = false,
}: {
  active: number;
  compact?: boolean;
}) {
  const p = PLATES[active];
  return (
    <div
      key={active}
      className="plate-caption-in flex items-end justify-between gap-6"
    >
      <div className="text-[var(--paper)]">
        <div className="caption-light mb-1 tabular-nums">
          Plate {String(active + 1).padStart(2, "0")} · Cover image
        </div>
        <div className="font-display text-[16px] font-normal italic tracking-[-0.01em] sm:text-[17px]">
          {p.name}
        </div>
        {!compact && (
          <div className="mt-2">
            <PlateTicks active={active} count={PLATES.length} />
          </div>
        )}
      </div>
      {compact ? null : (
        <div className="text-right text-[var(--paper)]">
          <div className="caption-light mb-1">{p.factLabel}</div>
          <div className="text-[13px] tabular-nums">{p.factValue}</div>
        </div>
      )}
    </div>
  );
}

export function Hero() {
  const reviewCount = RATINGS.google.count + RATINGS.justdial.count;
  const rating = RATINGS.google.score.toFixed(1);
  const active = useActivePlate(PLATES.length);

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="fp-plate relative border-b border-[var(--ink)] bg-[var(--paper)]"
    >
      {/* ─── DESKTOP / TABLET LAYOUT (md+) ───
          12-col grid: content 5 left, photo 7 right, both flush.
          R11: full-page plate #01 — exactly one viewport tall. */}
      <div className="fp-inner hidden md:grid grid-cols-12 min-h-[calc(100dvh-4.5rem)]">
        {/* Left column — content, 6 cols.
            R10: was 5 cols, but the 3-line display lockup NEVER fit — at
            104px each forced line wrapped again into a ragged 6-line
            waterfall (measured 593px tall), pushing the CTA below the
            fold on 900px laptops. Wider column + clamp capped at 4.25rem
            makes the designed lockup actually render AND keeps the
            primary CTA above the fold. */}
        <div className="col-span-6 flex flex-col justify-between border-r border-[var(--ink)] px-10 py-10 lg:px-14 lg:py-12">
          {/* Top: masthead meta strip */}
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            <span>Davis Trip Holidays</span>
            <span className="tabular-nums">Manali · EST. 2022</span>
          </div>

          {/* Middle: display headline + body — strict 8px rhythm */}
          <div className="py-8">
            {/* Micro-credential strip — stars + rating, no pill */}
            <div className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)]">
              <span className="tabular-nums">{rating}</span>
              <span className="flex items-center gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="inline-block h-2 w-2 rotate-45 bg-[var(--ink)]"
                  />
                ))}
              </span>
              <span className="text-[var(--ink-muted)]">
                · {reviewCount.toLocaleString("en-IN")}+ reviews
              </span>
            </div>

            {/* H1 — Fraunces 300, sized so the lockup FITS the column:
                clamp caps at 4.25rem (68px) — "Himalayan holidays," (the
                longest line) measures 544px vs 608px usable at 1920, so all
                three lines render as designed at every desktop width. */}
            <h1
              className="font-display text-[clamp(2.5rem,1.1rem+2.9vw,4.25rem)] font-light leading-[0.98] tracking-[-0.03em] text-[var(--ink)]"
              style={{ fontVariationSettings: '"opsz" 96' }}
            >
              Himalayan holidays,
              <br />
              planned by people
              <br />
              <em className="font-display italic font-light">who live here.</em>
            </h1>

            {/* Body */}
            <p className="mt-8 max-w-[46ch] text-[16px] leading-[1.55] text-[var(--ink-soft)]">
              Customised travel packages, adventure trips and guided tours —
              across Himalayan valleys, Kashmir meadows and Rajasthan forts.
              Hosted end-to-end by our team in Manali. Private fleet, local
              drivers, real offices, real phone.
            </p>

            {/* CTAs — R10: primary is now a solid editorial button
                (affordance), secondary stays a quiet arrow-link. */}
            <div className="mt-8 flex items-center gap-8">
              <a
                href={whatsappLink(
                  "Hi Davis Trip Holidays! I'd like to plan a trip."
                )}
                onClick={tracked("whatsapp_click", {
                  location: "hero_primary",
                })}
                className="btn-solid"
              >
                Plan your trip
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <Link
                href="/packages"
                className="arrow-link text-[14px] text-[var(--ink-soft)]"
              >
                See packages
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          {/* Bottom: hairline + caption-style contact strip + scroll cue
              (R11: the cue tells first-time visitors the page advances one
              full plate at a time — the affordance the owner's experiment
              needs so nobody thinks the site is "stuck" after one wheel) */}
          <div>
            <hr className="hairline-ink mb-4" />
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="caption-ink mb-1">Speak to a planner</div>
                <a
                  href={BUSINESS.phoneHref}
                  className="font-display text-[16px] font-normal tracking-[-0.01em] text-[var(--ink)] hover:text-[var(--pine)] transition-colors tabular-nums"
                >
                  {BUSINESS.phone}
                </a>
              </div>
              <div className="fp-cue" aria-hidden>
                <span className="fp-cue-label">Scroll · plate 01/11</span>
                <span className="fp-cue-line" />
              </div>
              <div className="text-right">
                <div className="caption-ink mb-1">Office hours</div>
                <div className="text-[13px] text-[var(--ink-soft)] tabular-nums">
                  {BUSINESS.hours}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — full-bleed photo plates, 6 cols, crossfading */}
        <div className="col-span-6 relative overflow-hidden bg-[var(--pine-deep)]">
          <PlateStack active={active} />
          {/* Photo caption — bottom-left over photo, white text on dark fade.
              R13: scrim deepened (60→75%) — the cycling cover plates include
              bright skies (Goa coast) that starved the thin caption type. */}
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 via-black/20 to-transparent px-8 py-6 lg:px-10 lg:py-8">
            <PlateCaption active={active} />
          </div>
        </div>
      </div>

      {/* ─── MOBILE LAYOUT (<md) ───
          Photo on top (36svh), content below on paper. R12: the phone-number /
          office-hours strip is GONE on mobile (VLM: it read as a sticky footer
          eating the cover; the number already lives in the drawer, contact
          plate, CTA plate and footer). Its space goes to the photo instead —
          the cover should sell the mountains, not repeat contact details. */}
      <div className="fp-inner flex flex-col md:hidden">
        {/* Photo plates — R12: 36svh (was 30svh) — more of the actual
            photography visible at rest, still fits one phone viewport. */}
        <div className="relative h-[36svh] overflow-hidden bg-[var(--pine-deep)]">
          <PlateStack active={active} />
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 via-black/15 to-transparent px-5 pb-4 pt-16">
            <PlateCaption active={active} compact />
            <div className="mt-2">
              <PlateTicks active={active} count={PLATES.length} />
            </div>
          </div>
        </div>

        {/* Content block on paper */}
        <div className="flex flex-1 flex-col bg-[var(--paper)] px-5 pb-4 pt-4">
          {/* Masthead meta strip — R12: 10px → 11px (10px tracked caps are
              below comfortable arm's-length reading on phones). */}
          <div className="mb-3 flex items-center justify-between border-b border-[var(--ink)] pb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            <span>Davis Trip Holidays</span>
            <span className="tabular-nums">EST. 2022</span>
          </div>

          {/* Micro-credential */}
          <div className="mb-3 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">
            <span className="tabular-nums">{rating}</span>
            <span className="flex items-center gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="inline-block h-1.5 w-1.5 rotate-45 bg-[var(--ink)]"
                />
              ))}
            </span>
            <span className="text-[var(--ink-muted)]">
              · {reviewCount.toLocaleString("en-IN")}+ reviews
            </span>
          </div>

          {/* H1 */}
          <h1
            className="font-display text-display-lg text-[var(--ink)]"
            style={{ fontVariationSettings: '"opsz" 72' }}
          >
            Himalayan holidays, planned by people{" "}
            <em className="font-display italic font-light">who live here.</em>
          </h1>

          {/* Body — R12: 14px → 15px (VLM: "grey text becomes a blur at
              arm's length"). */}
          <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.55] text-[var(--ink-soft)]">
            Curated journeys through Himalayan valleys, Kashmir meadows and
            Rajasthan forts — hosted end-to-end by our team in Manali.
          </p>

          {/* CTAs — R10: solid full-width primary on mobile (thumb-reach
              affordance), secondary below as quiet link. */}
          <div className="mt-5 flex flex-col gap-3.5">
            <a
              href={whatsappLink(
                "Hi Davis Trip Holidays! I'd like to plan a trip."
              )}
              onClick={tracked("whatsapp_click", { location: "hero_primary" })}
              className="btn-solid w-full"
            >
              Plan your trip
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <Link
              href="/packages"
              className="arrow-link text-[14px] text-[var(--ink-soft)] self-center"
            >
              See packages
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          {/* Scroll cue — R12: now the closing element of the cover. The
              phone/hours strip was removed (drawer + footer + contact + CTA
              all carry it); the cue owns the bottom edge and centres. */}
          <div className="mt-auto flex flex-col items-center gap-3 pt-4">
            <div className="fp-cue" aria-hidden>
              <span className="fp-cue-label">Scroll · plate 01/11</span>
              <span className="fp-cue-line" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
