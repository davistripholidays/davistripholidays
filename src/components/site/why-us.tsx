"use client";

import { motion } from "framer-motion";
import { BUSINESS, RATINGS, FLEET, BRAND } from "@/lib/site-config";

/**
 * WhyUs v5 — the dark quote spread, full-page plate.
 *
 * R13: the plate filled only 60% of its viewport — a mid-size quote
 * drifting in a dark void. The spread now earns its full page:
 *
 *   - The pullquote scales up (cap 3.25rem desktop / 26px phones) — the
 *     founder's voice at the size the argument deserves
 *   - The quiet meta strip becomes a four-cell stat row (fleet size with
 *     range, HQ, team, GSTIN) with supporting subcaptions
 *   - Same pine-deep confidence — no glows, no patterns, just bigger type
 */
export function WhyUs() {
  const reviewCount = RATINGS.google.count + RATINGS.justdial.count;
  const rating = RATINGS.google.score.toFixed(1);

  const stats = [
    {
      v: String(FLEET.length),
      l: "Vehicles in private fleet",
      s: "Sedans to 52-seat coaches",
      mobile: true,
    },
    {
      v: "Manali HQ",
      l: "Local team, not call-centre",
      s: "Office open daily",
      mobile: true,
    },
    {
      v: String(BRAND.founder.teamSize),
      l: "People on the ground",
      s: "Coordinators, drivers, planners",
      mobile: true,
    },
    {
      v: BUSINESS.gstin,
      l: "GST-registered, MSME-certified",
      s: `Udyam ${BUSINESS.msme}`,
      mobile: false,
    },
  ];

  return (
    <section
      id="why-us"
      className="fp-plate section-y-loose relative isolate overflow-hidden bg-[var(--pine-deep)]"
      aria-label="Why travel with us"
    >
      {/* Top hairline — visible against paper background */}
      <div className="border-t border-[var(--ink)]" />

      <div className="fp-inner mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 sm:px-8 lg:px-10">
        {/* Section header */}
        <div className="section-intro grid grid-cols-12 gap-x-6 gap-y-6">
          <div className="col-span-12 lg:col-span-1 self-baseline">
            <span className="font-display text-[44px] font-light leading-[0.85] tracking-[-0.05em] text-[var(--paper)] tabular-nums sm:text-[56px] lg:text-[72px]">
              04
            </span>
          </div>
          <div className="col-span-12 lg:col-span-11">
            <p className="eyebrow-light">Why Davis</p>
          </div>
        </div>

        {/* Pull quote — the founder's argument at full spread scale */}
        <div className="mx-auto my-auto flex w-full max-w-[1100px] flex-col py-4 sm:py-10">
          <motion.blockquote
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(1.5rem,1rem+3.5vw,3.25rem)] font-light italic leading-[1.28] sm:leading-[1.18] tracking-[-0.015em] text-[#F5EDE4]"
            style={{ fontVariationSettings: '"opsz" 96' }}
          >
            We don&apos;t outsource your trip to a third party. Our Manali team
            accompanies every group, drives every vehicle, and answers every
            WhatsApp within two working hours. That&apos;s why{" "}
            <span className="not-italic">{reviewCount}+ travellers</span> have
            rated us <span className="not-italic">{rating} stars</span>.
          </motion.blockquote>

          {/* Attribution */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex items-baseline gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[rgba(246,241,232,0.55)] sm:mt-12"
          >
            <span className="h-px w-8 bg-[rgba(246,241,232,0.4)]" aria-hidden />
            Anil Kumar, Founder
          </motion.p>
        </div>

        {/* Stat row — four cells, hairline-topped, values at display scale.
            Phones see three (fleet, HQ, team); GSTIN is printed on the
            trust plate and footer — three strikes rule. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto grid w-full max-w-[1100px] grid-cols-2 gap-x-8 gap-y-6 border-t border-[rgba(246,241,232,0.18)] pt-5 sm:grid-cols-4 sm:pt-7"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className={`flex flex-col gap-1.5 ${s.mobile ? "" : "hidden sm:flex"}`}
            >
              <p
                className="font-display text-[22px] font-light italic tracking-[-0.02em] text-[var(--paper)] tabular-nums sm:text-[24px]"
                style={{ fontVariationSettings: '"opsz" 72' }}
              >
                {s.v}
              </p>
              <p className="caption-light">{s.l}</p>
              <p className="text-[10.5px] font-medium uppercase leading-[1.5] tracking-[0.06em] text-[rgba(246,241,232,0.4)]">
                {s.s}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
