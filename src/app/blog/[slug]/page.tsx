import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { getBlogPost, listBlogPosts } from "@/lib/content";
import { BUSINESS, whatsappLink } from "@/lib/site-config";

export function generateStaticParams() {
  return listBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.heroImage, alt: post.heroAlt }],
    },
  };
}

/** Minimal inline renderer: turns **bold** segments into <strong>. */
function renderInline(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part,
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.heroImage,
    datePublished: post.date,
    author: { "@type": "Organization", name: BUSINESS.name },
    publisher: { "@type": "Organization", name: BUSINESS.name },
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs font-medium text-muted-foreground sm:text-[13px]">
          <a href="/blog" className="transition-colors hover:text-accent">
            ← All travel notes
          </a>
        </nav>

        <header>
          <time dateTime={post.date} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </time>
          <h1 className="mt-3 text-balance font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{post.excerpt}</p>
        </header>

        <img
          src={post.heroImage}
          alt={post.heroAlt}
          width={1200}
          height={630}
          className="mt-8 aspect-[16/8] w-full rounded-2xl object-cover shadow-md"
        />

        <div className="mt-10 space-y-5">
          {post.body
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((para, i) => (
              <p key={i} className="text-pretty leading-[1.8] text-foreground/85">
                {renderInline(para)}
              </p>
            ))}
        </div>

        {/* Soft CTA */}
        <aside className="mt-12 rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
          <h2 className="font-display text-xl font-bold">Planning a trip right now?</h2>
          <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
            We&apos;re based in Manali and run these routes every week — message us and a travel
            expert will reply within 2 working hours with a real plan and an honest quote.
          </p>
          <a
            href={whatsappLink(`Hi! I read your guide "${post.title}" and I'd like to plan a trip.`)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-md transition-transform hover:scale-[1.02] hover:bg-accent/90"
          >
            Plan my trip on WhatsApp
          </a>
        </aside>
      </article>
    </SiteShell>
  );
}
