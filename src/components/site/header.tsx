"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, whatsappLink } from "@/lib/site-config";
import { tracked } from "@/lib/analytics";

/**
 * Header v4 — Atlas Field Journal.
 *
 * Strip the header to its essentials. Single hairline at bottom, no shadow
 * ever, no logo image (use wordmark), single text link CTA on right.
 * Mobile: hamburger only, drawer is paper with hairline-divided list items
 * at editorial type sizes.
 */

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-[var(--paper)] transition-[border-color] duration-300 ${
          scrolled ? "border-b border-[var(--ink)]" : "border-b border-[var(--hairline)]"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8 lg:h-[4.5rem] lg:px-10">
          {/* Brand wordmark — no logo image. Editorial. */}
          <Link
            href="/"
            className="group flex items-baseline gap-3"
            aria-label="Davis Trip Holidays home"
          >
            <span className="font-display text-[18px] font-normal tracking-[-0.025em] text-[var(--ink)] transition-colors group-hover:text-[var(--pine)] lg:text-[20px]">
              Davis Trip Holidays
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)] sm:inline">
              Manali
            </span>
          </Link>

          {/* Desktop nav — center */}
          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link text-[13px] font-medium tracking-[-0.005em] transition-colors ${
                    active
                      ? "is-active text-[var(--ink)]"
                      : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop right rail — single text link CTA, no button */}
          <div className="hidden lg:flex">
            <a
              href={whatsappLink(
                "Hi Davis Trip Holidays! I'd like to plan a trip."
              )}
              onClick={tracked("whatsapp_click", { location: "header_cta" })}
              className="group inline-flex items-center gap-1.5 border-b border-[var(--ink)] pb-1 text-[13px] font-medium text-[var(--ink)] transition-colors hover:border-[var(--pine)] hover:text-[var(--pine)]"
            >
              Plan your trip
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </a>
          </div>

          {/* Mobile — hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center text-[var(--ink)] transition-colors hover:text-[var(--pine)] lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
          <div
            className="absolute inset-0 bg-[rgba(24,21,19,0.5)] backdrop-blur-[3px]"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-[var(--paper)]">
            <div className="flex h-16 items-center justify-between border-b border-[var(--ink)] px-5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                Index
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center text-[var(--ink)] transition-colors hover:text-[var(--pine)]"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto" aria-label="Mobile">
              {NAV_LINKS.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline justify-between border-b border-[var(--hairline)] px-5 py-5"
                >
                  <span className="font-display text-[26px] font-normal tracking-[-0.02em] text-[var(--ink)] transition-colors group-hover:text-[var(--pine)]">
                    {link.label}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              ))}
            </nav>
            <div className="border-t border-[var(--ink)] px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <a
                href={whatsappLink(
                  "Hi Davis Trip Holidays! I'd like to plan a trip."
                )}
                onClick={(e) => {
                  setOpen(false);
                  tracked("whatsapp_click", {
                    location: "mobile_drawer_cta",
                  })(e);
                }}
                className="group flex w-full items-center justify-between border-b border-[var(--ink)] pb-2 text-[14px] font-medium text-[var(--ink)]"
              >
                Plan your trip
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
