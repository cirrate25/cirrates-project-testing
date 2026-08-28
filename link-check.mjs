#!/usr/bin/env node
/**
 * link-check.mjs
 * ---------------------------------------------------------------------
 * Walks every link in script.js's `sections` array, checks that each URL
 * still resolves, and writes:
 *   - link-check-report.json   full detail (status per link)
 *   - checked-dates.json       compact { "Section Title": { checked, broken } }
 *                              which index.html reads to show "Last checked"
 *
 * Run locally:      node link-check.mjs
 * Requires:          Node 18+ (uses the built-in fetch)
 *
 * Nothing here talks to Supabase or your live site — it only reads the
 * *seed* links baked into script.js's `sections` array, not links people
 * have added at runtime.
 * ---------------------------------------------------------------------
 */
import { readFileSync, writeFileSync } from "node:fs";

const SCRIPT_PATH = new URL("./script.js", import.meta.url);
const TIMEOUT_MS = 10000;
const CONCURRENCY = 8;

function extractSections(source) {
  const start = source.indexOf("const sections = [");
  if (start === -1) throw new Error("Could not find `const sections = [` in script.js");
  const arrayStart = source.indexOf("[", start);
  let depth = 0, i = arrayStart, end = -1;
  for (; i < source.length; i++) {
    if (source[i] === "[") depth++;
    else if (source[i] === "]") {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }
  if (end === -1) throw new Error("Could not find matching `]` for sections array");
  const literal = source.slice(arrayStart, end);
  // Safe: this is our own trusted source file, evaluated locally, not user input.
  return new Function(`return ${literal};`)();
}

function toUrl(raw) {
  const text = String(raw || "").trim();
  if (!text) return null;
  const withProto = /^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`;
  try {
    const u = new URL(withProto);
    return ["http:", "https:"].includes(u.protocol) ? u : null;
  } catch { return null; }
}

async function checkOne(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
    // Some sites reject HEAD (405/403) — retry with GET before calling it broken.
    if (!res.ok && [403, 405, 501].includes(res.status)) {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal });
    }
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, status: null, error: err.name === "AbortError" ? "timeout" : err.message };
  } finally {
    clearTimeout(timer);
  }
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(new Array(Math.min(limit, items.length)).fill(0).map(worker));
  return results;
}

async function main() {
  const source = readFileSync(SCRIPT_PATH, "utf8");
  const sections = extractSections(source);

  const jobs = [];
  for (const section of sections) {
    for (const link of section.links || []) {
      const [name, rawUrl] = link;
      const url = toUrl(rawUrl);
      jobs.push({ section: section.title, name, rawUrl, url });
    }
  }

  console.log(`Checking ${jobs.length} links across ${sections.length} sections...\n`);

  const results = await mapLimit(jobs, CONCURRENCY, async (job) => {
    if (!job.url) return { ...job, ok: false, status: null, error: "invalid URL" };
    const r = await checkOne(job.url.href);
    return { ...job, ...r };
  });

  const broken = results.filter((r) => !r.ok);
  const now = new Date().toISOString();

  const bySection = {};
  for (const section of sections) {
    const forSection = results.filter((r) => r.section === section.title);
    const brokenCount = forSection.filter((r) => !r.ok).length;
    bySection[section.title] = { checked: now, total: forSection.length, broken: brokenCount };
  }

  writeFileSync(new URL("./checked-dates.json", import.meta.url), JSON.stringify(bySection, null, 2));
  writeFileSync(new URL("./link-check-report.json", import.meta.url), JSON.stringify({ ranAt: now, results }, null, 2));

  console.log(`Done. ${results.length - broken.length}/${results.length} links OK.\n`);
  if (broken.length) {
    console.log("Broken or unreachable:");
    for (const b of broken) {
      console.log(`  [${b.section}] ${b.name} — ${b.rawUrl}  (${b.error || b.status})`);
    }
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
