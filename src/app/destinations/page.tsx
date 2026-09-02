import type { Metadata } from "next";
import { SiteShell } from "@/components/site/site-shell";
import { PageHero } from "@/components/site/page-hero";
import { DestinationCard } from "@/components/site/destination-card";
import { destinationCards } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tour Destinations — Manali & Spiti Valley, Himachal Pradesh",
  description:
    "Manali group tours and the full Spiti Valley circuit — ready-to-book itineraries with honest starting prices, planned by a Manali-based team that runs these roads year-round. Custom trips anywhere in India on request.",
  alternates: { canonical: "/destinations" },
};

export default function DestinationsPage() {
  const destinations = destinationCards();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Where to next?"
        title="Destinations we know road-by-road"
        description="Manali and Spiti — the two valleys we know road-by-road. Ready-to-book itineraries, honest starting prices and the freedom to customise every single day."
        breadcrumbs={[{ label: "Destinations" }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8" aria-label="All destinations">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <DestinationCard key={d.slug} d={d} />
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          Want somewhere that isn&apos;t listed — Ladakh, Northeast beyond Meghalaya,
          Andaman, or an international trip like Thailand or Dubai?{" "}
          <a href="/customize" className="font-semibold text-primary hover:text-accent">
            Ask us for a custom plan
          </a>{" "}
          — if we can&apos;t run it well ourselves, we&apos;ll tell you honestly.
        </p>
      </section>
    </SiteShell>
  );
}
