"use client";

/**
 * Tilt — pointer-tracking 3D perspective wrapper for cards.
 *
 * - Rotates up to ~5° toward the cursor (desktop mouse/pen only)
 * - Respects prefers-reduced-motion via framer-motion's useReducedMotion
 * - Pure CSS transform (GPU composited) — no per-frame JS, no re-renders
 * - Wraps cards in a neutral div so framer-motion entrance animations on
 *   the inner card keep their own transform channel (no conflicts)
 */

import { useRef, type ReactNode, type PointerEvent } from "react";
import { useReducedMotion } from "framer-motion";

export function Tilt({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || reduceMotion || e.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 … 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const maxDeg = 5;
    const rx = (-py * maxDeg).toFixed(2);
    const ry = (px * (maxDeg + 1)).toFixed(2);
    el.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
  }

  function onPointerLeave() {
    const el = ref.current;
    if (el) el.style.transform = "";
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`h-full [transform-style:preserve-3d] transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
