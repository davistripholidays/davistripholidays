import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, Mountain } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { PageHero } from "@/components/site/page-hero";
import { CinematicHeroBand } from "@/components/site/cinematic-band";
import { Gallery } from "@/components/site/gallery";
import { PackageCard } from "@/components/site/package-card";
import {
  destinationFromPrice,
  formatINR,
  getDestination,
  listDestinations,
  packageCards,
  packagesForDestination,
} from "@/lib/content";
import { whatsappLink } from "@/lib/site-config";

export function generateStaticParams() {
  return listDestinations().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) return {};
  return {
    title: d.seoTitle ?? `${d.name} Tour Packages`,
    description: d.seoDescription ?? d.tagline,
    alternates: { canonical: `/destinations/${d.slug}` },
    openGraph: {
      title: d.seoTitle ?? d.name,
      description: d.seoDescription ?? d.tagline,
      images: [{ url: d.heroImage, alt: d.heroAlt }],
    },
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) notFound();

  const packages = packagesForDestination(slug).map((p) => ({
    slug: p.slug,
    name: p.name,
    duration: p.duration,
    priceFrom: p.priceFrom,
    strikePrice: p.strikePrice,
    category: p.category,
    heroImage: p.heroImage,
    heroAlt: p.heroAlt,
    destinationName: d.name,
    destinationSlug: d.slug,
    highlights: p.itinerary.map((i) => i.title),
  }));
  const from = destinationFromPrice(slug);

  const facts = [
    { icon: CalendarDays, label: "Best season", value: d.bestSeason },
    { icon: Clock, label: "Ideal duration", value: d.idealDuration },
    { icon: Mountain, label: "Packages", value: `${packages.length} ready itinerar${packages.length === 1 ? "y" : "ies"}` },
    { icon: MapPin, label: "Region", value: d.region },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      name: d.name,
      description: d.seoDescription ?? d.tagline,
      image: d.heroImage,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://davistripholidays.com" },
        { "@type": "ListItem", position: 2, name: "Destinations", item: "https://davistripholidays.com/destinations" },
        { "@type": "ListItem", position: 3, name: d.name },
      ],
    },
  ];

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd[0]) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd[1]) }} />

      <PageHero
        eyebrow={d.region}
        title={`${d.name} — ${d.tagline}`}
        breadcrumbs={[{ label: "Destinations", href: "/destinations" }, { label: d.name }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Cinematic hero band — Ken Burns + scroll parallax */}
        <CinematicHeroBand
          image={d.heroImage}
          alt={d.heroAlt}
          className="aspect-[16/10] w-full sm:aspect-[21/9]"
          overlayPill={
            from != null ? (
              <p className="rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-sm font-semibold text-white shadow-sm backdrop-blur-md">
                Packages from <span className="text-gold-light">{formatINR(from)}</span> per person
              </p>
            ) : undefined
          }
        />

        {/* Quick facts — luggage-label styling, travel-document feel */}
        <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="stamp-tag flex items-start gap-3 p-4 transition-shadow hover:shadow-md">
              <f.icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent" aria-hidden strokeWidth={1.75} />
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{f.label}</dt>
                <dd className="mt-1 font-display text-[15px] font-semibold leading-snug text-foreground">{f.value}</dd>
              </div>
            </div>
          ))}
        </dl>

        {/* Overview + gallery */}
        <div className="mt-12 grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="font-display text-2xl font-bold text-foreground">About {d.name}</h2>
            <div className="mt-4 space-y-4 measure">
              {d.overview
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i} className="text-pretty leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/customize?destination=${encodeURIComponent(d.name)}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-md transition-transform hover:scale-[1.02] hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-ring"
              >
                Customise a {d.name} trip
              </Link>
              <a
                href={whatsappLink(`Hi! I'm interested in a ${d.name} trip. Please share details.`)}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-ring"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
          <div className="lg:col-span-2">
            {d.gallery.length > 0 && (
              <>
                <h2 className="font-display text-2xl font-bold text-foreground">Photos</h2>
                <div className="mt-4">
                  <Gallery images={d.gallery} alt={d.name} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Packages */}
        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              {d.name} packages
            </h2>
            <Link href="/packages" className="text-sm font-semibold text-primary hover:text-accent">
              View all packages →
            </Link>
          </div>
          {packages.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((p) => (
                <PackageCard key={p.slug} p={p} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <p className="text-sm leading-relaxed text-muted-foreground">
                We&apos;re preparing ready itineraries for {d.name}. In the meantime, we plan
                custom trips here every week — tell us your dates and we&apos;ll send a plan
                within 2 working hours.
              </p>
              <Link
                href={`/customize?destination=${encodeURIComponent(d.name)}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get a custom {d.name} plan
              </Link>
            </div>
          )}
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Prices are indicative and vary with travel dates, hotel availability and group size.
            Every booking receives a GST invoice.
          </p>
        </div>

        {/* Other destinations */}
        <div className="mt-16 border-t border-border pt-10">
          <h2 className="font-display text-xl font-bold text-foreground">Explore other destinations</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {listDestinations()
              .filter((x) => x.slug !== d.slug)
              .map((x) => (
                <Link
                  key={x.slug}
                  href={`/destinations/${x.slug}`}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {x.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
