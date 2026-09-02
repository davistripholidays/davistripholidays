import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { LEGAL_DOCS } from "@/lib/legal-content";

const doc = LEGAL_DOCS.find((d) => d.slug === "travel-disclaimer")!;

export const metadata: Metadata = {
  title: `${doc.title} — Davis Trip Holidays`,
  description: doc.intro.slice(0, 155),
  alternates: { canonical: "/legal/travel-disclaimer" },
};

export default function Page() {
  return <LegalPage doc={doc} />;
}
