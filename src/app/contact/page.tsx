import type { Metadata } from "next";
import { SiteShell } from "@/components/site/site-shell";
import { PageHero } from "@/components/site/page-hero";
import { Contact } from "@/components/site/contact";

export const metadata: Metadata = {
  title: "Contact Us — Manali Office, Phone, WhatsApp & Email",
  description:
    "Reach Davis Trip Holidays: call +91 91458 70087, WhatsApp, email, or visit our Kanyal Road office in Manali. We aim to respond within 2 working hours.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Start planning today"
        title="Contact us"
        description="Call, WhatsApp, email, or walk into our Manali office — whichever suits you. We aim to respond within 2 working hours, and on-trip support runs every day of your journey."
        breadcrumbs={[{ label: "Contact" }]}
      />
      <Contact />
    </SiteShell>
  );
}
