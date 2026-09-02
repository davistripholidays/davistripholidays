"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reveal — the site-wide scroll-reveal primitive.
 *
 * Usage:
 *   <Reveal>...</Reveal>                    — fade + rise, once
 *   <Reveal delay={0.1}>                    — stagger by hand
 *   <Reveal as="div" className="...">       — any element
 *
 * Respects prefers-reduced-motion: falls back to static render
 * (variants are stripped, content is immediately visible).
 */

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
}

export function Reveal({
  children,
  delay = 0,
  y = 22,
  duration = 0.55,
  className,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Comp = motion[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.21, 0.65, 0.35, 1] }}
      className={className}
    >
      {children}
    </Comp>
  );
}

/** Stagger container + item pair for grids and lists. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.21, 0.65, 0.35, 1] },
  },
};
