import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/site/smart-image";
import type { DestinationCardData } from "@/lib/types";

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

/** R9: compact season for the card face — strips parentheticals/
 *  secondary windows and abbreviates months ("November – February" ->
 *  "Nov – Feb") so the caption NEVER wraps to 2 lines. Full season data
 *  stays intact on the destination detail pages. */
function shortSeason(s: string) {
  const primary = s.split(/[(·]/)[0].trim();
  return primary.replace(
    /January|February|March|April|May|June|July|August|September|October|November|December/g,
    (m) => m.slice(0, 3)
  );
}

/**
 * DestinationCard v6 — Atlas Field Journal.
 *
 * v5 was: 4:5 portrait image with rounded 4px corners + content well below
 * with name, package count + price. VLM said 8/10 but user said 0/10.
 *
 * v6:
 *   1. Sharp 2px radius (was 4px).
 *   2. 3:4 portrait aspect (was 4:5) — more classic editorial proportion.
 *   3. Caption block below: tiny uppercase region, then large display name
 *      in Fraunces 400, then ONE line of tagline, then hairline + meta strip
 *      (best season / ideal duration / from price).
 *   4. No hover lift. Hover = image scale 1.03 + caption underline on name.
 *   5. Editorial layout: name aligns left, meta aligns right with tabular nums.
 */
export function DestinationCard({ d }: { d: DestinationCardData }) {
  return (
    <Link
      href={`/destinations/${d.slug}`}
      className="group flex h-full flex-col"
      aria-label={`${d.name} — ${d.packageCount} packages${d.fromPrice ? ` from ${inr(d.fromPrice)}` : ""}`}
    >
      {/* Image — R6 P0 #4: strict aspect-ratio token with object-position
          so focal point stays consistent across all 6 cards. */}
      <div
        className="img-sharp relative w-full overflow-hidden bg-[var(--paper-soft)]"
        style={{ aspectRatio: "4 / 5" }}
      >
        <SmartImage
          src={d.heroImage}
          alt={d.heroAlt}
          width={1200}
          height={1500}
          loading="lazy"
          decoding="async"
          className="img-zoom h-full w-full object-cover object-[center_35%]"
        />
        {/* Index number overlay — top-left, like a magazine plate */}
        <span className="absolute left-3 top-3 z-10 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 tabular-nums">
          Plate · {d.region}
        </span>
      </div>

      {/* Caption block — flex flex-1 so all card bodies fill the same
          vertical extent regardless of tagline length. */}
      <div className="flex flex-1 flex-col pt-4">
        {/* Name + arrow */}
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className="font-display text-[22px] font-normal leading-[1.05] tracking-[-0.025em] text-[var(--ink)] transition-colors group-hover:text-[var(--pine)]"
            style={{ fontVariationSettings: '"opsz" 60' }}
          >
            {d.name}
          </h3>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-[var(--ink-muted)] transition-colors duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--pine)]"
            aria-hidden
          />
        </div>

        {/* Tagline — wraps up to 2 lines, soft ink */}
        <p className="mt-2 text-[13px] leading-[1.45] text-[var(--ink-soft)] line-clamp-2 min-h-[2.4rem]">
          {d.tagline}
        </p>

        {/* Hairline + meta strip — mt-auto so all cards share the same
            vertical extent regardless of tagline length.
            R8: distinct typographic treatment per information type —
            trips count stays a 10px muted label, price is THE value
            (11.5px ink medium), best season is a sentence-case caption. */}
        <div className="mt-auto">
          <hr className="hairline mt-4 mb-3.5" />

        {/* R9: fixed 20px row height + items-center kills the 3px card-height
            variance between priced ('From ₹5,500') and unpriced ('ON REQUEST')
            cards — line-box math no longer leaks into the grid. */}
          <div className="flex h-[20px] items-center justify-between gap-3 [font-feature-settings:'tnum'_1]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-muted)] tabular-nums whitespace-nowrap">
              {d.packageCount} {d.packageCount === 1 ? "trip" : "trips"}
            </span>
            {d.fromPrice != null ? (
              <span className="text-[11.5px] font-medium tracking-[0.01em] text-[var(--ink)] tabular-nums whitespace-nowrap">
                From {inr(d.fromPrice)}
              </span>
            ) : (
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-muted)] whitespace-nowrap">
                On request
              </span>
            )}
          </div>
          {/* Best season — R9: abbreviated single-line caption (never wraps). */}
          {d.bestSeason && (
            <p className="mt-2 text-[11px] font-normal tracking-[0.02em] text-[var(--ink-muted)] normal-case whitespace-nowrap">
              Best: {shortSeason(d.bestSeason)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
