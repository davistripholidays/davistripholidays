import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <p className="font-display text-6xl font-bold text-primary sm:text-7xl">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
          This trail doesn&apos;t exist
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          The page you were looking for has moved or never existed — but every
          destination on our map is very real. Let&apos;s get you back on route.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to home
          </Link>
          <Link
            href="/packages"
            className="rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            Browse packages
          </Link>
          <Link
            href="/customize"
            className="rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            Customize a trip
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
