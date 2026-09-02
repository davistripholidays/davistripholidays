import type { MetadataRoute } from "next";
import { listBlogPosts, listDestinations, listPackages } from "@/lib/content";

const BASE = "https://davistripholidays.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/destinations`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/packages`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/customize`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...["privacy", "terms", "cancellation-refund", "payment-booking", "travel-disclaimer"].map(
      (slug) => ({
        url: `${BASE}/legal/${slug}`,
        lastModified: now,
        changeFrequency: "yearly" as const,
        priority: 0.3,
      }),
    ),
  ];

  const destinationRoutes: MetadataRoute.Sitemap = listDestinations().map((d) => ({
    url: `${BASE}/destinations/${d.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const packageRoutes: MetadataRoute.Sitemap = listPackages().map((p) => ({
    url: `${BASE}/packages/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = listBlogPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...destinationRoutes, ...packageRoutes, ...blogRoutes];
}
