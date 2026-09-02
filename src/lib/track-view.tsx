"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Fires an analytics event once when mounted (e.g. package_view on package
 * detail pages). Must live in a client module — render it from any page.
 */
export function TrackView({
  event,
  params,
}: {
  event: string;
  params: Record<string, string | number | boolean | undefined>;
}) {
  useEffect(() => {
    track(event, params);
     
  }, [event]);
  return null;
}
