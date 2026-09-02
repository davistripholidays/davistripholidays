"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

function format(v: number, decimals: number, prefix: string, suffix: string) {
  return prefix + v.toFixed(decimals) + suffix;
}

/**
 * Accessible count-up number.
 * - SSR/no-JS: renders the final value (progressive enhancement).
 * - Animates 0 → value only after mount + in-view, so no hydration mismatch.
 * - Respects prefers-reduced-motion (jumps straight to final value).
 */
export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = format(to, decimals, prefix, suffix);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = format(v, decimals, prefix, suffix);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, decimals, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {format(to, decimals, prefix, suffix)}
    </span>
  );
}
