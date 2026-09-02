import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Shared inner-page hero band — keeps every subpage visually consistent with
 * the brand (sand texture, pine heading, breadcrumb).
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="texture-contour border-b border-border/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-muted-foreground sm:text-[13px]">
              <li>
                <Link href="/" className="transition-colors hover:text-accent">
                  Home
                </Link>
              </li>
              {breadcrumbs.map((b) => (
                <li key={b.label} className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" aria-hidden />
                  {b.href ? (
                    <Link href={b.href} className="transition-colors hover:text-accent">
                      {b.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-foreground/80">
                      {b.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
          )}
          <h1 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
