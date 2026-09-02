/**
 * Client-safe view-model types shared between server pages and client
 * components. Pure types — no imports, safe everywhere.
 */

export interface DestinationCardData {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  heroImage: string;
  heroAlt: string;
  fromPrice: number | null;
  packageCount: number;
  bestSeason?: string;
  idealDuration?: string;
}

export interface PackageCardData {
  slug: string;
  name: string;
  duration: string;
  priceFrom: number;
  strikePrice?: number;
  category: string[];
  heroImage: string;
  heroAlt: string;
  destinationName: string;
  destinationSlug: string;
  highlights: string[];
  /** Owner-verified most-booked trips (source: owner PDF drop 2026-08-31) */
  bestseller?: boolean;
}

export interface TestimonialCardData {
  name: string;
  origin: string;
  trip: string;
  rating: number;
  platform: string;
  quote: string;
}

export interface FaqItemData {
  question: string;
  answer: string;
}
