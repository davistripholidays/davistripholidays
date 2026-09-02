import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble,
  CalendarCheck,
  Check,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Settings2,
  Snowflake,
  Users,
  X,
} from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Gallery } from "@/components/site/gallery";
import { PackageCard } from "@/components/site/package-card";
import { MobilePriceBar } from "@/components/site/mobile-price-bar";
import { TrackView } from "@/lib/track-view";
import { TrackedLink } from "@/lib/tracked-link";
import { formatINR, getDestination, getPackage, listPackages, packagesForDestination } from "@/lib/content";
import { BUSINESS, whatsappLink } from "@/lib/site-config";

export function generateStaticParams() {
  return listPackages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPackage(slug);
  if (!p) return {};
  return {
    title: p.seoTitle ?? `${p.name} (${p.duration})`,
    description: p.seoDescription ?? p.overview.slice(0, 155),
    alternates: { canonical: `/packages/${p.slug}` },
    openGraph: {
      title: p.seoTitle ?? p.name,
      description: p.seoDescription ?? p.overview.slice(0, 155),
      images: [{ url: p.heroImage, alt: p.heroAlt }],
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  family: "Family",
  honeymoon: "Honeymoon",
  group: "Group",
  pilgrimage: "Pilgrimage",
};

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPackage(slug);
  if (!p) notFound();

  const dest = getDestination(p.destination);
  const onRequest = !p.priceFrom || p.priceFrom <= 0;
  const related = packagesForDestination(p.destination)
    .filter((x) => x.slug !== p.slug)
    .slice(0, 3)
    .map((x) => ({
      slug: x.slug,
      name: x.name,
      duration: x.duration,
      priceFrom: x.priceFrom,
      strikePrice: x.strikePrice,
      category: x.category,
      heroImage: x.heroImage,
      heroAlt: x.heroAlt,
      destinationName: dest?.name ?? p.destination,
      destinationSlug: p.destination,
      highlights: x.itinerary.map((i) => i.title),
    }));

  const waQuote = whatsappLink(
    `Hi Davis Trip Holidays! I'd like a quote for the "${p.name}" (${p.duration}) package. My travel dates are:`,
  );

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: p.name,
      description: p.seoDescription ?? p.overview.slice(0, 300),
      image: p.heroImage,
      touristType: p.category.map((c) => CATEGORY_LABELS[c] ?? c).join(", "),
      itinerary: p.itinerary.map((d) => ({
        "@type": "ItemList",
        name: `Day ${d.day}: ${d.title}`,
        description: d.description,
      })),
      offers: onRequest
        ? {
            "@type": "Offer",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            description:
              "Customised quote on request — final price depends on dates, hotels and season. Ask on WhatsApp for a written quote within 2 working hours.",
          }
        : {
            "@type": "Offer",
            price: String(p.priceFrom),
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            description: `Starting from ₹${p.priceFrom.toLocaleString("en-IN")} per person on twin sharing. Subject to availability and season.`,
          },
      provider: {
        "@type": "TravelAgency",
        name: BUSINESS.name,
        telephone: BUSINESS.phone,
        url: "https://davistripholidays.com",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://davistripholidays.com" },
        { "@type": "ListItem", position: 2, name: "Packages", item: "https://davistripholidays.com/packages" },
        { "@type": "ListItem", position: 3, name: p.name },
      ],
    },
  ];

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd[0]) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd[1]) }} />
      <TrackView event="package_view" params={{ package: p.slug, destination: p.destination }} />

      {/* Hero band */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img src={p.heroImage} alt={p.heroAlt} width={1600} height={900} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/70" aria-hidden />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-white/70 sm:text-[13px]">
              <li><Link href="/" className="transition-colors hover:text-white">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/packages" className="transition-colors hover:text-white">Packages</Link></li>
              {dest && (
                <>
                  <li aria-hidden>/</li>
                  <li>
                    <Link href={`/destinations/${dest.slug}`} className="transition-colors hover:text-white">
                      {dest.name}
                    </Link>
                  </li>
                </>
              )}
            </ol>
          </nav>
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              {p.category.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white ring-1 ring-white/25 backdrop-blur-sm"
                >
                  {CATEGORY_LABELS[c] ?? c}
                </span>
              ))}
              {p.seasonal && (
                <span className="flex items-center gap-1.5 rounded-full bg-gold/90 px-3 py-1 text-xs font-semibold text-[#3d2c12] shadow">
                  <Snowflake className="h-3 w-3" aria-hidden />
                  {p.seasonal}
                </span>
              )}
            </div>
            <h1 className="hero-text-shadow mt-4 text-balance font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {p.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-white/85">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gold-light" aria-hidden />
                {p.duration}
              </span>
              {dest && (
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="flex items-center gap-1.5 underline-offset-4 hover:underline"
                >
                  <MapPin className="h-4 w-4 text-gold-light" aria-hidden />
                  {dest.name}
                </Link>
              )}
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-gold-light" aria-hidden />
                {p.category.map((c) => CATEGORY_LABELS[c] ?? c).join(" · ")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Body: content + sticky price card */}
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-32 sm:px-6 sm:pt-16 sm:pb-32 lg:px-8 lg:pt-12 lg:pb-16">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left: content */}
          <div className="space-y-14 lg:col-span-2">
            {/* Overview */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Trip overview</h2>
              <div className="mt-4 space-y-4">
                {p.overview
                  .split(/\n\s*\n/)
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i} className="text-pretty leading-relaxed text-muted-foreground">
                      {para}
                    </p>
                  ))}
              </div>
            </div>

            {/* Gallery */}
            {p.gallery.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Photos</h2>
                <div className="mt-4">
                  <Gallery images={p.gallery} alt={p.name} />
                </div>
              </div>
            )}

            {/* Itinerary — elegant serif day numerals with a hairline rail
                (replaces "corporate SaaS" green circles; VLM round-3).
                id="itinerary" — the deep-link target of every package
                card's Itinerary button; scroll-mt-20 clears the sticky
                header (64px phone / 72px desktop + air). */}
            <div id="itinerary" className="scroll-mt-20">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Day-by-day itinerary
              </h2>
              <ol className="mt-8 space-y-0">
                {p.itinerary.map((d) => (
                  <li
                    key={d.day}
                    className="relative flex gap-6 border-l border-border pb-10 pl-8 last:pb-0 sm:gap-8 sm:pl-10"
                  >
                    <span
                      className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border-2 border-background bg-accent"
                      aria-hidden
                    />
                    <div className="day-numeral shrink-0 pt-0.5 text-right">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Day
                      </span>
                      <span className="block font-display text-[2rem] font-bold leading-none text-foreground/85">
                        {String(d.day).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="pt-1 font-display text-lg font-bold leading-snug text-foreground">
                        {d.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{d.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Inclusions / exclusions — more leading, quieter icons */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-7">
                <h3 className="font-display text-lg font-bold text-foreground">What&apos;s included</h3>
                <ul className="mt-5 space-y-3.5">
                  {p.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden strokeWidth={1.75} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-7">
                <h3 className="font-display text-lg font-bold text-foreground">Not included</h3>
                <ul className="mt-5 space-y-3.5">
                  {p.exclusions.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" aria-hidden strokeWidth={1.75} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hotels */}
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/50 p-5">
              <BedDouble className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              <div>
                <h3 className="text-sm font-semibold text-foreground">Stays on this trip</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.hotels}. Hotel names are shared in writing with your confirmation, and upgrades are always available on request.</p>
              </div>
            </div>
          </div>

          {/* Right: sticky price card */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5 sm:p-7">
                {onRequest ? (
                  <>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Pricing
                    </p>
                    <p className="mt-1.5 font-display text-[2rem] font-bold leading-none text-foreground">
                      On request
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      customised written quote within 2 working hours
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      From, per person
                    </p>
                    <p className="mt-1.5 font-display text-[2.5rem] font-bold leading-none text-foreground">
                      {formatINR(p.priceFrom)}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">twin sharing · GST invoiced</p>
                  </>
                )}
                <div className="mt-6 space-y-3">
                  <TrackedLink
                    href={waQuote}
                    event="whatsapp_click"
                    params={{ location: "package_quote", package: p.slug }}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-md transition-transform hover:scale-[1.02] hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    Get Customized Quote
                  </TrackedLink>
                  <TrackedLink
                    href={BUSINESS.phoneHref}
                    event="phone_click"
                    params={{ location: "package_card", package: p.slug }}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    Call {BUSINESS.phone}
                  </TrackedLink>
                  <Link
                    href={`/customize?package=${p.slug}`}
                    className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-foreground/75 transition-colors hover:text-accent"
                  >
                    <Settings2 className="h-4 w-4" aria-hidden />
                    Customise this package instead
                  </Link>
                </div>
                <div className="mt-6 space-y-2.5 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <CalendarCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                    Prices vary with dates, hotel availability &amp; season — final quote in writing before payment.
                  </p>
                  <p className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                    GST invoice for every payment · GSTIN {BUSINESS.gstin}
                  </p>
                  <p className="flex items-start gap-2">
                    <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                    Travel expert replies within 2 working hours.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related packages */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-border pt-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-foreground">
                More {dest?.name ?? ""} trips
              </h2>
              <Link href="/packages" className="text-sm font-semibold text-primary hover:text-accent">
                View all packages →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <PackageCard key={r.slug} p={r} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Mobile sticky price bar — desktop uses the sidebar card instead */}
      <MobilePriceBar priceFrom={p.priceFrom} quoteHref={waQuote} packageSlug={p.slug} />
    </SiteShell>
  );
}
