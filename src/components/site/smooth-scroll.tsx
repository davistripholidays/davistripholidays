"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Lenis smooth scrolling — darkroomengineering/lenis (the go-to smooth
 * scroll library, ~10k stars, 3KB). Adds the inertial, "premium brand"
 * scroll feel of award-winning sites.
 *
 * Guardrails (this is a conversion site, not an art piece):
 *  - completely disabled for prefers-reduced-motion users
 *  - native momentum preserved on touch devices (smoothTouch off)
 *  - R11: disabled while FullPageMode owns the wheel — Lenis sets
 *    scrollTop every frame, which fights mandatory scroll-snap and
 *    rubber-bands. FullPageMode fires fpsnap:on/off; we handshake here
 *    so the two never run at the same time (whichever mounts first).
 *
 * ────────────────────────────────────────────────────────────────────────
 * R16 SPA NAVIGATION SCROLL CONTRACT (always active, reduced-motion too)
 * ────────────────────────────────────────────────────────────────────────
 * Bug it kills: clicking a package card's "Itinerary" button deep inside a
 * long page opened the detail page scrolled to the BOTTOM. Two carrying
 * mechanisms were to blame:
 *   1. Lenis inertia — an in-flight smooth scroll keeps advancing toward a
 *      target computed against the OLD document; on the shorter new page
 *      it clamps to max scroll = bottom.
 *   2. In-flight programmatic glides (the fp-snap settle watchdog's
 *      window.scrollTo) surviving the DOM swap the same way.
 *
 * The contract:
 *   a) stopInertiaOnNavigate (Lenis built-in) — the instant an internal
 *      link to a DIFFERENT pathname is clicked, Lenis.reset() fires: the
 *      old target can never be carried across the navigation.
 *   b) On every PUSH navigation the scroll is hard-reset AFTER commit:
 *      an instant window.scrollTo cancels any surviving smooth glide.
 *      POP navigations (back/forward) are detected via a popstate flag
 *      and left alone — Next.js restores the saved position, Lenis syncs
 *      to it through onNativeScroll.
 *   c) Hash deep links (e.g. /packages/x#itinerary) are resolved against
 *      the NEW layout after commit, offset for the sticky header, and
 *      re-checked once after media settles — correcting the classic
 *      "hash landed at a stale offset" failure.
 */

type Lenis = import("lenis").default;

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const popNavRef = useRef(false);
  const mountedRef = useRef(false);

  /* ── Lenis lifecycle (unchanged handshake + inertia kill) ─────────── */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let lenis: Lenis | null = null;
    let rafId = 0;
    let cancelled = false;
    let suspended = false;

    const start = () => {
      if (cancelled || lenis || suspended) return;
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled || lenis || suspended) return;
        lenis = new Lenis({
          duration: 1.05,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          smoothTouch: false,
          touchMultiplier: 1.6,
          // R16: kill in-flight inertia the moment an internal link to a
          // different page is clicked (see file header, case 1).
          stopInertiaOnNavigate: true,
        });
        lenisRef.current = lenis;
        const raf = (time: number) => {
          lenis?.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      });
    };

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      lenis?.destroy();
      lenis = null;
      lenisRef.current = null;
    };

    const onSnapOn = () => {
      suspended = true;
      stop();
    };
    const onSnapOff = () => {
      suspended = false;
      start();
    };

    // FullPageMode may already be active before this effect runs
    if (document.documentElement.classList.contains("fp-snap")) {
      suspended = true;
    } else {
      start();
    }
    window.addEventListener("fpsnap:on", onSnapOn);
    window.addEventListener("fpsnap:off", onSnapOff);

    return () => {
      cancelled = true;
      window.removeEventListener("fpsnap:on", onSnapOn);
      window.removeEventListener("fpsnap:off", onSnapOff);
      stop();
    };
  }, []);

  /* ── Navigation scroll contract ───────────────────────────────────── */

  /** Sticky header height + a little air (live-measured, never stale). */
  const headerOffset = () => {
    const h = document.querySelector("header");
    return h instanceof HTMLElement ? h.offsetHeight + 12 : 84;
  };

  /** Instant, cancel-everything jump. "instant" beats CSS smooth-behavior
   *  and aborts any in-flight programmatic glide (the case-2 killer). */
  const jumpTo = (top: number) => {
    lenisRef.current?.reset();
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  };

  /** Land on the hash target: measured against the committed layout,
   *  offset for the sticky header, then re-checked once after media has
   *  settled — but never yanks a user who already scrolled away. */
  const landOnHash = (hash: string) => {
    const id = decodeURIComponent(hash.slice(1));
    const target = () => {
      const el = document.getElementById(id);
      if (!el) return null;
      return el.getBoundingClientRect().top + window.scrollY - headerOffset();
    };
    const top = target();
    if (top == null) {
      jumpTo(0);
      return;
    }
    jumpTo(top);

    // Drift guard: images/accordions can shift the document after the
    // jump. Re-land only if we are still where we left the page.
    window.setTimeout(() => {
      const t2 = target();
      if (t2 == null) return;
      const drifted = Math.abs(t2 - window.scrollY);
      const userMoved = Math.abs(top - window.scrollY) > 120;
      if (drifted > 40 && !userMoved) jumpTo(t2);
    }, 400);
  };

  // Mark traversals: popstate fires before the router commits the new
  // tree, so the flag is fresh when the pathname effect runs below.
  // Any document click (capture) clears it — a click precedes every
  // link/button-initiated push navigation.
  useEffect(() => {
    const onPop = () => {
      popNavRef.current = true;
    };
    const onClick = () => {
      popNavRef.current = false;
    };
    window.addEventListener("popstate", onPop);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    const isPop = popNavRef.current;
    popNavRef.current = false;

    // First mount: never hard-reset (browser/Next scroll restoration owns
    // this moment) — but DO correct a hash landing measured before media
    // settled.
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (hash) landOnHash(hash);
      return;
    }

    // Back/forward: Next restores the saved scroll position; we stay out.
    if (isPop) return;

    // Push navigation: own the scroll. Hash → land on the target section
    // (e.g. the day-by-day itinerary); otherwise the page opens at top.
    if (hash) landOnHash(hash);
    else jumpTo(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
