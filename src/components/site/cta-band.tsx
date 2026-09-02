"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { whatsappLink, BUSINESS } from "@/lib/site-config";
import { tracked } from "@/lib/analytics";

/**
 * CtaBand v6 — the back cover, full-page closing plate.
 *
 * R13: the plate filled only 54% of its viewport — a modest headline
 * floating in half a screen. A closing plate is the last argument, so it
 * now reads like a magazine back cover:
 *
 *   - The display line scales to the VIEWPORT (clamp caps 9rem) — the
 *     biggest type on the site, the emotional crescendo
 *   - A full-width action bar anchors the bottom edge: the WhatsApp
 *     button + office phone on the left, a three-row reassurance ledger
 *     on the right (all real, all stated elsewhere on the site)
 *   - Everything between breathes on purpose — the close is allowed air
 *     when the air is structured.
 */
const ASSURANCES = [
  "Reply within 2 working hours",
  "GST invoice for every booking",
  "No booking fee, no accounts",
] as const;

export function CtaBand() {
  return (
    <section
      id="cta"
      className="fp-plate bg-[var(--paper)]"
      aria-label="Plan your trip"
    >
      <div className="fp-inner mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-1 flex-col"
        >
          <p className="eyebrow-ink pt-6 sm:pt-8">Ready when you are</p>

          {/* The crescendo — biggest display type on the site, scaled to
              the viewport it owns. max-w forces the designed two-line
              break at every desktop width. */}
          <h2
            className="my-auto mb-6 max-w-[14ch] py-5 font-display text-[clamp(2.5rem,9vw,9rem)] font-light leading-[0.95] tracking-[-0.035em] text-[var(--ink)] sm:mt-auto sm:mb-24 sm:py-10"
            style={{ fontVariationSettings: '"opsz" 96' }}
          >
            Your mountains are{" "}
            <em className="font-display italic font-light">waiting.</em>
          </h2>

          <p className="max-w-[44ch] text-[14px] leading-[1.55] text-[var(--ink-soft)] sm:text-[16px]">
            One WhatsApp message, two minutes of your time, and a day-wise
            itinerary in your inbox within two working hours. Our Manali team
            handles the rest.
          </p>

          {/* Action bar — the plate's bottom edge. Button + phone left,
              reassurance ledger right. Phone leads; promises back it up. */}
          <div className="mt-6 border-t border-[var(--ink)] pt-5 sm:mt-10 sm:pt-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <a
                  href={whatsappLink(
                    "Hi Davis Trip Holidays! I'd like to plan a trip."
                  )}
                  onClick={tracked("whatsapp_click", { location: "cta_band" })}
                  className="btn-solid h-[56px] w-full px-8 text-[14px] sm:w-auto"
                >
                  Plan your trip
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
                <a href={BUSINESS.phoneHref} className="group inline-flex flex-col gap-1 sm:border-l sm:border-[var(--hairline-strong)] sm:pl-6">
                  <span className="caption-ink">Or call the office</span>
                  <span
                    className="font-display text-[20px] font-normal tracking-[-0.01em] text-[var(--ink)] underline decoration-[var(--hairline-strong)] underline-offset-[6px] transition-colors group-hover:text-[var(--pine)] tabular-nums sm:text-[22px]"
                    style={{ fontVariationSettings: '"opsz" 60' }}
                  >
                    {BUSINESS.phone}
                  </span>
                </a>
              </div>

              {/* Reassurance ledger — three quiet rows, hairline-separated.
                  Every line is a promise the site already makes elsewhere. */}
              <ul className="flex w-full flex-col sm:w-auto sm:items-end">
                {ASSURANCES.map((a) => (
                  <li
                    key={a}
                    className="flex items-baseline gap-3 border-b border-[var(--hairline)] py-1.5 sm:border-b-0 sm:py-2.5"
                  >
                    <span
                      className="hidden h-1 w-1 rotate-45 bg-[var(--ink)] sm:inline-block"
                      aria-hidden
                    />
                    <span className="caption-ink">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
