import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { PageHero } from "@/components/site/page-hero";
import { listBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Travel Blog — Guides from Manali Locals",
  description:
    "Honest, local travel guides from the Davis Trip Holidays team — seasons, routes, and trip-planning advice from people who live in the Himalayas.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = listBlogPosts();

  return (
    <SiteShell>
      <PageHero
        eyebrow="From the Manali office"
        title="Travel notes & guides"
        description="Season guides, route comparisons and planning advice — written by the people who run these trips, not a content farm."
        breadcrumbs={[{ label: "Blog" }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8" aria-label="All blog posts">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative block aspect-[16/10] overflow-hidden"
                  aria-label={post.title}
                >
                  <img
                    src={post.heroImage}
                    alt={post.heroAlt}
                    width={800}
                    height={500}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <time dateTime={post.date} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </time>
                  <h2 className="mt-2 font-display text-xl font-bold leading-snug text-foreground">
                    <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
                  >
                    Read the guide
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">New guides are on the way.</p>
        )}
      </section>
    </SiteShell>
  );
}
