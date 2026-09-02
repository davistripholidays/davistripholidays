import type { Metadata } from "next";
import { SiteShell } from "@/components/site/site-shell";
import { PageHero } from "@/components/site/page-hero";
import { PackagesFilter } from "@/components/site/packages-filter";
import { FeaturedPackageCard } from "@/components/site/featured-package-card";
import { listDestinations, listPackages, packageCards } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tour Packages — Manali Group Tours & Spiti Valley Circuit",
  description:
    "Ready-to-book tour packages with day-wise itineraries, clear inclusions and GST invoicing. Every package customisable — hotels, duration and route.",
  alternates: { canonical: "/packages" },
};

export default function PackagesPage() {
  const packages = packageCards(); // bestsellers lead the grid order too
  const destinations = listDestinations().map((d) => ({ slug: d.slug, name: d.name }));
  const docs = listPackages();
  // "Most booked" rail: the owner's three verified best-sellers (source:
  // owner PDF drop 2026-08-31 — "the trips people mostly buy from us"),
  // then any other featured tours with verified prices.
  const bySlug = new Map(docs.map((p) => [p.slug, p]));
  const featured = packages
    .filter((p) => bySlug.get(p.slug)?.bestseller || bySlug.get(p.slug)?.featured)
    .sort(
      (a, b) =>
        Number(Boolean(bySlug.get(b.slug)?.bestseller)) -
          Number(Boolean(bySlug.get(a.slug)?.bestseller)) ||
        Number(b.priceFrom > 0) - Number(a.priceFrom > 0)
    )
    .slice(0, 2)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      duration: p.duration,
      priceFrom: p.priceFrom,
      strikePrice: p.strikePrice,
      category: p.category,
      heroImage: p.heroImage,
      heroAlt: p.heroAlt,
      destinationName: p.destinationName,
      destinationSlug: p.destinationSlug,
      highlights: p.highlights,
      bestseller: p.bestseller,
    }));

  return (
    <SiteShell>
      <PageHero
        eyebrow="Ready-to-book itineraries"
        title="Handcrafted tours, honestly priced"
        description="Every package lists its day-wise itinerary, inclusions and exclusions up front — no hidden costs, no surprise supplements. And every itinerary can be tailored around your dates, hotels and budget."
        breadcrumbs={[{ label: "Packages" }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8" aria-label="All tour packages">
        {/* Curated rail — breaks the grid monotony with an editorial
            opening (VLM round-3: "curate, don't list 14 identical cards") */}
        {featured.length > 0 && (
          <div className="mb-14">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Owner&rsquo;s picks
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold text-foreground sm:text-[1.75rem]">
                  Most booked this season
                </h2>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {featured.slice(0, 2).map((p) => (
                <FeaturedPackageCard key={p.slug} p={p} />
              ))}
            </div>
          </div>
        )}

        <PackagesFilter packages={packages} destinations={destinations} />
        <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
          Published prices are verified starting points per person on twin sharing; packages marked
          &ldquo;on request&rdquo; are quoted individually. Every quote varies with travel dates, hotel category,
          vehicle choice and group size, and is shared in writing before any payment — with a proper
          GST invoice for every booking.
        </p>
      </section>
    </SiteShell>
  );
}
