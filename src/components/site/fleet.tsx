"use client";

import { motion } from "framer-motion";
import { Bus, Car, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { FLEET, IMAGES, whatsappLink } from "@/lib/site-config";

/**
 * Fleet v2 — mobile-first.
 *
 * VLM mobile audit fixes:
 *   - Removed "See packages instead" button (was visually competing with
 *     the primary "Book a vehicle" CTA on mobile, decision fatigue).
 *   - Single primary CTA, full-width on mobile, two-up on desktop.
 *   - Vehicle list uses 1-col on mobile (was 2-col → cramped).
 *   - Body text on dark bg bumped to white/85 for AA contrast.
 */
export function Fleet() {
  return (
    <section
      id="fleet"
      className="section-y relative isolate overflow-hidden"
      aria-label="Own taxi fleet"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={IMAGES.family}
          alt="Travellers enjoying a mountain vacation with Davis Trip Holidays"
          width={1600}
          height={1066}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-pine-deep/96" aria-hidden />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 80% at 20% 25%, transparent 45%, rgba(0,0,0,0.40) 100%)",
          }}
          aria-hidden
        />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeading
            dark
            eyebrow="Our own garage, our own drivers"
            title="The fleet that carries your trip"
            description="Airport pickups, Delhi-to-Manali runs, wedding groups, school trips or a Spiti expedition — the vehicle arrives from our own garage with a driver we know by name. No aggregator roulette, no last-minute cab-swaps."
          />
          <div className="mt-7 pb-16 sm:pb-0">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-full bg-accent px-8 text-base font-semibold hover:bg-accent/90 sm:w-auto"
            >
              <a href={whatsappLink("Hi! I need a taxi / vehicle booking. Here's my route and dates:")}>
                <MessageCircle className="mr-2 h-5 w-5" aria-hidden />
                Book a vehicle
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
        >
          {FLEET.map((f) => (
            <li
              key={f.vehicle}
              className="rounded-xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-sm transition-colors hover:bg-white/[0.12]"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                {f.seats.includes("42") ? (
                  <Bus className="h-4 w-4 shrink-0 text-gold-light" aria-hidden />
                ) : (
                  <Car className="h-4 w-4 shrink-0 text-gold-light" aria-hidden />
                )}
                {f.vehicle}
              </p>
              <p className="mt-1 text-[12px] leading-[1.55] text-white/95">
                {f.seats} seats · {f.best}
              </p>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
