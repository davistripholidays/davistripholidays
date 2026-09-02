"use client";

import { MessageCircle } from "lucide-react";
import { TrackedLink } from "@/lib/tracked-link";

/**
 * Mobile-only sticky bottom price bar for package detail pages.
 * Desktop gets the full sticky sidebar card instead (lg:hidden here).
 */
export function MobilePriceBar({
  priceFrom,
  quoteHref,
  packageSlug,
}: {
  priceFrom: number;
  quoteHref: string;
  packageSlug: string;
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-between gap-4 px-4 pt-3">
        <div className="min-w-0">
          {priceFrom > 0 ? (
            <>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Starting from
              </p>
              <p className="font-display text-xl font-bold leading-none text-foreground">
                ₹{priceFrom.toLocaleString("en-IN")}
                <span className="ml-1 text-xs font-normal text-muted-foreground">/ person</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Pricing
              </p>
              <p className="font-display text-xl font-bold leading-none text-foreground">
                On request
                <span className="ml-1 text-xs font-normal text-muted-foreground">· 2-hr quote</span>
              </p>
            </>
          )}
        </div>
        <TrackedLink
          href={quoteHref}
          event="whatsapp_click"
          params={{ location: "mobile_price_bar", package: packageSlug }}
          className="flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-md transition-transform active:scale-95"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Get Quote
        </TrackedLink>
      </div>
    </div>
  );
}
