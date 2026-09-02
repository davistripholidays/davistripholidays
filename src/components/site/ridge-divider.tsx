/**
 * Mountain-ridge SVG divider — a quiet signature element that stitches
 * dark hero/CTA sections to the warm sand sections below them.
 * `flip` renders it for dark-on-top transitions.
 */
export function RidgeDivider({
  fill = "var(--brand-sand)",
  className,
  flip = false,
}: {
  fill?: string;
  className?: string;
  flip?: boolean;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 leading-none ${
        flip ? "rotate-180" : ""
      } ${className ?? ""}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="block h-[44px] w-full sm:h-[60px] lg:h-[80px]"
        role="presentation"
      >
        <path
          d="M0,90 L0,60 C120,20 230,54 350,46 C470,38 540,64 670,46 C800,28 870,58 1000,48 C1130,38 1210,62 1330,46 C1380,38 1420,48 1440,40 L1440,90 Z"
          fill={fill}
        />
        <path
          d="M0,90 L0,76 C160,46 270,74 410,64 C550,54 630,78 770,66 C910,54 1010,76 1150,68 C1290,60 1390,74 1440,62 L1440,90 Z"
          fill={fill}
          opacity="0.45"
        />
      </svg>
    </div>
  );
}
