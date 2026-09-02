/**
 * Client-safe site configuration for Davis Trip Holidays.
 *
 * This module contains ONLY facts that are safe to import from both server
 * and client components (no fs, no Node APIs). CMS-editable content lives
 * in /content/*.md and is loaded by src/lib/content.ts (server-only).
 *
 * Business facts verified 2026-08-24 (JustDial, Google via Holidify,
 * Instagram, archived old website) + owner brief 2026-08-26.
 */

export const BUSINESS = {
  name: "Davis Trip Holidays",
  tagline: "Your Journey, Our Responsibility.",
  subTagline: "Explore Incredible India with Us.", // from old davistripholidays.com homepage, retrieved 2026-08-29 via soloist.ai mirror
  phone: "+91 91458 70087",
  phoneHref: "tel:+919145870087",
  whatsappNumber: "919145870087",
  email: "contact@davistripholidays.com", // public-facing inbox per old davistripholidays.com (soloist.ai mirror, retrieved 2026-08-29)
  // NOTE: owner confirmed gmail inbox (davistripholidays@gmail.com) is also actively monitored; swap preferred display inbox here.
  gstin: "02KVLPK0609B1Z0", // confirmed by owner 2026-08-27
  msme: "HP-06-0021277", // Udyam (MSME) registration confirmed by owner 2026-08-27
  entity: "Sole Proprietorship",
  address: "Kanyal Road, near Kalinga Hotel, Simsa Village, Manali, Himachal Pradesh 175131",
  instagram: "https://www.instagram.com/davis.trip.holidays",
  facebook: "https://www.facebook.com/p/Davis-Trip-Holidays-61557589132610",
  youtube: "", // TODO owner: YouTube channel URL (add later per owner brief)
  hours: "Open Daily · 9:00 AM – 7:00 PM", // per Google Business Profile, 2026-08-27 (owner to confirm closing time in GBP if it changes)
  founded: "2022",
  googleReviewUrl: "https://g.page/r/CRVYdQ-YRs6QEBE/review", // owner-provided review link
  googlePlaceUrl: "https://maps.google.com/?q=Davis+Trip+Holidays+Manali",
  mapUrl: "https://maps.google.com/?q=Davis+Trip+Holidays+Manali",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Kanyal%20Road%2C%20Manali%2C%20Himachal%20Pradesh%20175131&t=&z=15&ie=UTF8&iwloc=&output=embed",
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Feature flags — one-line kill switches for big-ticket visuals.
 */
export const FEATURES = {
  hero3d: false, // OFF: low-poly 3D read as "video-game render" in VLM audits — the real photograph outsells it
} as const;

/** Rating stats — verified 2026-08-24 (edit here when counts grow) */
export const RATINGS = {
  justdial: {
    score: 4.9,
    count: 50,
    url: "https://www.justdial.com/Manali/Davis-Trip-Holidays-Opposite-Royal-Kalinga-Cottage-Simsa/9999P1902-1902-240323111222-K3Q3_BZDET/reviews",
  },
  google: {
    score: 4.9,
    count: 44,
    url: "https://maps.google.com/?q=Davis+Trip+Holidays+Manali",
  },
  facebook: {
    score: 5.0,
    count: 3,
    url: "https://www.facebook.com/p/Davis-Trip-Holidays-61557589132610",
  },
} as const;

/** Primary navigation (site IA per owner brief: Home → Destinations → Packages → Customize → About → Reviews → Contact) */
export const NAV_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Packages", href: "/packages" },
  { label: "Customize Trip", href: "/customize" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
] as const;

/** Hero + layout-level imagery (destination/package photos live in /content) */
export const IMAGES = {
  hero: "/images/hero-manali.jpg",
  heroAlt: "Winding mountain road through pine forest toward snow-capped Himalayan peaks",
  heroWidth: 1600,
  heroHeight: 900,
  family: "/images/family-travel.jpg",
  familyAlt: "Happy family of travellers on a mountain vacation",
  familyWidth: 1920,
  familyHeight: 1279,
} as const;

export const FLEET = [
  { vehicle: "Swift Dzire / Sedan", seats: "4+1", best: "Couples, airport transfers" },
  { vehicle: "Ertiga / XL6", seats: "6+1", best: "Small families" },
  { vehicle: "Innova Crysta", seats: "7+1", best: "Premium family travel" },
  { vehicle: "Tempo Traveller", seats: "12 – 26", best: "Group tours, corporate trips" },
  { vehicle: "Large Coach", seats: "42 – 52", best: "Pilgrimage & school groups" },
  { vehicle: "Scorpio / Gypsy", seats: "6+1", best: "Rough terrain, Spiti & Leh routes" },
] as const;

export const WHY_US = [
  {
    title: "Based in Manali, not a call centre",
    body: "We operate from the mountains we sell. When roads close or weather turns, the people handling your trip are right there — not in a metro city call centre reading a script.",
    icon: "mountain",
  },
  {
    title: "Our own vehicle fleet",
    body: "From sedans to 52-seat coaches, the vehicles are ours. That means verified drivers, consistent quality, and honest pricing without middlemen margins.",
    icon: "car",
  },
  {
    title: "Rated 4.9 by real travellers",
    body: "Fifty JustDial reviews and forty-four Google ratings average 4.9 stars — with customers naming our coordinators in their thank-you notes. Real reviews, no paid actors.",
    icon: "star",
  },
  {
    title: "Transparent, honest pricing",
    body: "Every package lists what is included and what is not. No hidden charges appear at the hotel desk. GST invoice for every booking — we are properly registered.",
    icon: "receipt",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell us your dream",
    body: "One WhatsApp message, a call, or the form below. Two minutes is all it takes — dates, destination, budget range, and who's travelling.",
    icon: "chat",
  },
  {
    step: "02",
    title: "Get a plan, not a sales pitch",
    body: "You receive a clear day-wise itinerary with an all-inclusive quote. Want changes? We revise until it's exactly the trip you want. Need flights or train tickets? We book those too — assistance at actual cost, no markup.",
    icon: "route",
  },
  {
    step: "03",
    title: "Travel worry-free",
    body: "Our own vehicle picks you up, hotels are confirmed in your name, and a coordinator from our Manali office stays reachable on WhatsApp every day of your trip — with a 24×7 emergency helpline while you travel.",
    icon: "shield",
  },
] as const;

/** Brand story — owner-provided vision (brief Q + vision note, 2026-08-26) */
export const BRAND = {
  vision:
    "Our vision is to establish Davis Trip Holidays as a trusted and respected travel brand that transforms every journey into a meaningful experience.",
  promise:
    "Davis Trip Holidays was created with the vision of making travel planning simple, transparent and personal. We help travelers discover destinations, choose the right package and enjoy a well-planned journey without unnecessary complexity.",
  pillars: [
    {
      title: "Building Trust",
      body: "We earn our customers' confidence through honesty, transparency, reliability, and exceptional service.",
    },
    {
      title: "Creating Experiences",
      body: "We go beyond selling travel packages by creating personalized, memorable, and hassle-free journeys.",
    },
    {
      title: "Inspiring Journeys",
      body: "We inspire travelers to explore new destinations, discover new cultures, and experience the world with confidence.",
    },
  ],
  founderNote:
    "At Davis Trip Holidays, we believe success is not measured only by the number of trips we sell, but by the trust we earn, the experiences we create, and the relationships we build with every traveler.",
  founder: {
    name: "Anil Kumar",
    firstName: "Anil",
    role: "Founder & Travel Consultant",
    startYear: "2022",
    teamSize: 4,
    bio: "A seasoned travel consultant with over 3 years of experience designing personalized travel itineraries, ensuring memorable experiences for clients. Specializes in Indian destinations, offering expert advice on local culture, attractions and travel practicalities.",
  },
  // TODO owner: add founder photo (replaces monogram) + extended story when provided
} as const;

/** Enquiry form options (Contact + Customize pages) */
export const ENQUIRY_DESTINATIONS = [
  "Manali",
  "Shimla – Manali",
  "Spiti Valley",
  "Kashmir (Srinagar / Gulmarg / Pahalgam)",
  "Rajasthan",
  "Goa",
  "Kerala",
  "Meghalaya & Northeast",
  "Uttarakhand / Char Dham",
  "Somewhere else / not sure yet",
] as const;

export const ENQUIRY_GROUP_SIZES = [
  "Solo",
  "Couple / 2",
  "Family (3–5)",
  "Group (6–15)",
  "Large group (15+)",
] as const;

export const TRAVELER_TYPES = [
  "Family",
  "Honeymoon / Couple",
  "Friends & Group",
  "Pilgrimage",
  "Solo",
] as const;

export const BUDGET_RANGES = [
  "Under ₹15,000 per person",
  "₹15,000 – ₹25,000 per person",
  "₹25,000 – ₹40,000 per person",
  "₹40,000+ per person",
  "Flexible — suggest something",
] as const;

export const TRIP_DURATIONS = [
  "2–3 days",
  "4–5 days",
  "6–8 days",
  "9+ days",
  "Flexible",
] as const;
