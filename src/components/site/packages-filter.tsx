"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpDown, ChevronDown, SlidersHorizontal } from "lucide-react";
import { PackageCard } from "@/components/site/package-card";
import type { PackageCardData } from "@/lib/types";

const CATEGORY_FILTERS = [
  { id: "all", label: "All trips" },
  { id: "family", label: "Family" },
  { id: "honeymoon", label: "Honeymoon" },
  { id: "group", label: "Group" },
  { id: "pilgrimage", label: "Pilgrimage" },
];

const BUDGET_FILTERS = [
  { id: "all", label: "Any budget", test: (_: number) => true },
  { id: "u15", label: "Under ₹15k", test: (p: number) => p < 15000 },
  { id: "15-25", label: "₹15–25k", test: (p: number) => p >= 15000 && p < 25000 },
  { id: "25-40", label: "₹25–40k", test: (p: number) => p >= 25000 && p < 40000 },
  { id: "40p", label: "₹40k+", test: (p: number) => p >= 40000 },
];

const DURATION_FILTERS = [
  { id: "all", label: "Any length", test: (_: number) => true },
  { id: "short", label: "≤ 4 days", test: (d: number) => d > 0 && d <= 4 },
  { id: "mid", label: "5–7 days", test: (d: number) => d >= 5 && d <= 7 },
  { id: "long", label: "8+ days", test: (d: number) => d >= 8 },
];

const SORTS = [
  { id: "popular", label: "Popular" },
  { id: "price-asc", label: "Price: low → high" },
  { id: "price-desc", label: "Price: high → low" },
  { id: "duration-asc", label: "Duration: shortest" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

/** "4N/5D" → 5 */
function daysFromDuration(duration: string): number {
  const m = duration.match(/(\d+)N\s*\/?\s*(\d+)D/i) || duration.match(/(\d+)\s*Days/i);
  if (m) {
    const nums = m.slice(1).map(Number).filter(Boolean);
    return nums.length ? Math.max(...nums) : 0;
  }
  return 0;
}

/**
 * Client-side package explorer v2 — faceted filters (destination, trip
 * type, budget band, duration band) + sort, per TourRadar/Intrepid
 * patterns from CRO research. Layout-animated grid keeps spatial
 * orientation while cards rearrange.
 */
export function PackagesFilter({
  packages,
  destinations,
}: {
  packages: PackageCardData[];
  destinations: { slug: string; name: string }[];
}) {
  const [destination, setDestination] = useState("all");
  const [category, setCategory] = useState("all");
  const [budget, setBudget] = useState("all");
  const [duration, setDuration] = useState("all");
  const [sort, setSort] = useState<SortId>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const reduced = useReducedMotion();

  const filtered = useMemo(() => {
    const budgetTest = BUDGET_FILTERS.find((b) => b.id === budget)!.test;
    const durationTest = DURATION_FILTERS.find((d) => d.id === duration)!.test;

    const list = packages.filter(
      (p) =>
        (destination === "all" || p.destinationSlug === destination) &&
        (category === "all" || p.category.includes(category)) &&
        // on-request packages (priceFrom 0) pass only when no budget filter
        (budget === "all" || (p.priceFrom > 0 && budgetTest(p.priceFrom))) &&
        durationTest(daysFromDuration(p.duration)),
    );

    const priceOrInfinity = (p: PackageCardData) => (p.priceFrom > 0 ? p.priceFrom : Infinity);
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => priceOrInfinity(a) - priceOrInfinity(b));
      case "price-desc":
        // on-request last on both price sorts; desc keeps priced ones first
        return [...list].sort((a, b) => {
          const pa = a.priceFrom > 0 ? a.priceFrom : -Infinity;
          const pb = b.priceFrom > 0 ? b.priceFrom : -Infinity;
          return pb - pa;
        });
      case "duration-asc":
        return [...list].sort(
          (a, b) => daysFromDuration(a.duration) - daysFromDuration(b.duration),
        );
      default:
        return list;
    }
  }, [packages, destination, category, budget, duration, sort]);

  const activeCount =
    (destination !== "all" ? 1 : 0) +
    (category !== "all" ? 1 : 0) +
    (budget !== "all" ? 1 : 0) +
    (duration !== "all" ? 1 : 0);

  return (
    <div>
      {/* Mobile declutter — filters hide behind one quiet toggle
          (VLM round-3: pill wall = "wall of text" on 390px) */}
      <button
        type="button"
        onClick={() => setFiltersOpen((v) => !v)}
        aria-expanded={filtersOpen}
        className="mb-5 flex w-full items-center justify-between rounded-2xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-accent/40 lg:hidden"
      >
        <span className="flex items-center gap-2.5">
          <SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden />
          Filter &amp; sort
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${filtersOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
      {/* Destination filter */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by destination">
        <FilterPill active={destination === "all"} onClick={() => setDestination("all")}>
          All destinations
        </FilterPill>
        {destinations.map((d) => (
          <FilterPill
            key={d.slug}
            active={destination === d.slug}
            onClick={() => setDestination(d.slug)}
          >
            {d.name}
          </FilterPill>
        ))}
      </div>

      {/* Trip type + budget + duration + sort */}
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by trip type">
        {CATEGORY_FILTERS.map((c) => (
          <FilterPill key={c.id} active={category === c.id} onClick={() => setCategory(c.id)} subtle>
            {c.label}
          </FilterPill>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-border pt-5">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by budget">
          <span className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Budget
          </span>
          {BUDGET_FILTERS.map((b) => (
            <FilterPill key={b.id} active={budget === b.id} onClick={() => setBudget(b.id)} subtle>
              {b.label}
            </FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by duration">
          <span className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Duration
          </span>
          {DURATION_FILTERS.map((d) => (
            <FilterPill key={d.id} active={duration === d.id} onClick={() => setDuration(d.id)} subtle>
              {d.label}
            </FilterPill>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowUpDown className="h-4 w-4 text-accent" aria-hidden />
          <span className="sr-only sm:not-sr-only">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            className="rounded-full border border-border bg-card px-3.5 py-2 text-[13px] font-medium text-foreground shadow-sm transition-colors hover:border-accent/40 focus-visible:outline-2 focus-visible:outline-ring"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        Showing <strong className="font-semibold text-foreground">{filtered.length}</strong> of{" "}
        {packages.length} packages
      </p>

      {filtered.length > 0 ? (
        reduced ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PackageCard key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <motion.div layout className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <motion.div
                layout
                key={p.slug}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <PackageCard p={p} />
              </motion.div>
            ))}
          </motion.div>
        )
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="measure mx-auto text-sm leading-relaxed text-muted-foreground">
            No ready package matches that combination — but we build custom itineraries for every
            destination we list (and several we don&apos;t). Tell us what you have in mind.
          </p>
          <Link
            href="/customize"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Plan a custom trip
          </Link>
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  subtle = false,
  children,
}: {
  active: boolean;
  onClick: () => void;
  subtle?: boolean;
  children: React.ReactNode;
}) {
  const base = subtle
    ? "border-border/70 bg-card text-muted-foreground"
    : "border-border bg-card text-foreground";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-all focus-visible:outline-2 focus-visible:outline-ring ${
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : `${base} hover:border-accent/40 hover:text-accent`
      }`}
    >
      {children}
    </button>
  );
}
