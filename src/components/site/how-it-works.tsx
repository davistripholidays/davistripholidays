"use client";

import { motion } from "framer-motion";
import { HOW_IT_WORKS } from "@/lib/site-config";

/**
 * HowItWorks v5 — Atlas Field Journal, full-page plate.
 *
 * R13: the plate measured only 54% viewport fill — three slim columns
 * floating in half a viewport of dead air. A fullpage plate needs a
 * complete SPREAD, so the section now closes like a magazine feature:
 *
 *   - Step numerals scaled up (72 → 88px desktop) — the plate's backbone
 *   - Each column gains a bottom META row (hairline-topped, real fact:
 *     2 minutes / free revisions / 24×7 helpline)
 *   - NEW closing "journey timeline": three hairline nodes spanning the
 *     full width — First message → Itinerary in writing → Departure —
 *     owning the bottom edge of the viewport
 */
const STEP_META = [
  { k: "2 minutes", v: "all we need to start" },
  { k: "Revisions free", v: "until it's your trip" },
  { k: "24×7 helpline", v: "while you travel" },
] as const;

const JOURNEY = [
  { k: "First message", v: "WhatsApp, a call, or the form" },
  { k: "Itinerary in writing", v: "Day-wise, all-inclusive quote" },
  { k: "Departure", v: "Our vehicle, our coordinator" },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="fp-plate section-y bg-[var(--paper)]"
      aria-label="How booking works"
    >
      <div className="fp-inner mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 sm:px-8 lg:px-10">
        {/* Section header */}
        <div className="section-intro grid grid-cols-12 gap-x-6 gap-y-3 border-b border-[var(--ink)] pb-6 sm:gap-y-4 sm:pb-8 lg:pb-10">
          <div className="col-span-12 sm:col-span-2 lg:col-span-1 self-baseline">
            <span className="font-display text-[44px] font-light leading-[0.85] tracking-[-0.05em] text-[var(--ink)] tabular-nums sm:text-[56px] lg:text-[72px]">
              03
            </span>
          </div>
          <div className="col-span-12 sm:col-span-10 lg:col-span-7">
            <p className="eyebrow mb-3">How it works</p>
            <h2
              className="font-display text-display-lg text-[var(--ink)]"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Three steps.{" "}
              <em className="font-display italic font-light">No surprises.</em>
            </h2>
          </div>
          <div className="col-span-12 hidden self-baseline lg:col-span-4 lg:text-right">
            <p className="caption">No accounts · No booking fees · 24×7 line</p>
          </div>
        </div>

        {/* The three steps — full-height columns.
            Desktop: numerals 88px, body 15px, meta row anchors the bottom
            of each column (mt-auto). Phones keep the tight stack (the
            journey strip below carries the extra weight instead). */}
        <ol className="mt-3 grid flex-1 grid-cols-1 gap-x-8 gap-y-4 sm:mt-8 sm:grid-cols-3 lg:mt-10 lg:gap-x-12">
          {HOW_IT_WORKS.map((s, i) => (
            <motion.li
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col border-t border-[var(--hairline-strong)] pt-3 sm:pt-6"
            >
              {/* Numeral + step counter row */}
              <div className="flex items-baseline justify-between gap-4">
                <span
                  className="font-display text-[36px] font-light leading-[0.85] tracking-[-0.04em] text-[var(--ink)] tabular-nums sm:text-[64px] lg:text-[88px]"
                  style={{ fontVariationSettings: '"opsz" 144' }}
                >
                  {s.step}
                </span>
                <span className="caption tabular-nums">Step {i + 1}/3</span>
              </div>

              <h3
                className="mt-2 font-display text-[17px] font-normal leading-[1.15] tracking-[-0.015em] text-[var(--ink)] sm:mt-4 sm:text-[21px]"
                style={{ fontVariationSettings: '"opsz" 40' }}
              >
                {s.title}
              </h3>
              <p className="mt-2 max-w-[46ch] text-[12.5px] leading-[1.55] text-[var(--ink-soft)] sm:mt-3 sm:text-[15px] sm:leading-[1.65]">
                {s.body}
              </p>

              {/* Meta row — the column's footer. A real fact, anchored to
                  the bottom edge of the spread. Phones skip it (the
                  journey strip below carries the facts there). */}
              <div className="mt-auto hidden border-t border-[var(--hairline)] pt-4 sm:mt-6 sm:flex sm:items-baseline sm:gap-3">
                <span className="font-display text-[16px] font-light italic tracking-[-0.01em] text-[var(--ink)]">
                  {STEP_META[i].k}
                </span>
                <span className="caption-ink">{STEP_META[i].v}</span>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* Journey timeline — the closing strip that owns the bottom of
            the plate. Desktop: three nodes on one hairline (message →
            writing → departure), dots sit ON the rule. Phones: one quiet
            caption line — the plate is already full above. */}
        <div className="mt-4 border-t-2 border-[var(--ink)] pt-3.5 sm:mt-12 sm:pt-6">
          <div className="hidden sm:grid sm:grid-cols-3 sm:gap-8">
            {JOURNEY.map((n, i) => (
              <div key={n.k} className="relative sm:pt-1">
                {/* The node dot — sits on the top rule, desktop only */}
                <span
                  className="absolute -top-[30px] left-0 hidden h-[5px] w-[5px] rounded-full bg-[var(--ink)] sm:block"
                  aria-hidden
                />
                <div className="flex items-baseline gap-2.5">
                  <span className="caption-ink tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[15px] font-normal tracking-[-0.01em] text-[var(--ink)] sm:text-[16px]">
                    {n.k}
                  </span>
                </div>
                <p className="caption-ink mt-1 sm:pl-[26px]">{n.v}</p>
              </div>
            ))}
          </div>
          <p className="caption mt-4 sm:mt-6">
            First message to departure — no accounts, no booking fees.
          </p>
        </div>
      </div>
    </section>
  );
}
