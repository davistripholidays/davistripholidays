"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { Expand } from "lucide-react";
import { SmartImage } from "@/components/site/smart-image";

/**
 * Photo gallery v3 — grid with blur-up tiles + yet-another-react-lightbox
 * (the most-liked React lightbox; swipe gestures, wheel/pinch zoom,
 * keyboard nav, counter). Replace the bespoke lightbox with the
 * battle-tested community standard.
 */
export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [open, setOpen] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setOpen(i)}
            className={`group relative overflow-hidden rounded-2xl ring-1 ring-border focus-visible:outline-2 focus-visible:outline-ring ${
              i === 0
                ? "col-span-2 aspect-[16/9] sm:aspect-[16/10]"
                : "aspect-[4/3]"
            } ${i === 1 ? "col-start-1 sm:col-start-auto" : ""}`}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
          >
            <SmartImage
              src={src}
              alt={`${alt} — photo ${i + 1}`}
              width={640}
              height={480}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <span
              className="absolute inset-0 flex items-center justify-center bg-pine-deep/0 opacity-0 transition-all duration-300 group-hover:bg-pine-deep/35 group-hover:opacity-100"
              aria-hidden
            >
              <Expand className="h-6 w-6 text-white drop-shadow" />
            </span>
          </button>
        ))}
      </div>

      <Lightbox
        open={open !== null}
        close={() => setOpen(null)}
        index={open ?? 0}
        slides={images.map((src, i) => ({
          src,
          alt: `${alt} — photo ${i + 1}`,
        }))}
        plugins={[Zoom, Counter]}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        animation={{ swipe: 320 }}
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: "rgba(12, 22, 18, 0.94)" },
        }}
      />
    </>
  );
}
