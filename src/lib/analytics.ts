/**
 * Universal analytics event helpers — safe to import from BOTH server and
 * client components (no "use client"; on the server the functions no-op).
 *
 * Events push onto window.dataLayer where Google Tag Manager picks them up
 * (GA4, Meta Pixel, Google Ads & Clarity are configured inside the GTM
 * container — see SETUP-GUIDE.md).
 */

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

/** onClick handler factory for tracked links. */
export function tracked(event: string, params: EventParams = {}) {
  return () => track(event, params);
}
