import type { NextConfig } from "next";

/**
 * Davis Trip Holidays — Next.js config
 *
 * Deployment target: Cloudflare Pages / Workers (free tier).
 * Architecture: 100% static export ("out/" directory) — zero server compute,
 * unlimited free bandwidth on static assets, no worker size limits.
 *
 * The site is a lead-generation storefront: all conversion happens client-side
 * via WhatsApp deep links, tel: links and the WhatsApp-composing enquiry form.
 * No server rendering, API routes or image optimization pipeline required.
 *
 * If server-side features are ever added (payments, CMS), migrate to
 * @opennextjs/cloudflare — see CLOUDFLARE-DEPLOY.md.
 */
const nextConfig: NextConfig = {
  // Turbopack: explicitly pin workspace root to this project directory.
  // Prevents "inferred your workspace root" crash when dev requests arrive
  // from the sandbox preview domain.
  turbopack: {
    root: __dirname,
  },
  // Allow the sandbox preview proxy to request /_next/* assets cross-origin.
  allowedDevOrigins: ["preview-chat-b6cfc951-8692-48c8-8bf2-2a80447a8d52.space-z.ai"],
  // Static export for Cloudflare Pages ("out/" folder, pure static assets)
  output: "export",
  // All imagery ships locally from /public/images (self-contained bundle,
  // pre-optimized by scripts/optimize_images.py) — no remote CDN dependency,
  // no server-side image pipeline needed on static hosting.
  images: {
    unoptimized: true,
  },
  // Clean URLs on static hosting (/packages/ resolves to /packages/index.html)
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
