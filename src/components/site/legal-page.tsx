import { AlertTriangle } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import type { LegalDoc } from "@/lib/legal-content";

/**
 * Shared legal page renderer with a visible draft-review warning
 * (removed only after the owner's legal professional approves).
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Legal"
        title={doc.title}
        description={`Last updated: ${doc.updated}`}
        breadcrumbs={[{ label: "Legal" }, { label: doc.title }]}
      />

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Draft warning — remove after legal review */}
        <div className="mb-10 flex gap-3 rounded-xl border border-gold/50 bg-gold/10 p-4" role="note">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#9a6b2f]" aria-hidden />
          <p className="text-sm leading-relaxed text-foreground/80">
            <strong className="font-semibold text-foreground">Draft policy — pending legal review.</strong>{" "}
            This document was prepared as a starting template and must be reviewed by an Indian
            legal professional before the website goes live. It should not be treated as final
            legal advice.
          </p>
        </div>

        <p className="text-pretty leading-relaxed text-muted-foreground">{doc.intro}</p>

        <div className="mt-10 space-y-10">
          {doc.sections.map((s, i) => (
            <section key={s.heading} aria-labelledby={`legal-${doc.slug}-${i}`}>
              <h2 id={`legal-${doc.slug}-${i}`} className="font-display text-xl font-bold text-foreground sm:text-2xl">
                {s.heading}
              </h2>
              <div className="mt-3 space-y-4">
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="text-pretty leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>

      <CtaBand />
    </SiteShell>
  );
}
