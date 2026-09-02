/**
 * Davis Trip Holidays logomark — inline SVG bound to CSS design tokens
 * (var(--brand-*)), so a palette change in globals.css automatically
 * re-skins the logo everywhere. Geometry mirrors public/icon.svg.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Davis Trip Holidays logo"
    >
      <rect width="48" height="48" rx="11" fill="var(--brand-pine)" />
      {/* rising sun */}
      <circle cx="33.5" cy="14.5" r="5" fill="var(--brand-gold)" />
      {/* back peak */}
      <path d="M9 35 L20.5 16 L32 35 Z" fill="#ffffff" opacity="0.18" />
      {/* front peak */}
      <path d="M17 35 L28.5 16.5 L40 35 Z" fill="var(--brand-cream)" />
      {/* snow cap */}
      <path
        d="M24.9 22.3 L28.5 16.5 L32.1 22.3 L30.6 21.4 L28.5 19.6 L26.4 21.4 Z"
        fill="var(--brand-gold)"
      />
      {/* road baseline */}
      <rect x="9" y="35" width="31" height="2.6" rx="1.3" fill="var(--brand-terracotta)" />
    </svg>
  );
}
