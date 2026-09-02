"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * CinematicHeroBand — full-width photographic band with Ken Burns drift
 * and gentle scroll parallax (the pattern behind every award-winning
 * travel site hero). Reduces to a static image for prefers-reduced-motion.
 */
export function CinematicHeroBand({
  image,
  alt,
  children,
  overlayPill,
  className,
}: {
  image: string;
  alt: string;
  children?: React.ReactNode;
  overlayPill?: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Photo moves 8% while the band scrolls past — depth without gimmickry.
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div
      ref={ref}
      className={`texture-grain relative isolate overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/10 ${className ?? ""}`}
    >
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y }}>
        <img
          src={image}
          alt={alt}
          width={1600}
          height={900}
          fetchPriority="high"
          decoding="async"
          className={`h-full w-full scale-[1.12] object-cover ${reduced ? "" : "animate-ken-burns"}`}
        />
      </motion.div>
      {/* Legibility grade */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/20"
        aria-hidden
      />
      {overlayPill && (
        <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6">{overlayPill}</div>
      )}
      {children}
    </div>
  );
}
