"use client";

import { useEffect, useId, useState } from "react";

/**
 * FullPageMode — R11 (Experiment C promoted site-wide, owner request).
 * R14: universal hard lock — the same perfect snap on every screen.
 *
 * Turns the homepage into a sequence of exactly-one-viewport plates:
 * when scrolling stops, ONE section owns the whole screen — never a
 * half section, never two at once.
 *
 * How (the non-scroll-jacking way):
 *   - Adds `fp-snap` to <html> client-side only. The CSS in globals.css
 *     does the rest: `scroll-snap-type: y mandatory` + `snap-stop: always`
 *     on EVERY screen size and input type. (R11 shipped gentle
 *     `proximity` on touch — momentum could then die between plates and
 *     sections appeared half-cut on phones. What desktop had, everyone
 *     gets now.) The user keeps full control — fast scroll, backwards,
 *     keyboard, hash links all work; nothing is hijacked.
 *   - R14 settle watchdog (below): native snap is the engine, this is
 *     the guarantee. If a browser under-delivers — momentum stopping a
 *     few pixels short, the iOS URL-bar resize reflow, an old Android
 *     WebView with sloppy snap — it glides to the rest position of the
 *     plate that owns the screen, the same "auto-scroll to the section
 *     more on screen" feel as desktop.
 *   - Lenis smooth-scroll is disabled while snap is active (it fights
 *     mandatory snapping) — see smooth-scroll.tsx, they handshake via
 *     the `fpsnap:on` / `fpsnap:off` window events.
 *   - prefers-reduced-motion: never activates — those users get the
 *     classic long-form page.
 *   - The folio rail (right edge) is the wayfinding layer: one tick per
 *     plate, the active one filled, numbers appear on hover. It reads
 *     like the folio marks of a field journal, not a SaaS dot-nav.
 */

export interface FpPlateEntry {
  id: string;
  label: string;
  /** Dark-background plates flip the rail to light ink while active */
  dark?: boolean;
}

/** Singleton channel so SmoothScroll and FullPageMode never race
 *  (layout effects run before page effects — the event covers both). */
export const FP_SNAP_ON_EVENT = "fpsnap:on";
export const FP_SNAP_OFF_EVENT = "fpsnap:off";

export function FullPageMode({ plates }: { plates: FpPlateEntry[] }) {
  const [active, setActive] = useState(0);
  const [onDark, setOnDark] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const listId = useId();

  /* Activate / deactivate the mode itself ------------------------------ */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = !mq.matches;

    const apply = () => {
      const el = document.documentElement;
      if (active && !el.classList.contains("fp-snap")) {
        el.classList.add("fp-snap");
        window.dispatchEvent(new Event(FP_SNAP_ON_EVENT));
        setEnabled(true);
      } else if (!active && el.classList.contains("fp-snap")) {
        el.classList.remove("fp-snap");
        window.dispatchEvent(new Event(FP_SNAP_OFF_EVENT));
        setEnabled(false);
      }
    };

    apply();
    const onChange = () => {
      active = !mq.matches;
      apply();
    };
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      // leaving the homepage — hand the page back to normal scroll
      const el = document.documentElement;
      if (el.classList.contains("fp-snap")) {
        el.classList.remove("fp-snap");
        window.dispatchEvent(new Event(FP_SNAP_OFF_EVENT));
      }
    };
  }, []);

  /* R14: the settle watchdog — the "always perfectly locked" guarantee.

     Native mandatory snap handles every modern browser, but a few
     real-world moments under-deliver: momentum dies a few px short of
     the plate, the iOS URL-bar collapse/expansion reflow lands mid-plate,
     old Android WebViews implement snap sloppily. So: once scrolling has
     TRULY ended (`scrollend` where supported, else 180ms of scroll
     silence) and the viewport is not resting on a valid plate position,
     glide to the rest of the plate that owns the screen.

     Guards that keep it from ever fighting the user:
       - never while a finger is down (touchstart → touchend + 240ms)
       - never while an editable field is focused (mobile keyboard pans
         the page to the input — yanking it to a plate edge would hide it)
       - idempotent: within 4px of a valid rest = already locked, no-op
         (native sub-pixel rounding is not "wrong")
       - oversized plates rest anywhere they cover the snapport (spec-
         legal inner scrolling: expanded FAQ answers, landscape phones)
         — the watchdog only corrects positions NO plate can own
       - also re-checks after resize / visualViewport resize (URL-bar
         transitions, rotation) and after initial load (scroll
         restoration parks mid-plate → lands on a clean plate instead) */
  useEffect(() => {
    if (!enabled) return;
    const els = plates
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const TOL = 4; // px — sub-pixel snap already counts as locked

    let touching = false;
    let gliding = false;
    let glideRelease = 0;
    let idleTimer: ReturnType<typeof setTimeout> | 0 = 0;

    const headerH = () => {
      const h = document.querySelector("header");
      return h instanceof HTMLElement ? h.offsetHeight : 64;
    };

    /** Valid rest scroll positions for one plate: exactly top-aligned
     *  when it fits the snapport, or its full covering range when it is
     *  taller than the viewport (spec-legal free scroll inside). */
    const restRange = (el: HTMLElement): [number, number] => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const min = top - headerH();
      const max = top + el.offsetHeight - window.innerHeight;
      return max > min ? [min, max] : [min, min];
    };

    const editableFocused = () => {
      const el = document.activeElement;
      return (
        el instanceof HTMLElement &&
        el.matches('input, textarea, select, [contenteditable="true"]')
      );
    };

    const check = () => {
      if (gliding || touching || editableFocused()) return;
      if (document.hidden) return;
      const y = window.scrollY;

      // Already resting on a valid plate position? Native snap wins.
      for (const el of els) {
        const [min, max] = restRange(el);
        if (y >= min - TOL && y <= max + TOL) return;
      }

      // Off-lock: glide to the rest of the plate that owns the screen
      // (the one whose centre is nearest the viewport centre — exactly
      // the desktop "auto-scroll to the section more on screen").
      const mid = window.innerHeight * 0.5;
      let best = els[0]!;
      let bestDist = Infinity;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const d = Math.abs(
          r.top + Math.min(r.height, window.innerHeight) * 0.5 - mid
        );
        if (d < bestDist) {
          bestDist = d;
          best = el;
        }
      }
      const [min, max] = restRange(best);
      const target = Math.min(Math.max(y, min), max);
      if (Math.abs(target - y) <= TOL) return;

      gliding = true;
      window.scrollTo({ top: target, behavior: "smooth" });
      if (glideRelease) clearTimeout(glideRelease);
      glideRelease = setTimeout(() => {
        gliding = false;
      }, 700);
    };

    const schedule = (ms: number) => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(check, ms);
    };

    const onScroll = () => schedule(180); // silence = momentum + snap done
    const onScrollEnd = () => schedule(0); // motion truly over (modern browsers)
    const onResize = () => schedule(320); // URL bar / rotation reflow
    const onTouchStart = () => {
      touching = true;
      if (idleTimer) clearTimeout(idleTimer);
    };
    const onTouchEnd = () => {
      touching = false;
      schedule(240); // let momentum + snap finish first
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchEnd, { passive: true });
    schedule(300); // initial load / scroll restoration

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (glideRelease) clearTimeout(glideRelease);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [enabled, plates]);

  /* Track the plate that owns the viewport ----------------------------- */
  useEffect(() => {
    if (!enabled) return;
    const els = plates
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      let best = 0;
      let bestDist = Infinity;
      els.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + Math.min(r.height, window.innerHeight) * 0.5 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
      setOnDark(Boolean(plates[best]?.dark));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, plates]);

  if (!enabled || plates.length === 0) return null;

  return (
    <nav className="fp-rail" aria-label="Sections" aria-describedby={undefined}>
      {plates.map((p, i) => (
        <button
          key={p.id}
          type="button"
          onClick={() =>
            document
              .getElementById(p.id)
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          aria-label={`Go to ${p.label}`}
          aria-current={i === active ? "true" : undefined}
          className={`fp-rail-item ${i === active ? "is-active" : ""} ${
            i === active && onDark ? "fp-rail-on-dark" : ""
          }`}
        >
          <span className="fp-rail-num" aria-hidden>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="fp-rail-tick" aria-hidden />
        </button>
      ))}
      {/* Screen-reader summary of position */}
      <span id={listId} className="sr-only">
        Section {active + 1} of {plates.length}: {plates[active]?.label}
      </span>
    </nav>
  );
}
