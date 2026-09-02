#!/usr/bin/env node
/**
 * verify-export.mjs — pre-deploy audit of the static export (out/).
 *
 * Simulates the exact limits Cloudflare Pages free tier enforces:
 *   - 20,000 files max per site   (Free plan)
 *   - 25 MiB max per file         (Free plan)
 *   - expects index.html + 404.html + _headers + /images to be present
 *
 * Run after `npm run build`. Exits non-zero on any failure so it can be
 * wired into CI or run manually before `wrangler pages deploy`.
 */
import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const failures = [];

if (!existsSync(OUT)) {
  console.error("✗ out/ does not exist — run `npm run build` first");
  process.exit(1);
}

// Recursively collect all files
const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else files.push(full);
  }
})(OUT);

// 1. Essential files
for (const must of ["out/index.html", "out/404.html", "out/_headers"]) {
  if (!existsSync(must)) failures.push(`missing essential file: ${must}`);
}
if (!existsSync("out/images")) failures.push("missing out/images (self-hosted photos)");

// 2. File count vs Cloudflare Free limit (20,000)
if (files.length > 20000) {
  failures.push(`file count ${files.length} exceeds Cloudflare Free limit of 20,000`);
}

// 3. Per-file size vs Cloudflare Free limit (25 MiB)
let totalBytes = 0;
const big = [];
for (const f of files) {
  const s = statSync(f).size;
  totalBytes += s;
  if (s > 25 * 1024 * 1024) failures.push(`${f} is ${(s / 1048576).toFixed(1)} MiB (> 25 MiB limit)`);
  if (s > 300 * 1024) big.push([f, s]);
}
big.sort((a, b) => b[1] - a[1]);

// 4. Sanity: JS/CSS chunks exist (the app actually built)
const js = files.filter((f) => f.endsWith(".js")).length;
const css = files.filter((f) => f.endsWith(".css")).length;
if (js === 0) failures.push("no JS chunks emitted");
if (css === 0) failures.push("no CSS chunks emitted");

// 5. Sanity: index.html references the app shell
const html = existsSync("out/index.html") ? (await import("node:fs")).readFileSync("out/index.html", "utf8") : "";
for (const marker of ["Davis Trip Holidays", "_next/static"]) {
  if (!html.includes(marker)) failures.push(`index.html missing expected marker: ${marker}`);
}

// Report
const mb = (n) => (n / 1048576).toFixed(2) + " MiB";
console.log("── Static export audit (out/) " + "─".repeat(28));
console.log(`  files:            ${files.length} / 20,000 (Cloudflare Free)`);
console.log(`  total size:       ${mb(totalBytes)}`);
console.log(`  js chunks:        ${js}`);
console.log(`  css chunks:       ${css}`);
console.log(`  largest files:`);
for (const [f, s] of big.slice(0, 8)) console.log(`    ${mb(s).padStart(10)}  ${f}`);

if (failures.length) {
  console.error("\n✗ FAILURES:");
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log("\n✓ Export audit passed — safe to deploy to Cloudflare Pages free tier.");
