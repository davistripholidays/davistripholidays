/**
 * Server-only content loader for Davis Trip Holidays.
 *
 * Reads the markdown content collections in /content (the files Sveltia CMS
 * edits at /admin) at BUILD time. This module must never be imported from a
 * client component — pass loaded data down as props instead.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  DestinationCardData,
  PackageCardData,
  TestimonialCardData,
  FaqItemData,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

/* ------------------------------ types ------------------------------ */

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface PackageDoc {
  slug: string;
  name: string;
  destination: string; // destination slug
  duration: string;
  priceFrom: number;
  strikePrice?: number;
  category: string[]; // family | honeymoon | group | pilgrimage
  heroImage: string;
  heroAlt: string;
  gallery: string[];
  hotels: string;
  seasonal?: string;
  featured: boolean;
  /** Owner-verified most-booked trips — surface ahead of everything else */
  bestseller: boolean;
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  overview: string; // plain text, blank-line separated paragraphs
  seoTitle?: string;
  seoDescription?: string;
}

export interface DestinationDoc {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  heroImage: string;
  heroAlt: string;
  gallery: string[];
  bestSeason: string;
  idealDuration: string;
  featured: boolean;
  overview: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface TestimonialDoc {
  slug: string;
  name: string;
  origin: string;
  trip: string;
  rating: number;
  platform: string;
  date: string;
  featured: boolean;
  quote: string;
}

export interface FaqDoc {
  slug: string;
  order: number;
  question: string;
  answer: string;
}

export interface BlogPostDoc {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  heroImage: string;
  heroAlt: string;
  body: string;
}

export interface SiteSettings {
  officeHours: string;
  responseSla: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
}

/* --------------------------- file helpers -------------------------- */

function readCollection(dir: string): { slug: string; data: Record<string, unknown>; body: string }[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md") || f.endsWith(".markdown"))
    .sort()
    .map((f) => {
      const raw = fs.readFileSync(path.join(full, f), "utf8");
      const parsed = matter(raw);
      return {
        slug: f.replace(/\.md$/, "").replace(/\.markdown$/, ""),
        data: parsed.data as Record<string, unknown>,
        body: parsed.content.trim(),
      };
    });
}

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback = 0): number => (typeof v === "number" ? v : fallback);
const bool = (v: unknown, fallback = false): boolean => (typeof v === "boolean" ? v : fallback);
const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

/* --------------------------- collections --------------------------- */

let cache: {
  packages: PackageDoc[];
  destinations: DestinationDoc[];
  testimonials: TestimonialDoc[];
  faqs: FaqDoc[];
  blog: BlogPostDoc[];
  settings: SiteSettings;
} | null = null;

function loadAll() {
  if (cache) return cache;

  const destinations: DestinationDoc[] = readCollection("destinations").map(({ slug, data, body }) => ({
    slug,
    name: str(data.name, slug),
    region: str(data.region),
    tagline: str(data.tagline),
    heroImage: str(data.heroImage),
    heroAlt: str(data.heroAlt, `${str(data.name)} destination photograph`),
    gallery: strList(data.gallery),
    bestSeason: str(data.bestSeason),
    idealDuration: str(data.idealDuration),
    featured: bool(data.featured),
    overview: body,
    seoTitle: str(data.seoTitle) || undefined,
    seoDescription: str(data.seoDescription) || undefined,
  }));

  const packages: PackageDoc[] = readCollection("packages").map(({ slug, data, body }) => ({
    slug,
    name: str(data.name, slug),
    destination: str(data.destination),
    duration: str(data.duration),
    priceFrom: num(data.priceFrom),
    strikePrice: typeof data.strikePrice === "number" && data.strikePrice > 0 ? data.strikePrice : undefined,
    category: strList(data.category),
    heroImage: str(data.heroImage),
    heroAlt: str(data.heroAlt, `${str(data.name)} tour package`),
    gallery: strList(data.gallery),
    hotels: str(data.hotels),
    seasonal: str(data.seasonal) || undefined,
    featured: bool(data.featured),
    bestseller: bool(data.bestseller),
    itinerary: Array.isArray(data.itinerary)
      ? data.itinerary
          .filter((d): d is Record<string, unknown> => typeof d === "object" && d !== null)
          .map((d, i) => ({
            day: num(d.day, i + 1),
            title: str(d.title),
            description: str(d.description),
          }))
          .sort((a, b) => a.day - b.day)
      : [],
    inclusions: strList(data.inclusions),
    exclusions: strList(data.exclusions),
    overview: body,
    seoTitle: str(data.seoTitle) || undefined,
    seoDescription: str(data.seoDescription) || undefined,
  }));

  const testimonials: TestimonialDoc[] = readCollection("testimonials")
    .map(({ slug, data, body }) => ({
      slug,
      name: str(data.name, slug),
      origin: str(data.origin),
      trip: str(data.trip),
      rating: num(data.rating, 5),
      platform: str(data.platform, "Google"),
      date: str(data.date),
      featured: bool(data.featured, true),
      quote: body,
    }))
    .sort((a, b) => Number(b.featured) - Number(a.featured));

  const faqs: FaqDoc[] = readCollection("faqs")
    .map(({ slug, data, body }) => ({
      slug,
      order: num(data.order, 99),
      question: str(data.question, slug),
      answer: body,
    }))
    .sort((a, b) => a.order - b.order);

  const blog: BlogPostDoc[] = readCollection("blog")
    .map(({ slug, data, body }) => ({
      slug,
      title: str(data.title, slug),
      date: str(data.date),
      excerpt: str(data.excerpt),
      heroImage: str(data.heroImage),
      heroAlt: str(data.heroAlt, str(data.title)),
      body,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  let settings: SiteSettings = {
    officeHours: "Open Daily · 9:00 AM – 7:00 PM",
    responseSla: "We aim to respond to enquiries within 2 working hours",
    email: "davistripholidays@gmail.com",
    instagram: "https://www.instagram.com/davis.trip.holidays",
    facebook: "https://www.facebook.com/p/Davis-Trip-Holidays-61557589132610",
    youtube: "",
  };
  const settingsFile = readCollection("settings").find((s) => s.slug === "site");
  if (settingsFile) {
    const d = settingsFile.data;
    settings = {
      officeHours: str(d.officeHours, settings.officeHours),
      responseSla: str(d.responseSla, settings.responseSla),
      email: str(d.email, settings.email),
      instagram: str(d.instagram),
      facebook: str(d.facebook),
      youtube: str(d.youtube),
    };
  }

  cache = { packages, destinations, testimonials, faqs, blog, settings };
  return cache;
}

/* ----------------------------- getters ----------------------------- */

export function listPackages(): PackageDoc[] {
  return loadAll().packages;
}

export function getPackage(slug: string): PackageDoc | undefined {
  return loadAll().packages.find((p) => p.slug === slug);
}

export function listDestinations(): DestinationDoc[] {
  return loadAll().destinations;
}

export function getDestination(slug: string): DestinationDoc | undefined {
  return loadAll().destinations.find((d) => d.slug === slug);
}

export function packagesForDestination(destinationSlug: string): PackageDoc[] {
  return loadAll().packages.filter((p) => p.destination === destinationSlug);
}

export function listTestimonials(): TestimonialDoc[] {
  return loadAll().testimonials;
}

export function listFaqs(): FaqDoc[] {
  return loadAll().faqs;
}

export function listBlogPosts(): BlogPostDoc[] {
  return loadAll().blog;
}

export function getBlogPost(slug: string): BlogPostDoc | undefined {
  return loadAll().blog.find((p) => p.slug === slug);
}

export function getSettings(): SiteSettings {
  return loadAll().settings;
}

/** Lowest verified "starting from" price across a destination's packages.
 *  Packages without a verified price (priceFrom 0 = on request) never
 *  inflate the anchor — returns null when nothing is priced yet. */
export function destinationFromPrice(destinationSlug: string): number | null {
  const prices = loadAll()
    .packages.filter((p) => p.destination === destinationSlug && p.priceFrom > 0)
    .map((p) => p.priceFrom);
  return prices.length ? Math.min(...prices) : null;
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/* --------------------- card view-model mappers --------------------- */

/** Destinations → card view-models (homepage grid + hub). Pass featuredOnly for the homepage. */
export function destinationCards(featuredOnly = false): DestinationCardData[] {
  return loadAll()
    .destinations.filter((d) => (featuredOnly ? d.featured : true))
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      region: d.region,
      tagline: d.tagline,
      heroImage: d.heroImage,
      heroAlt: d.heroAlt,
      fromPrice: destinationFromPrice(d.slug),
      packageCount: packagesForDestination(d.slug).length,
      bestSeason: d.bestSeason,
      idealDuration: d.idealDuration,
    }));
}

/** Packages → card view-models. Bestsellers first (owner-verified
 *  most-booked trips), then featured, then by price ascending
 *  (unpriced "on request" packages sort last, never first). */
export function packageCards(featuredOnly = false): PackageCardData[] {
  const dests = new Map(loadAll().destinations.map((d) => [d.slug, d.name]));
  return loadAll()
    .packages.filter((p) => (featuredOnly ? p.featured : true))
    .sort(
      (a, b) =>
        Number(b.bestseller) - Number(a.bestseller) ||
        Number(b.featured) - Number(a.featured) ||
        (a.priceFrom > 0 ? a.priceFrom : Infinity) - (b.priceFrom > 0 ? b.priceFrom : Infinity),
    )
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      duration: p.duration,
      priceFrom: p.priceFrom,
      strikePrice: p.strikePrice,
      category: p.category,
      heroImage: p.heroImage,
      heroAlt: p.heroAlt,
      destinationName: dests.get(p.destination) ?? p.destination,
      destinationSlug: p.destination,
      highlights: p.itinerary.map((d) => d.title),
      bestseller: p.bestseller || undefined,
    }));
}

export function testimonialCards(): TestimonialCardData[] {
  return loadAll().testimonials.map((t) => ({
    name: t.name,
    origin: t.origin,
    trip: t.trip,
    rating: t.rating,
    platform: t.platform,
    quote: t.quote,
  }));
}

export function faqItems(): FaqItemData[] {
  return loadAll().faqs.map((f) => ({ question: f.question, answer: f.answer }));
}
