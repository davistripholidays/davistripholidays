import type { Metadata } from "next";
import Image from "next/image";
import { Compass, ShieldCheck, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { BRAND, RATINGS } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us — Manali-Based, Trust-First Travel Planning",
  description:
    "Founded by travel consultant Anil Kumar in 2022, Davis Trip Holidays is a Manali-based team of four with its own vehicle fleet — Building Trust, Creating Experiences, Inspiring Journeys.",
  alternates: { canonical: "/about" },
};

const PILLAR_ICONS = [ShieldCheck, Sparkles, Compass];

export default function AboutPage() {
  const stats = [
    { value: `${BRAND.founder.startYear}`, label: "Founded in Manali" },
    { value: `${BRAND.founder.teamSize}`, label: "In-house travel team" },
    { value: `${RATINGS.justdial.count + RATINGS.google.count}+`, label: "Verified reviews" },
    { value: "4.9★", label: "Average rating" },
  ];

  return (
    <SiteShell>
      <PageHero
        eyebrow="Your Journey, Our Responsibility."
        title="About Davis Trip Holidays"
        description="A Manali-based travel company built on a simple belief — travel planning should be simple, transparent and personal."
        breadcrumbs={[{ label: "About" }]}
      />

      {/* Vision statement */}
      <section className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
        <blockquote className="text-balance font-display text-2xl font-medium italic leading-snug text-foreground sm:text-3xl">
          &ldquo;{BRAND.vision}&rdquo;
        </blockquote>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Explore. Experience. Remember.
        </p>
      </section>

      {/* Promise + pillars — editorial numbered list, not boxy cards */}
      <section className="texture-contour border-y border-border/70 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              What we stand for
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{BRAND.promise}</p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl divide-y divide-border/70 rounded-3xl border border-border bg-card px-6 shadow-[0_1px_2px_rgba(31,61,51,0.05)] sm:px-10">
            {BRAND.pillars.map((pillar, i) => {
              const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
              return (
                <div
                  key={pillar.title}
                  className="flex flex-col gap-4 py-8 first:pt-9 last:pb-9 sm:flex-row sm:items-start sm:gap-8"
                >
                  <span className="day-numeral shrink-0 font-display text-3xl font-bold leading-none text-accent/50 sm:text-4xl">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-foreground">
                      <Icon className="h-4.5 w-4.5 text-accent" aria-hidden strokeWidth={1.75} />
                      {pillar.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats — hairline-divided row, display numerals */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className="relative text-center lg:text-left">
              <span
                className="absolute left-1/2 top-0 hidden h-0.5 w-10 -translate-x-1/2 rounded-full bg-gold/60 lg:left-0 lg:translate-x-0"
                aria-hidden
              />
              <dd className="font-display text-4xl font-bold leading-none text-foreground sm:text-[2.6rem]">
                {s.value}
              </dd>
              <dt className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {s.label}
              </dt>
              <span className="sr-only">{i + 1} of {stats.length}</span>
            </div>
          ))}
        </dl>
      </section>

      {/* Founder — real details provided by owner 2026-08-27.
          Portrait: editorial watercolour illustration (clearly hand-painted,
          not a photo) stands in until the owner supplies a real photograph. */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-[0_2px_24px_-8px_rgba(31,61,51,0.12)] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Illustration panel — arched frame, warm sand mat */}
          <div className="relative min-h-[300px] bg-sand">
            <Image
              src="/img/founder-illustration.png"
              alt="Watercolour illustration of founder Anil Kumar looking over the Manali valley"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover object-top"
            />
            <p className="absolute bottom-3 left-1/2 w-max max-w-full -translate-x-1/2 rounded-full bg-white/85 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/70 shadow-sm backdrop-blur-sm">
              Illustration — photo coming soon
            </p>
          </div>
          {/* Text panel */}
          <div className="p-6 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              The people behind the promise
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground">
              {BRAND.founder.name}
            </h2>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {BRAND.founder.role} · since {BRAND.founder.startYear}
            </p>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              {BRAND.founder.bio} Every itinerary that leaves our office is planned the way he
              would plan it for his own family — which is why his name keeps appearing in
              customer thank-you notes.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
              {[`Founded ${BRAND.founder.startYear}`, `Team of ${BRAND.founder.teamSize}`, "Based in Manali", "3+ years designing itineraries"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-secondary px-3.5 py-1.5 text-muted-foreground ring-1 ring-border"
                >
                  {chip}
                </span>
              ))}
            </div>
            <p className="mt-6 border-t border-border pt-5 text-sm italic leading-relaxed text-muted-foreground">
              {BRAND.founderNote}
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </SiteShell>
  );
}
