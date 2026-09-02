import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { TrustBar } from "@/components/site/trust-bar";
import { Destinations } from "@/components/site/destinations";
import { Packages } from "@/components/site/packages";
import { HowItWorks } from "@/components/site/how-it-works";
import { WhyUs } from "@/components/site/why-us";
import { Testimonials } from "@/components/site/testimonials";
import { Faq } from "@/components/site/faq";
import { Contact } from "@/components/site/contact";
import { CtaBand } from "@/components/site/cta-band";
import { Footer } from "@/components/site/footer";
import { FullPageMode, type FpPlateEntry } from "@/components/site/fullpage-mode";
import { BUSINESS, RATINGS } from "@/lib/site-config";
import {
  destinationCards,
  packageCards,
  testimonialCards,
  faqItems,
} from "@/lib/content";

/** The homepage folio — the 11 plates of the one-section-at-a-time
 *  experience (R11, owner-approved experiment C promoted site-wide).
 *  Order must match the DOM order of the sections below. Dark plates
 *  flip the folio rail to light ink while active. */
const PLATES: FpPlateEntry[] = [
  { id: "hero", label: "Cover — Himalayan holidays" },
  { id: "trust", label: "By the numbers" },
  { id: "destinations", label: "Where we take you" },
  { id: "packages", label: "The most-booked journeys" },
  { id: "how-it-works", label: "How booking works" },
  { id: "why-us", label: "Why Davis — the founder's word", dark: true },
  { id: "reviews", label: "What travellers say" },
  { id: "faq", label: "Questions before you ask" },
  { id: "contact", label: "Plan your trip — enquiry" },
  { id: "cta", label: "Ready when you are" },
  { id: "footer", label: "Colophon and links", dark: true },
];

/** Structured data: TravelAgency + FAQPage schemas for Google rich results */
function PageSchemas() {
  const faqs = faqItems();
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      name: BUSINESS.name,
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      url: "https://davistripholidays.com",
      logo: "https://davistripholidays.com/logo/davis-logo.png",
      image: "https://davistripholidays.com/logo/davis-logo.png",
      foundingDate: "2022",
      vatID: BUSINESS.gstin,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Kanyal Road, near Kalinga Hotel",
        addressLocality: "Manali",
        addressRegion: "Himachal Pradesh",
        postalCode: "175131",
        addressCountry: "IN",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: String(RATINGS.justdial.score),
        reviewCount: String(RATINGS.justdial.count),
        bestRating: "5",
      },
      sameAs: [BUSINESS.instagram, BUSINESS.facebook],
      areaServed: ["Himachal Pradesh", "Kashmir", "Uttarakhand", "Goa", "India"],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

export default function Home() {
  const destinations = destinationCards(true);
  // The owner's three most-booked group tours lead; fall back to featured
  // so the plate is never empty if content changes.
  const bestsellers = packageCards(true).filter((p) => p.bestseller);
  const packages = (
    bestsellers.length >= 2 ? bestsellers : packageCards(true).slice(0, 3)
  ).slice(0, 3);
  const testimonials = testimonialCards().slice(0, 9);
  const faqs = faqItems();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)] font-body">
      <PageSchemas />
      <Header />
      {/* R11: the one-plate-at-a-time layer — activates client-side only,
          never for reduced-motion users, and pauses Lenis while on.
          R14: hard-locks on EVERY screen size the same way (mandatory
          snap + snap-stop + settle watchdog) — see fullpage-mode.tsx. */}
      <FullPageMode plates={PLATES} />
      <main id="main" className="flex-1">
        <Hero />
        <TrustBar />
        <Destinations destinations={destinations} />
        <Packages packages={packages} />
        <HowItWorks />
        <WhyUs />
        <Testimonials testimonials={testimonials} />
        <Faq faqs={faqs} />
        <Contact />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
