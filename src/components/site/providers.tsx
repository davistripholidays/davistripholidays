"use client";

import { MotionConfig } from "framer-motion";

/**
 * Global motion configuration.
 * `reducedMotion="user"` makes every framer-motion animation respect the
 * visitor's OS-level "reduce motion" preference automatically.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
