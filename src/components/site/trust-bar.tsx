"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { RATINGS, BUSINESS, BRAND } from "@/lib/site-config";

/**
 * TrustBar v5 — "The Field Ledger", full-page data plate.
 *
 * R13: DOM measurement showed the old plate filled only 44% of its 828px
 * viewport — three floating numerals with ~460px of dead air (VLM: "feels
 * like it failed to load content"). A fullpage site can't have half-empty
 * viewports, so the plate is now a proper magazine DATA LEDGER:
 *
 *   - The three numerals stay as the headline (bigger: clamp caps 8.5rem)
 *   - Each column gains a hand-written FIELD NOTE (italic Fraunces) that
 *     owns the middle of the plate — editorial voice, not filler
 *   - Each column ends in hairline key/value rows + a live source link
 *     (Google/JustDial review URLs, GSTIN, Udyam, team size — all real)
 *   - Rows anchor bottom, numerals anchor top: the ledger owns the plate
 */
export function TrustBar() {
  const reviewCount = RATINGS.google.count + RATINGS.justdial.count;
  const verified = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const ledger = [
    {
      v: RATINGS.google.score.toFixed(1),
      l: "Google rating",
      note: "Every one left by a real traveller on a real trip — nothing bought, nothing traded.",
      rows: [
        {
          k: "Google",
          val: `${RATINGS.google.count} reviews`,
          href: RATINGS.google.url,
        },
        {
          k: "JustDial",
          val: `${RATINGS.justdial.count} reviews`,
          href: RATINGS.justdial.url,
        },
        { k: "Average", val: "across both platforms" },
      ],
      link: { label: "Read Google reviews", href: RATINGS.google.url },
    },
    {
      v: `${reviewCount.toLocaleString("en-IN")}+`,
      l: "Verified reviews",
      note: "Counted by hand, platform by platform, and re-checked every month since 2022.",
      rows: [
        { k: "Counted", val: "live, every month" },
        { k: "Platforms", val: "Google + JustDial" },
        {
          k: "Facebook",
          val: `${RATINGS.facebook.score.toFixed(1)} · ${RATINGS.facebook.count} reviews`,
          href: RATINGS.facebook.url,
        },
      ],
      link: { label: "Read JustDial reviews", href: RATINGS.justdial.url },
    },
    {
      v: BUSINESS.founded,
      l: "Year established",
      note: "A family business from day one — registered, taxed and answerable like one.",
      rows: [
        { k: "Registered", val: "GST company" },
        { k: "Udyam", val: BUSINESS.msme },
        { k: "Team", val: `${BRAND.founder.teamSize} people · Manali` },
      ],
      link: { label: "Meet the team", href: "/about" },
    },
  ];

  return (
    <section
      id="trust"
      className="fp-plate section-y border-b border-[var(--ink)] bg-[var(--paper)]"
      aria-label="Trust highlights"
    >
      <div className="fp-inner mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 sm:px-8 lg:px-10">
        {/* Plate header — eyebrow only, the numerals are the headline */}
        <div className="flex items-baseline justify-between gap-6 border-b border-[var(--ink)] pb-5 sm:pb-6">
          <p className="eyebrow-ink">Verified · by the numbers</p>
          <p className="caption-ink hidden sm:block">Plate 02 · Field data</p>
        </div>

        {/* The ledger — three full-height data columns.
            Desktop: divide-x columns. Mobile: stacked blocks with the same
            anatomy (numeral, note, rows) tightened to hold one viewport. */}
        <div
          className="
            flex flex-1 flex-col divide-y divide-[var(--hairline)]
            sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0
          "
        >
          {ledger.map((c, i) => (
            <div
              key={i}
              className={`flex flex-1 flex-col ${
                i === 0
                  ? "sm:pr-8 sm:pl-0 lg:pr-12"
                  : i === 2
                    ? "sm:pl-8 sm:pr-0 lg:pl-12"
                    : "sm:px-8 lg:px-12"
              } ${i === 0 ? "" : "pt-4 sm:pt-0"}`}
            >
              {/* Numeral + label — the column headline */}
              <div className="pb-3 pt-3 sm:pb-6 sm:pt-8 lg:pt-10">
                <p
                  className="font-display text-[clamp(2.75rem,9vw,10rem)] font-light leading-[0.9] tracking-[-0.04em] text-[var(--ink)] tabular-nums"
                  style={{ fontVariationSettings: '"opsz" 144, "tnum" 1' }}
                >
                  {c.v}
                </p>
                <p className="mt-2 text-[11px] font-medium uppercase leading-[1.5] tracking-[0.08em] text-[var(--ink-soft)] [font-feature-settings:'tnum'_1] sm:mt-3 sm:text-[11.5px]">
                  {c.l}
                </p>
              </div>

              {/* Field note — italic Fraunces, owns the middle slack.
                  my-auto centres it in whatever height the column has.
                  Phones skip it — the ledger rows carry the plate there. */}
              <p className="my-auto hidden max-w-[30ch] font-display text-[17px] font-light italic leading-[1.45] tracking-[-0.005em] text-[var(--ink-soft)] sm:block lg:text-[19px]">
                {c.note}
              </p>

              {/* Breakdown rows — key left, value right, hairline top.
                  Values that live on another platform link out. */}
              <div className="flex flex-col">
                {c.rows.map((r, j) => (
                  <div
                    key={j}
                    className="flex items-baseline justify-between gap-4 border-t border-[var(--hairline)] py-2 sm:py-3"
                  >
                    <span className="caption-ink shrink-0">{r.k}</span>
                    {r.href ? (
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-right text-[12px] font-medium leading-[1.45] tracking-[0.01em] text-[var(--ink)] underline decoration-[var(--hairline-strong)] underline-offset-4 transition-colors hover:text-[var(--pine)] hover:decoration-[var(--pine)] tabular-nums"
                      >
                        {r.val}
                      </a>
                    ) : (
                      <span className="text-right text-[12px] font-medium leading-[1.45] tracking-[0.01em] text-[var(--ink-soft)] tabular-nums">
                        {r.val}
                      </span>
                    )}
                  </div>
                ))}

                {/* Source link — the column's exit (desktop/tablet; the
                    row values above already link on every size). */}
                {c.link &&
                  (c.link.href.startsWith("/") ? (
                    <Link
                      href={c.link.href}
                      className="group mt-1 hidden items-center gap-1.5 border-t border-[var(--hairline)] py-3.5 text-[12.5px] font-medium tracking-[0.01em] text-[var(--ink)] transition-colors hover:text-[var(--pine)] sm:inline-flex"
                    >
                      {c.link.label}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  ) : (
                    <a
                      href={c.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-1 hidden items-center gap-1.5 border-t border-[var(--hairline)] py-3.5 text-[12.5px] font-medium tracking-[0.01em] text-[var(--ink)] transition-colors hover:text-[var(--pine)] sm:inline-flex"
                    >
                      {c.link.label}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </a>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footnote — where the numbers come from (honesty is the design). */}
        <div className="border-t border-[var(--hairline)] pt-3 sm:pt-4">
          <p className="text-[11.5px] font-medium leading-[1.5] tracking-[0.03em] text-[var(--ink-muted)] [font-feature-settings:'tnum'_1]">
            Counted live from Google &amp; JustDial · verified {verified} ·
            GSTIN {BUSINESS.gstin}
          </p>
        </div>
      </div>
    </section>
  );
}
