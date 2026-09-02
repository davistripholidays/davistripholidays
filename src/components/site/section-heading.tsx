"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

/**
 * Consistent section header v3: accent-dashed eyebrow → fluid display
 * title (editorial scale via .text-display) → measured description.
 * One visual voice across every section; `dark` flips the palette for
 * use on photographic/pine backgrounds. Reveals on first scroll-in.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  const reduced = useReducedMotion();

  const content = (
    <>
      <p
        className={cn(
          "flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em]",
          centered && "justify-center",
          dark ? "text-gold-light" : "text-accent"
        )}
      >
        <span
          className={cn("h-px w-7 bg-current opacity-70", centered && "order-1")}
          aria-hidden
        />
        {eyebrow}
        <span
          className={cn("h-px w-7 bg-current opacity-70", !centered && "hidden")}
          aria-hidden
        />
      </p>
      <h2 className="text-display mt-4 font-display text-balance font-bold text-foreground">
        <span className={dark ? "text-white" : undefined}>{title}</span>
      </h2>
      {description && (
        <p
          className={cn(
            "measure mt-4 text-pretty text-base leading-relaxed sm:text-[1.05rem]",
            centered && "mx-auto",
            dark ? "text-white/80" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </>
  );

  if (reduced) {
    return (
      <div className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
        {content}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.65, 0.35, 1] }}
      className={cn("max-w-2xl", centered && "mx-auto text-center", className)}
    >
      {content}
    </motion.div>
  );
}
