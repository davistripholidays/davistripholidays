import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { PageHero } from "@/components/site/page-hero";
import { CustomizeForm } from "@/components/site/customize-form";
import { listPackages } from "@/lib/content";
import { ENQUIRY_DESTINATIONS, RATINGS } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Customize Your Trip — Tell Us What You're Dreaming Of",
  description:
    "Build a fully customised holiday: destination, dates, group size and budget — our Manali travel experts aim to respond with a day-wise plan within 2 working hours.",
  alternates: { canonical: "/customize" },
};

export default function CustomizePage() {
  const packages = listPackages().map((p) => ({
    slug: p.slug,
    name: p.name,
    destinationName: p.destination,
  }));
  const destinationOptions = [
    ...new Set(packages.map((p) => p.destinationName)),
    ...ENQUIRY_DESTINATIONS,
  ];

  return (
    <SiteShell>
      <PageHero
        eyebrow="Customized travel, transparently priced"
        title="Customize your trip"
        description="Fixed packages are starting points — this is where the real trip gets made. Tell us who's travelling, where and roughly when. A travel expert (a human, in Manali) replies with a day-wise plan and an honest quote."
        breadcrumbs={[{ label: "Customize Trip" }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:col-span-2">
            <Suspense
              fallback={
                <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                  Loading the trip brief…
                </div>
              }
            >
              <CustomizeForm destinationOptions={destinationOptions} packages={packages} />
            </Suspense>
          </div>

          {/* Assurance sidebar */}
          <aside className="space-y-5">
            <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-md">
              <h2 className="font-display text-xl font-bold">What happens next</h2>
              <ol className="mt-4 space-y-4">
                {[
                  ["Your brief reaches a travel expert", "Not a bot — a planner in our Manali office who knows these roads personally."],
                  ["You get a plan — we aim within 2 working hours", "A clear day-wise itinerary with hotels, vehicle and an all-inclusive price."],
                  ["Refine it until it's right", "Change anything — dates, hotels, route. We re-quote free until it fits."],
                  ["Book with a GST invoice", "A booking advance confirms everything in your name. No cash-only dealings."],
                ].map(([title, body], i) => (
                  <li key={title} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold ring-1 ring-white/25">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-primary-foreground/75">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-bold text-foreground">Why travellers trust us</h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <Star className="mt-0.5 h-4 w-4 shrink-0 fill-gold text-gold" aria-hidden />
                  <span><strong className="font-semibold text-foreground">{RATINGS.justdial.score}/5</strong> from {RATINGS.justdial.count}+ JustDial reviews · {RATINGS.google.score}/5 on Google</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>GST-registered business — every payment invoiced properly</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>We aim to respond within 2 working hours, with on-trip assistance throughout your journey</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>Own vehicle fleet &amp; Manali-based coordinators — no middlemen</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
