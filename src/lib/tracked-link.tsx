"use client";

import type { ReactNode } from "react";
import { tracked } from "@/lib/analytics";

/**
 * Client-side anchor link that fires a dataLayer event on click.
 * Use it from server pages that need tracked CTAs (server components
 * cannot attach event handlers directly).
 */
export function TrackedLink({
  href,
  event,
  params = {},
  className,
  ariaLabel,
  children,
}: {
  href: string;
  event: string;
  params?: Record<string, string | number | boolean | undefined>;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={tracked(event, params)}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
