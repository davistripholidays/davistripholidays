import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { LEGAL_DOCS } from "@/lib/legal-content";

const doc = LEGAL_DOCS.find((d) => d.slug === "payment-booking")!;

export const metadata: Metadata = {
  title: `${doc.title} — Davis Trip Holidays`,
  description: doc.intro.slice(0, 155),
  alternates: { canonical: "/legal/payment-booking" },
};

export default function Page() {
  return <LegalPage doc={doc} />;
}
