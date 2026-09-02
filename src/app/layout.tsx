import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/site/providers";
import { SmoothScroll } from "@/components/site/smooth-scroll";

/** GTM container id — empty = no script */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";

/** Fraunces — Atlas Field Journal display serif.
 *  Variable font with optical sizing (opsz 9–144), soft + warm contrasts.
 *  Loaded 300 (light) + 400 (regular) + 400 italic. Heavy weights forbidden.
 *  Optical sizing means the same glyph auto-adjusts to display vs text sizes.
 */
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Inter Tight — modern grotesque, slightly condensed feel.
 *  Tighter than Inter, perfect for editorial body + metadata + UI. */
const inter = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://davistripholidays.com"),
  title: {
    default: "Davis Trip Holidays — Tour Packages from Manali, Himachal",
    template: "%s | Davis Trip Holidays",
  },
  description:
    "Manali-based travel agency crafting honeymoon, family and group tour packages across Himachal, Kashmir, Uttarakhand and Goa. Own fleet, 4.9-star rated, GST registered.",
  keywords: [
    "Manali tour package",
    "Himachal tour packages",
    "Shimla Manali honeymoon package",
    "Kashmir tour package",
    "Davis Trip Holidays",
    "travel agency Manali",
    "Manali taxi service",
  ],
  authors: [{ name: "Davis Trip Holidays" }],
  icons: {
    icon: [
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Davis Trip Holidays — Explore India With Local Experts",
    description:
      "Honeymoon, family and group tour packages from a Manali-based agency with its own fleet. 4.9-star rated by 50+ travellers.",
    url: "https://davistripholidays.com",
    siteName: "Davis Trip Holidays",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Davis Trip Holidays — Himalayan holidays, planned by people who live here",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Davis Trip Holidays — Explore India With Local Experts",
    description:
      "Honeymoon, family and group tour packages from a Manali-based agency with its own fleet.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E3A2E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} antialiased bg-background text-foreground font-body`}
      >
        <a
          href="#main"
          className="sr-only z-[100] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
        <SmoothScroll />
        <Toaster />
        {GTM_ID && (
          <Script id="gtm-loader" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
      </body>
    </html>
  );
}
