"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site-config";
import { tracked } from "@/lib/analytics";

/**
 * WhatsAppFloat v3 — Editorial Himalayan.
 *
 * REWRITE RATIONALE:
 *   v2 had: mobile bottom action bar with Call + WhatsApp buttons + desktop
 *   floating WhatsApp FAB with shadow + green #25D366 background. VLM
 *   flagged: "WhatsApp FAB overlapped content", "green button clashes with
 *   earthy palette".
 *
 *   v3 philosophy (informed by Scott Dunn + Black Tomato):
 *   1. Mobile ONLY. Desktop has no floating button — header has the CTA.
 *   2. 48×48 WhatsApp icon button bottom-right, ink color bg, white icon.
 *      Sharp 4px radius (NOT round FAB — sharp = editorial).
 *   3. NO ping animation. NO expanding label. NO call button.
 *   4. Auto-hide within 2vh of page bottom (lets footer breathe).
 *   5. Hidden on /packages/[slug] (those pages have their own price bar).
 */
export function WhatsAppFloat() {
  const pathname = usePathname() ?? "/";
  const onPackageDetail = /^\/packages\/[^/]+/.test(pathname);
  const onHome = pathname === "/";

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (onPackageDetail) {
      setShow(false);
      return;
    }
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      // Show only after user has scrolled a full viewport
      const pastHero = y > vh * 1.0;
      // Hide within 2 viewports of the page bottom
      const nearBottom = y + vh > docH - vh * 2.0;
      setShow(pastHero && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onPackageDetail]);

  if (onPackageDetail) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          key="mobile-whatsapp"
          href={whatsappLink(
            onHome
              ? "Hi Davis Trip Holidays! I saw your website and would like to plan a trip."
              : "Hi Davis Trip Holidays! I have a question."
          )}
          onClick={() => tracked("whatsapp_click", { location: "mobile_floating_button" })}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 8 }}
          transition={{ duration: 0.25, ease: [0.22, 0.65, 0.35, 1] }}
          aria-label="Chat with Davis Trip Holidays on WhatsApp"
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-[4px] bg-[var(--ink)] text-[var(--paper)] shadow-[0_8px_24px_-8px_rgba(20,17,14,0.4)] transition-all hover:bg-[var(--pine)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pine)] sm:hidden"
          style={{
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
