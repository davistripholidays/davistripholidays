import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FlaskConical } from "lucide-react";
import { packageCards } from "@/lib/content";
import { HorizontalRail } from "@/components/lab/horizontal-rail";
import { FullscreenDeck } from "@/components/lab/fullscreen-deck";
import { FullpagePlates } from "@/components/lab/fullpage-plates";
import { whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Design Lab — scroll experiments",
  description:
    "Isolated experiments: alternative ways to browse tour packages. Not part of the live site.",
  robots: { index: false, follow: false },
};

/**
 * /lab — ISOLATED experiment route (owner request, R10 → R11).
 *
 * The lab keeps EVERY experiment the owner has tested — nothing gets
 * deleted when a pattern is promoted. R11 state:
 *   A — horizontal rail  → pattern LIVE (homepage destinations plate)
 *   B — full-screen deck → still testing, not on the live site
 *   C — full-page plates → PROMOTED — live on the whole homepage
 *
 * noindex so it never pollutes SEO.
 */

const EXPERIMENTS = [
  {
    id: "experiment-a",
    letter: "A",
    title: "Horizontal snap rail",
    blurb: "Cards swipe sideways — Netflix-style, no scroll trap.",
    status: "Pattern live",
    live: "partial" as const,
  },
  {
    id: "experiment-b",
    letter: "B",
    title: "Full-screen scroll deck",
    blurb: "One package owns the whole screen, Apple-style pinning.",
    status: "In the lab",
    live: false as const,
  },
  {
    id: "experiment-c",
    letter: "C",
    title: "One plate at a time",
    blurb: "Every section = exactly one viewport, site-wide.",
    status: "Live on homepage",
    live: true as const,
  },
];

export default function LabPage() {
  const packages = packageCards(true).slice(0, 4);
  const images = [
    "/images/spiti.jpg",
    "/images/shimla.jpg",
    "/images/gallery/manali-2.jpg",
    "/images/gallery/kashmir-1.jpg",
  ];

  return (
    <main className="bg-[var(--paper)]">
      {/* Lab masthead */}
      <header className="border-b border-[var(--ink)]">
        <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-[56ch]">
              <div className="flex items-center gap-3">
                <FlaskConical className="h-4 w-4 text-[var(--ink)]" aria-hidden />
                <p className="eyebrow-ink">Davis Trip Holidays · Design lab</p>
              </div>
              <h1
                className="mt-4 font-display text-display-lg text-[var(--ink)]"
                style={{ fontVariationSettings: '"opsz" 72' }}
              >
                The lab.{" "}
                <em className="font-display italic font-light">
                  Every experiment, kept.
                </em>
              </h1>
              <p className="mt-5 max-w-[56ch] text-[15px] leading-[1.55] text-[var(--ink-soft)]">
                Three experiments for how the site moves. Test each on your
                phone and your laptop. Experiment C — one section at a time —
                is now live on the homepage; A&apos;s rail pattern runs the
                destinations plate. B stays here, still on trial. Nothing is
                ever deleted: promoted patterns keep their original here for
                reference.
              </p>
            </div>
            <Link href="/" className="btn-solid h-11 px-5 text-[12px]">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Back to site
            </Link>
          </div>

          {/* Experiment index */}
          <nav
            className="mt-10 grid grid-cols-1 gap-px border border-[var(--ink)] bg-[var(--ink)] sm:grid-cols-3"
            aria-label="Experiment index"
          >
            {EXPERIMENTS.map((e) => (
              <a
                key={e.id}
                href={`#${e.id}`}
                className="group flex flex-col gap-3 bg-[var(--paper)] p-6 transition-colors hover:bg-[var(--paper-soft)] sm:p-7"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-[40px] font-light leading-[0.85] text-[var(--ink)]">
                    {e.letter}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] ${
                      e.live === true
                        ? "bg-[var(--ink)] text-[var(--paper)]"
                        : "border border-[var(--ink)] text-[var(--ink)]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 ${
                        e.live === true
                          ? "rounded-full bg-[#7FBF8E]"
                          : e.live === "partial"
                            ? "rotate-45 bg-[var(--ember)]"
                            : "rounded-full bg-[var(--hairline-strong)]"
                      }`}
                      aria-hidden
                    />
                    {e.status}
                  </span>
                </div>
                <p className="font-display text-[18px] font-normal leading-[1.15] text-[var(--ink)]">
                  {e.title}
                </p>
                <p className="text-[13px] leading-[1.5] text-[var(--ink-soft)]">
                  {e.blurb}
                </p>
                <p className="caption mt-auto pt-2 text-[var(--ink)] opacity-60 transition-opacity group-hover:opacity-100">
                  Jump to experiment ↓
                </p>
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* The experiments — A and B kept as-is (owner request), C new */}
      <HorizontalRail packages={packages} />
      <FullscreenDeck packages={packages} />
      <FullpagePlates images={images} />

      {/* Lab footer */}
      <footer className="bg-[var(--paper)]">
        <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-10">
          <hr className="hairline-ink mb-6" />
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-baseline">
            <p className="font-display text-[18px] italic font-light text-[var(--ink-soft)]">
              Verdicts go straight to the owner&apos;s WhatsApp — one line
              each is enough.
            </p>
            <a
              href={whatsappLink(
                "Hi! My verdict on the lab: A ___, B ___, C ___ (keep / change / drop).",
              )}
              className="arrow-link text-[13px] text-[var(--ink)]"
            >
              Send your verdict
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
