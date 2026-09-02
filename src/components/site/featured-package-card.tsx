"use client";

import Link from "next/link";
import { ArrowRight, Clock, MapPin, MessageCircle } from "lucide-react";
import { SmartImage } from "@/components/site/smart-image";
import { whatsappLink } from "@/lib/site-config";
import { tracked } from "@/lib/analytics";
import type { PackageCardData } from "@/lib/types";

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

const CATEGORY_LABELS: Record<string, string> = {
  family: "Family",
  honeymoon: "Honeymoon",
  group: "Group",
  pilgrimage: "Pilgrimage",
};

/**
 * Featured package card — horizontal editorial layout for the "Most loved"
 * rail at the top of the packages hub. Breaks the visual monotony of a
 * uniform card grid (VLM round-3: curate, don't list 14 identical cards).
 */
export function FeaturedPackageCard({ p }: { p: PackageCardData }) {
  const onRequest = !p.priceFrom || p.priceFrom <= 0;
  const categoryLabel = CATEGORY_LABELS[p.category[0]] ?? "Tour";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[0_2px_12px_-6px_rgba(31,61,51,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_56px_-20px_rgba(31,61,51,0.28)] md:flex-row">
      {/* Image — wide on desktop, tall on mobile */}
      <Link
        href={`/packages/${p.slug}`}
        className="relative block aspect-[16/10] overflow-hidden focus-visible:outline-2 focus-visible:outline-ring md:aspect-auto md:w-[46%] md:shrink-0"
        aria-label={`${p.name} — ${p.duration}`}
      >
        <SmartImage
          src={p.heroImage}
          alt={p.heroAlt}
          width={1000}
          height={750}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15 md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/10" aria-hidden />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1 text-[11px] font-semibold tracking-wide text-white ring-1 ring-white/20 backdrop-blur-md">
          <Clock className="h-3 w-3 text-gold-light" aria-hidden />
          {p.duration}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-gold/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#3d2c12] shadow-sm">
          {p.bestseller ? "Most booked" : "Most loved"}
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
          {p.destinationName}
          <span className="h-1 w-1 rounded-full bg-border" aria-hidden />
          {categoryLabel}
        </p>

        <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-foreground sm:text-[1.6rem]">
          <Link
            href={`/packages/${p.slug}`}
            className="transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-ring"
          >
            {p.name}
          </Link>
        </h3>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {p.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-accent/60" aria-hidden />
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <div className="price-rule flex flex-wrap items-end justify-between gap-4 pt-4">
            {onRequest ? (
              <p className="pb-0.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-primary">
                Priced on request
              </p>
            ) : (
              <p className="font-display text-[2.3rem] font-bold leading-none tracking-tight text-foreground">
                {inr(p.priceFrom)}
              </p>
            )}
            <div className="flex items-center gap-2.5">
              <a
                href={whatsappLink(`Hi Davis Trip Holidays! I'm interested in "${p.name}" (${p.duration}). Please share a quote.`)}
                onClick={tracked("whatsapp_click", { location: "featured_card", package: p.slug })}
                aria-label={`Get ${p.name} quote on WhatsApp`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#25D366]/40 bg-[#25D366]/10 text-[#1da851] transition-all hover:border-[#25D366] hover:bg-[#25D366] hover:text-white focus-visible:outline-2 focus-visible:outline-ring"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
              </a>
              <Link
                href={`/packages/${p.slug}#itinerary`}
                className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-ring"
              >
                View itinerary
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
