import type { Metadata } from "next";
import { PenLine, Star } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { PageHero } from "@/components/site/page-hero";
import { Testimonials } from "@/components/site/testimonials";
import { CtaBand } from "@/components/site/cta-band";
import { testimonialCards } from "@/lib/content";
import { BUSINESS, IMAGES, RATINGS } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Customer Reviews — 4.9★ from Real Travellers",
  description:
    "Read genuine reviews from Davis Trip Holidays customers — 4.9★ on JustDial (50+ reviews) and 4.9★ on Google. Real trips, real words, no paid actors.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  const testimonials = testimonialCards();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Real reviews, real trips"
        title="What travellers say about us"
        description="Every review below comes from a completed, verifiable booking. We're proud of the 4.9-star averages — and prouder of how many customers name our coordinators in their thank-you notes."
        breadcrumbs={[{ label: "Reviews" }]}
      />
      <Testimonials testimonials={testimonials} />

      {/* Review-us band — full-bleed photographic treatment (breaks the
          cream monotony; owner-provided Google review link) */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={IMAGES.hero}
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-pine-deep/80" aria-hidden />
        </div>
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25 backdrop-blur-sm">
            <PenLine className="h-5 w-5 text-gold-light" aria-hidden />
          </span>
          <div>
            <h2 className="text-balance font-display text-2xl font-bold text-white sm:text-3xl">
              Travelled with us?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-white/80 sm:text-base">
              Your review helps other travellers plan with confidence — and tells our small Manali
              team the things that mattered on your trip. It takes one minute on Google.
            </p>
          </div>
          <a
            href={BUSINESS.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-pine-deep shadow-lg transition-all hover:scale-[1.02] hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Star className="h-4 w-4 fill-current" aria-hidden />
            Write a Google review
          </a>
          <p className="text-xs text-white/70">
            {RATINGS.google.score}★ average from {RATINGS.google.count}+ Google ratings ·{" "}
            {RATINGS.justdial.score}★ on JustDial
          </p>
        </div>
      </section>

      <CtaBand />
    </SiteShell>
  );
}
