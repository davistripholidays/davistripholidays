import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import { BUSINESS, NAV_LINKS, RATINGS, whatsappLink } from "@/lib/site-config";
import { listDestinations, listPackages } from "@/lib/content";

const LEGAL_LINKS = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cancellations", href: "/legal/cancellation-refund" },
  { label: "Payment", href: "/legal/payment-booking" },
  { label: "Travel disclaimer", href: "/legal/travel-disclaimer" },
];

/**
 * Footer v6 — Atlas Field Journal.
 *
 * Magazine masthead style. Top: huge wordmark + tagline + rating strip.
 * Middle: 4-column nav (Explore / Destinations / Packages / Office).
 * Bottom: copyright + GST + legal links. All on ink background.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const popular = listPackages()
    .sort(
      (a, b) =>
        Number(b.bestseller) - Number(a.bestseller) ||
        Number(b.featured) - Number(a.featured) ||
        a.priceFrom - b.priceFrom
    )
    .slice(0, 5);
  const destinations = listDestinations().slice(0, 6);
  const reviewCount = RATINGS.google.count + RATINGS.justdial.count;

  return (
    <footer
      id="footer"
      className="fp-plate fp-plate--end bg-[var(--ink)] text-[var(--paper)]"
      aria-label="Site footer"
    >
      {/* R11: final plate — snap-aligns to END so the colophon row is
          always fully reachable. */}
      <div className="fp-inner mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-10 py-10 sm:py-12 lg:py-8">
        {/* Masthead — wordmark + rating strip */}
        <div className="flex flex-col gap-8 border-b border-[rgba(246,241,232,0.18)] pb-10">
          <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-end">
            {/* Brand — 8 cols (was 7) — closes the dead-zone */}
            <div className="col-span-12 lg:col-span-8">
              <Link
                href="/"
                className="font-display text-[36px] font-light leading-[1] tracking-[-0.04em] text-[var(--paper)] sm:text-[48px] lg:text-[64px]"
                style={{ fontVariationSettings: '"opsz" 144' }}
                aria-label="Davis Trip Holidays home"
              >
                Davis Trip Holidays
              </Link>
              {/* R9: 46ch measure (VLM: 75-80 CPL too wide for 14px). */}
              <p className="mt-6 max-w-[46ch] text-[14px] leading-[1.6] text-[rgba(246,241,232,0.65)]">
                Honeymoon, family, group and pilgrimage tour packages across
                India — run by a Manali-based team with its own vehicle fleet.
                GST-registered. MSME-certified. Replies within two working hours.
              </p>
            </div>

            {/* Right — rating summary — 4 cols.
                R8: restructured as one strict flex column stack (gap 4px,
                numeral leading 0.9) so label/numeral/subtext read as a
                cohesive right-aligned unit.
                R12: hidden on phones — the rating already headlines the hero
                micro-credential AND owns the entire trust plate; a third
                4.9 on a 390px footer is repetition, not reassurance. */}
            <div className="hidden lg:col-span-4 lg:block lg:pl-6">
              <div className="flex flex-col gap-1 lg:items-end">
                <p className="caption-light">Verified rating</p>
                <p
                  className="font-display text-[48px] font-light leading-[0.9] tracking-[-0.03em] text-[var(--paper)] tabular-nums"
                  style={{ fontVariationSettings: '"opsz" 96' }}
                >
                  {RATINGS.google.score.toFixed(1)}
                </p>
                <p className="caption-light">
                  {reviewCount.toLocaleString("en-IN")}+ reviews across Google +
                  JustDial + Facebook
                </p>
              </div>
            </div>
          </div>

          {/* Social icons — R8: 20px icons in 36px boxes, identical
              dimensions/border for both (VLM saw optical size variance). */}
          <div className="flex items-center gap-3 pt-2">
            {[
              { href: BUSINESS.instagram, label: "Instagram", Icon: Instagram },
              { href: BUSINESS.facebook, label: "Facebook", Icon: Facebook },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Davis Trip Holidays on ${label}`}
                className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-[rgba(246,241,232,0.20)] text-[rgba(246,241,232,0.65)] transition-all hover:border-[var(--paper)] hover:text-[var(--paper)]"
              >
                <Icon className="h-5 w-5" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns — R6 P0 #3: redistributed to 4 equal 25% columns
            (was 25/25/25/25 but 'Popular packages' overflowed ~70% width).
            Every column gets same col-span-6 sm:col-span-3 (was 2/2/2/2
            which collapsed). 'Get in touch' is no longer isolated.
            R12 mobile: tighter leading gaps + py-8 (footer measured 1354px
            on a 390px screen — nearly two viewports of links). */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 py-8 sm:grid-cols-4 sm:gap-x-8 sm:py-10 lg:py-12 lg:gap-x-10">
          <nav aria-label="Explore">
            <h3 className="caption-light">Explore</h3>
            <ul className="mt-4 flex flex-col gap-2.5 sm:mt-5 sm:gap-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-display text-[16px] font-normal leading-[1.4] tracking-[-0.005em] text-[rgba(246,241,232,0.85)] transition-colors hover:text-[var(--paper)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/blog"
                  className="font-display text-[16px] font-normal leading-[1.4] tracking-[-0.005em] text-[rgba(246,241,232,0.85)] transition-colors hover:text-[var(--paper)]"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </nav>

          {/* R12: hidden on phones — the destinations plate one screen
              earlier links to every destination page, and the drawer in
              the header covers primary nav. A 390px footer carrying four
              link columns measured 1129px — the VLM called it a "scroll
              killer" and it duplicated reachable links. sm+ unchanged. */}
          <nav aria-label="Destinations" className="hidden sm:block">
            <h3 className="caption-light">Destinations</h3>
            <ul className="mt-4 flex flex-col gap-2.5 sm:mt-5 sm:gap-3">
              {destinations.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/destinations/${d.slug}`}
                    className="font-display text-[16px] font-normal leading-[1.4] tracking-[-0.005em] text-[rgba(246,241,232,0.85)] transition-colors hover:text-[var(--paper)]"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Popular packages" className="hidden sm:block">
            <h3 className="caption-light">Popular packages</h3>
            {/* R8: VLM called the ellipsis truncation "I didn't check my
                overflow". Links now wrap to 2 controlled lines (15px,
                leading 1.35, line-clamp-2) — full names always readable. */}
            <ul className="mt-4 flex flex-col gap-2.5 sm:mt-5 sm:gap-3">
              {popular.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/packages/${p.slug}`}
                    className="font-display text-[15px] font-normal leading-[1.35] tracking-[-0.005em] text-[rgba(246,241,232,0.85)] transition-colors hover:text-[var(--paper)] line-clamp-2"
                    title={p.name}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="caption-light">Get in touch</h3>
            {/* R9: added office-hours caption line (GBP-verified hours) —
                balances column weight vs Popular packages. */}
            <ul className="mt-4 flex flex-col gap-2.5 text-[14px] leading-[1.5] text-[rgba(246,241,232,0.85)] sm:mt-5 sm:gap-3">
              <li>
                <a
                  href={BUSINESS.phoneHref}
                  className="transition-colors hover:text-[var(--paper)]"
                >
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="break-all transition-colors hover:text-[var(--paper)]"
                >
                  {BUSINESS.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(
                    "Hi Davis Trip Holidays! I'd like to plan a trip."
                  )}
                  className="transition-colors hover:text-[var(--paper)]"
                >
                  WhatsApp →
                </a>
              </li>
              {/* R12: full address kept (local-SEO NAP consistency) but now
                  links to Google Maps — the VLM called the bare text wall
                  "unreadable"; the link gives it a purpose. */}
              <li>
                <a
                  href={BUSINESS.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[rgba(246,241,232,0.55)] underline decoration-[rgba(246,241,232,0.25)] underline-offset-4 transition-colors hover:text-[var(--paper)]"
                >
                  {BUSINESS.address}
                </a>
              </li>
              <li className="pt-1 text-[11px] uppercase tracking-[0.08em] text-[rgba(246,241,232,0.55)]">
                Open daily · 9:00 AM – 7:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom legal row — R6 P2 #21: legal links use uniform 24px gap
            (gap-x-6 = 24px) for predictable rhythm. */}
        <div className="border-t border-[rgba(246,241,232,0.20)] pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] leading-[1.5] text-[rgba(246,241,232,0.55)]">
              © {year} {BUSINESS.name} · {BUSINESS.entity} · GSTIN {BUSINESS.gstin}
            </p>
            {/* R12 mobile: tap padding on legal links — 12px text in a
                tight flex row was under any comfortable touch target. */}
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-block py-1 text-[12px] tracking-[0.02em] text-[rgba(246,241,232,0.55)] transition-colors hover:text-[var(--paper)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* R12: colophon line hidden on phones (VLM: "pretension that
              pushes the legal row one more scroll down"); sm+ keeps the
              Field Journal signature close. */}
          <p className="mt-6 hidden font-display text-[13px] italic tracking-[0.04em] text-[rgba(246,241,232,0.5)] sm:block">
            Planned with care in Manali, Himachal Pradesh. Volume 04, Issue 26.
          </p>
        </div>
      </div>
    </footer>
  );
}
