/**
 * Legal document content for Davis Trip Holidays.
 *
 * ⚠️ These are DRAFT templates written from standard Indian travel-agency
 * practice. They MUST be reviewed by an Indian legal professional before
 * the website goes live (owner brief, Q14). Each page renders a visible
 * draft warning until the owner confirms legal review.
 */

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDoc {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "26 August 2026",
    intro:
      "Davis Trip Holidays (\"we\", \"our\", Kanyal Road, Manali, Himachal Pradesh 175131) respects your privacy. This policy explains what information we collect when you use davistripholidays.com or contact us, and what we do with it.",
    sections: [
      {
        heading: "Information we collect",
        paragraphs: [
          "When you submit an enquiry — through a form on this website, WhatsApp, phone call or email — we collect the details you provide: your name, phone number, email address (if shared), destination of interest, travel dates, group size, budget preferences and any notes you choose to include.",
          "We also use privacy-respecting analytics (Google Analytics 4, Microsoft Clarity) to understand which pages and destinations visitors find useful. These tools use cookies and similar technologies; you can block them via your browser settings without affecting your ability to use this website.",
        ],
      },
      {
        heading: "How we use your information",
        paragraphs: [
          "We use your information only to respond to your enquiry, prepare quotations and itineraries, manage your booking, and provide assistance during your trip. If you ask us to stop messaging you, we will.",
          "We do not sell, rent or trade your personal information to anyone, for marketing or any other purpose.",
        ],
      },
      {
        heading: "Sharing with service partners",
        paragraphs: [
          "To run your trip, some details (such as your name and booking reference) are shared with the specific hotels, transport providers and local vendors serving your booking — only to the extent needed to deliver the service.",
          "Payments, when made online through a payment link or gateway, are processed by the gateway provider; we never store your card or UPI credentials on this website.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "You may ask us at any time to access, correct or delete the personal information we hold about you, in line with the Digital Personal Data Protection Act, 2023. Write to davistripholidays@gmail.com and we will act on genuine requests within a reasonable period.",
          "We retain enquiry records only as long as needed to serve you and meet legal or accounting obligations, after which they are deleted.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "Questions about this policy: Davis Trip Holidays, Kanyal Road, near Kalinga Hotel, Manali, Himachal Pradesh 175131 · +91 91458 70087 · davistripholidays@gmail.com.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    updated: "26 August 2026",
    intro:
      "These terms govern the use of davistripholidays.com and the travel services offered by Davis Trip Holidays. By using this website or booking with us, you accept these terms.",
    sections: [
      {
        heading: "Our services",
        paragraphs: [
          "Davis Trip Holidays is a travel agency based in Manali, Himachal Pradesh, offering holiday packages, customized itineraries, hotel bookings, transportation and related travel services. Bookings are confirmed only after we share a written quotation that you accept and a booking advance is received.",
        ],
      },
      {
        heading: "Quotations and pricing",
        paragraphs: [
          "All prices displayed on this website are indicative starting points. The final price of any package depends on travel dates, hotel availability, vehicle type, group size and seasonal rates, and is confirmed only in the written quotation shared before payment. Quotations are typically valid for a limited period stated on them, after which they may be revised.",
          "We reserve the right to correct pricing errors or pass on genuine increases in hotel, transport or permit costs that occur after quotation but before confirmation — in such cases we will always inform you first and give you the option to revise or withdraw without penalty.",
        ],
      },
      {
        heading: "Website content",
        paragraphs: [
          "Itineraries, photographs and descriptions on this website are provided in good faith for planning purposes. Views expressed in blog posts are our own. Website content, including the logo and design, belongs to Davis Trip Holidays and may not be reproduced commercially without permission.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "Davis Trip Holidays acts as an organizer of travel services and takes full responsibility for the services it directly provides. We are not liable for acts of third parties (airlines, hotels, local authorities), weather events, road closures, natural events, or changes in government regulations beyond our control. Our maximum liability in any dispute is limited to the amount paid to us for the affected booking.",
          "Any dispute is subject to the exclusive jurisdiction of courts in Kullu district, Himachal Pradesh, and Indian law applies.",
        ],
      },
    ],
  },
  {
    slug: "cancellation-refund",
    title: "Cancellation & Refund Policy",
    updated: "26 August 2026",
    intro:
      "We understand plans change. This policy explains how cancellations and refunds work for bookings made with Davis Trip Holidays.",
    sections: [
      {
        heading: "Cancelling your booking",
        paragraphs: [
          "Cancellations must be communicated in writing — WhatsApp or email to the same channel through which you booked. The cancellation date is the date we receive your message.",
          "Because hotels, transport and permits are booked in advance on your behalf, cancellation charges apply. Typical slab (the exact slab for your booking is stated in your confirmation): 30+ days before departure — advance refundable minus actual hotel/vehicle deductions where already committed; 15–29 days — 25% of package cost; 7–14 days — 50%; less than 7 days or no-show — non-refundable.",
          "Peak-season dates (Christmas, New Year, long weekends, yatra season) often carry stricter hotel cancellation terms, which we state in writing in your confirmation before you pay.",
        ],
      },
      {
        heading: "Refund process",
        paragraphs: [
          "Approved refunds are processed to the original payment method within 7–14 working days of cancellation approval, depending on your bank. For part-payments made in cash, refunds are made via bank transfer against valid identification.",
        ],
      },
      {
        heading: "Cancellations by us",
        paragraphs: [
          "In the rare case we must cancel a trip for reasons within our control, you receive a full refund of everything paid to us, or a free transfer to equivalent alternate dates — your choice. For cancellations forced by weather, disasters, government orders or other force majeure, we will first offer to reschedule; where that is impossible, we refund after deducting actual, documented costs already incurred on your behalf.",
        ],
      },
    ],
  },
  {
    slug: "payment-booking",
    title: "Payment & Booking Policy",
    updated: "26 August 2026",
    intro:
      "How booking and payments work at Davis Trip Holidays — simple, documented and invoiced.",
    sections: [
      {
        heading: "Booking process",
        paragraphs: [
          "Your trip is confirmed in three steps: (1) you accept a written quotation; (2) you pay a booking advance, typically 25–30% of the package cost; (3) we share your booking confirmation with hotel details, vehicle details and the day-wise plan. The balance amount is due before departure, on the schedule stated in your confirmation.",
        ],
      },
      {
        heading: "Payment modes",
        paragraphs: [
          "We accept UPI and bank transfer to our registered business account. Where arranged in advance, secure online payment links can be shared. Every payment — advance, instalment or balance — receives a proper GST invoice from Davis Trip Holidays (GSTIN 02KVLPK0609B1Z0). We do not accept payments to personal accounts.",
        ],
      },
      {
        heading: "On-trip additions",
        paragraphs: [
          "Extra services added during your trip (upgrades, additional sightseeing, activity tickets) are billed transparently at rates shared before they are booked, and added to your final invoice.",
        ],
      },
      {
        heading: "Price changes after confirmation",
        paragraphs: [
          "Once your booking is confirmed and the advance received, your package price is locked except for genuine changes in government taxes or mandatory permit fees. Any such change will be supported by documentation and informed to you in writing before it is applied.",
        ],
      },
    ],
  },
  {
    slug: "travel-disclaimer",
    title: "Travel Disclaimer",
    updated: "26 August 2026",
    intro:
      "Mountain travel is wonderful and occasionally unpredictable. Please read this disclaimer before booking a Himalayan or other trip with us.",
    sections: [
      {
        heading: "Weather, roads and itinerary changes",
        paragraphs: [
          "The Himalayas are a live mountain system: snowfall, rainfall, landslides and road closures happen, and schedules can change at short notice. Our itineraries are carefully planned, but safety always comes first. Where conditions require, we will adjust the route or sequence of sightseeing — and we will always tell you why. Such changes made for safety are not grounds for refund of unaffected services.",
        ],
      },
      {
        heading: "Adventure activities",
        paragraphs: [
          "Activities such as paragliding, river rafting, skiing, trekking and ropeway rides are operated by independent local operators. They carry inherent risk. Participate only if you are medically fit, follow operator instructions, and confirm insurance cover where available. These activities are not included in our package price unless expressly listed.",
        ],
      },
      {
        heading: "Health and altitude",
        paragraphs: [
          "Several destinations we serve (Spiti, Ladakh, Kedarnath, high passes) sit above 3,000 m. Consult your doctor before high-altitude travel if you have cardiac, respiratory or other conditions, travel gradually as our itineraries are designed, and report symptoms early.",
        ],
      },
      {
        heading: "Documents and permits",
        paragraphs: [
          "Carry valid government photo ID for every traveller (required at hotels and checkpoints); certain regions and yatra routes require permits or registration, which we help arrange where stated. Foreign nationals should check visa and Protected/Restricted Area Permit requirements with us in advance.",
        ],
      },
      {
        heading: "Third-party services",
        paragraphs: [
          "Flights, trains, hotels and activities operated by third parties are governed by those providers' own terms. We assist with coordination and stand behind our recommendations, but the operating provider is responsible for the service itself.",
        ],
      },
    ],
  },
];
