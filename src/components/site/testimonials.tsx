"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { RATINGS } from "@/lib/site-config";
import type { TestimonialCardData } from "@/lib/types";

/**
 * Testimonials v6 — Atlas Field Journal.
 *
 * Full-bleed single-quote carousel. Magazine pull-quote feel.
 * Each slide: small star rating strip + huge Fraunces italic 300 quote +
 * single attribution line. Dots replaced with linear counter. Arrows are
 * small text links.
 */
export function Testimonials({
  testimonials,
}: {
  testimonials: TestimonialCardData[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
  });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || reduced || paused || testimonials.length < 2) return;
    const id = setInterval(() => emblaApi.scrollNext(), 9000);
    return () => clearInterval(id);
  }, [emblaApi, reduced, paused, testimonials.length]);

  const staticMode = reduced;
  const visible = staticMode ? testimonials.slice(0, 1) : testimonials;

  return (
    <section
      id="reviews"
      className="fp-plate section-y-loose bg-[var(--paper)]"
      aria-label="Customer reviews"
    >
      <div className="fp-inner mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-10">
        {/* Section header — R6 P1 #6: baseline-aligned lockup.
            R12 mobile: tighter pb so the plate keeps its one-viewport fit
            after the taller tap targets below. */}
        <div className="section-intro grid grid-cols-12 gap-x-6 gap-y-4 border-b border-[var(--ink)] pb-8 sm:gap-y-6 sm:pb-10 lg:pb-12">
          <div className="col-span-12 sm:col-span-2 lg:col-span-1 self-baseline">
            <span className="font-display text-[44px] font-light leading-[0.85] tracking-[-0.05em] text-[var(--ink)] tabular-nums sm:text-[56px] lg:text-[72px]">
              05
            </span>
          </div>
          <div className="col-span-12 sm:col-span-10 lg:col-span-7">
            <p className="eyebrow mb-3">What travellers say</p>
            <h2
              className="font-display text-display-lg text-[var(--ink)]"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              From real trips,{" "}
              <em className="font-display italic font-light">in their words.</em>
            </h2>
          </div>
        </div>

        {/* Carousel — R8: strict rhythm from header HR down: 40/48px to
            rating strip, 24px stars->quote, 48px quote->attribution,
            40px attribution->controls. Single 24px-base unit grid. */}
        <div
          className="mt-6 sm:mt-8 lg:mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div
            ref={emblaRef}
            className="overflow-hidden"
            role="region"
            aria-roledescription="carousel"
            aria-label="Traveller reviews"
          >
            <div className="flex">
              {visible.map((t) => (
                <figure
                  key={t.name + t.trip}
                  className="min-w-0 shrink-0 grow-0 basis-full"
                  role="group"
                  aria-roledescription="slide"
                >
                  <div className="mx-auto max-w-[1100px] px-0">
                    {/* Star rating strip — small diamonds, not standard stars.
                        R8: stars->quote gap locked to 24px (removed the extra
                        32px mt-8 on the quote — the sum was an arbitrary 56px). */}
                    <div
                      className="flex items-center gap-2 mb-6"
                      aria-label={`${t.rating} out of 5`}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`inline-block h-2 w-2 rotate-45 ${
                            i < t.rating
                              ? "bg-[var(--ink)]"
                              : "bg-[var(--hairline-strong)]"
                          }`}
                          aria-hidden
                        />
                      ))}
                      {/* R9: rating label now uppercase tracked caption —
                          reads as part of the caption system, not a stray
                          platform widget. */}
                      <span className="ml-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--ink-muted)] tabular-nums">
                        {t.rating}.0 · {t.platform}
                      </span>
                    </div>

                    {/* Pull quote — Fraunces italic 300, scaled one notch
                        bigger in R13 (the plate's centrepiece, cap 2.75rem). */}
                    <blockquote
                      className="pullquote text-[clamp(1.5rem,1rem+3vw,2.75rem)] text-[var(--ink)]"
                      style={{ fontVariationSettings: '"opsz" 96' }}
                    >
                      {t.quote}
                    </blockquote>

                    {/* Attribution — R8 restructure: name + Verified badge share
                        one baseline row. R9: gap 48 -> 36px per magazine
                        convention (quote close -> attribution). */}
                    <figcaption className="mt-9 border-t border-[var(--hairline)] pt-6">
                      <div className="flex items-baseline justify-between gap-6">
                        <p className="text-[15px] font-semibold text-[var(--ink)]">
                          {t.name}
                        </p>
                        <p className="caption-ink tabular-nums shrink-0">
                          Verified · {t.platform}
                        </p>
                      </div>
                      <p className="caption-ink mt-1.5">
                        {t.origin} · {t.trip}
                      </p>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </div>

          {/* Progress hairline — where you are in the deck. Filled
              portion tracks the selected slide; editorial, no dots. */}
          {!staticMode && (
            <div
              className="relative mx-auto mt-6 h-px max-w-[1100px] bg-[var(--hairline-strong)] sm:mt-8"
              aria-hidden
            >
              <span
                className="absolute inset-y-0 left-0 bg-[var(--ink)] transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  width: `${
                    ((selected + 1) / testimonials.length) * 100
                  }%`,
                }}
              />
            </div>
          )}

          {/* Controls — R13: link-style PREV/NEXT (underline affordance),
              44px touch targets retained from R12. */}
          {!staticMode && (
            <div className="mx-auto mt-6 flex max-w-[1100px] items-center justify-between gap-6 sm:mt-8">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                aria-label="Previous review"
                className="group -my-3.5 inline-flex items-center gap-1.5 border-b border-[var(--ink)] py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)] transition-colors hover:border-[var(--pine)] hover:text-[var(--pine)] sm:-my-3 sm:py-3"
              >
                <ArrowLeft
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
                  aria-hidden
                />
                Prev
              </button>

              {/* Linear counter — R9: slash+total bumped to 55% opacity +
                  12px (VLM: "nearly invisible"). */}
              <div className="flex items-baseline gap-1.5 tabular-nums">
                <span className="font-display text-[18px] font-light tracking-[-0.01em] text-[var(--ink)]">
                  {String(selected + 1).padStart(2, "0")}
                </span>
                <span className="text-[12px] text-[var(--ink)] opacity-55">/</span>
                <span className="text-[12px] text-[var(--ink)] opacity-55">
                  {String(testimonials.length).padStart(2, "0")}
                </span>
              </div>

              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                aria-label="Next review"
                className="group -my-3.5 inline-flex items-center gap-1.5 border-b border-[var(--ink)] py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)] transition-colors hover:border-[var(--pine)] hover:text-[var(--pine)] sm:-my-3 sm:py-3"
              >
                Next
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </button>
            </div>
          )}

          {/* Exit row — every review, on the platform it was written on.
              The carousel shows three; the ledger lives outside. Real
              links, real counts (44 Google · 50 JustDial). */}
          <div className="mx-auto mt-6 flex max-w-[1100px] flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--hairline-strong)] pt-4 sm:mt-8 sm:gap-x-10 sm:pt-6">
            <p className="caption-ink shrink-0">
              All {RATINGS.google.count + RATINGS.justdial.count}+ reviews,
              where they were written
            </p>
            <div className="flex items-center gap-6">
              <a
                href={RATINGS.google.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink)] underline decoration-[var(--hairline-strong)] underline-offset-4 transition-colors hover:text-[var(--pine)] hover:decoration-[var(--pine)]"
              >
                Google
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
              <a
                href={RATINGS.justdial.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink)] underline decoration-[var(--hairline-strong)] underline-offset-4 transition-colors hover:text-[var(--pine)] hover:decoration-[var(--pine)]"
              >
                JustDial
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
