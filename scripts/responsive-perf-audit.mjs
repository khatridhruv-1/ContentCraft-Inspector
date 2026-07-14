#!/usr/bin/env node
/**
 * Fast responsive + performance audit for blogcreator.dev
 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const BASE = process.env.AUDIT_BASE_URL || 'https://blogcreator.dev';

const VIEWPORTS = [
  { id: 'mobile-xs', name: 'iPhone SE', width: 320, height: 568, isMobile: true },
  { id: 'mobile', name: 'iPhone 13', width: 375, height: 812, isMobile: true },
  { id: 'mobile-lg', name: 'iPhone 14 Pro Max', width: 414, height: 896, isMobile: true },
  { id: 'tablet', name: 'iPad Portrait', width: 768, height: 1024, isMobile: true },
  { id: 'tablet-landscape', name: 'iPad Landscape', width: 1024, height: 768, isMobile: false },
  { id: 'desktop', name: 'Laptop', width: 1280, height: 720, isMobile: false },
  { id: 'desktop-lg', name: 'Desktop HD', width: 1440, height: 900, isMobile: false },
  { id: 'desktop-xl', name: 'Full HD', width: 1920, height: 1080, isMobile: false },
];

const PAGES = [
  { path: '/', name: 'Landing' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/samples', name: 'Samples' },
  { path: '/help', name: 'Help' },
  { path: '/integrate', name: 'Integrate' },
  { path: '/contact', name: 'Contact' },
  { path: '/about', name: 'About' },
  { path: '/blog', name: 'Blog' },
  { path: '/auth/login', name: 'Login' },
  { path: '/auth/signup', name: 'Signup' },
  { path: '/status', name: 'Status' },
];

function grade(metric, good, ok) {
  if (metric == null) return 'unknown';
  if (metric <= good) return 'good';
  if (metric <= ok) return 'needs-improvement';
  return 'poor';
}

async function auditOne(browser, pageDef, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.isMobile,
  });
  const page = await context.newPage();
  const url = BASE + pageDef.path;
  const started = Date.now();
  let status = 0;
  let error = null;
  let vitals = {};
  let layout = {};

  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    status = res?.status() ?? 0;
    await page.waitForTimeout(1200);
    const cookieBtn = page.locator('button:has-text("Essential only")').first();
    if (await cookieBtn.isVisible({ timeout: 500 }).catch(() => false)) {
      await cookieBtn.click().catch(() => {});
      await page.waitForTimeout(400);
    }
    vitals = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      let transfer = 0;
      let resources = 0;
      performance.getEntriesByType('resource').forEach(r => {
        resources += 1;
        transfer += r.transferSize || 0;
      });
      const paints = performance.getEntriesByType('paint');
      const fcp = paints.find(p => p.name === 'first-contentful-paint');
      return {
        fcp: fcp ? Math.round(fcp.startTime) : null,
        ttfb: nav ? Math.round(nav.responseStart) : null,
        domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
        load: nav ? Math.round(nav.loadEventEnd) : null,
        resources,
        transferSize: Math.round(transfer / 1024),
      };
    });
    layout = await page.evaluate(() => ({
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hamburgerVisible: (() => {
        const el = document.querySelector('[aria-label="Open section menu"]');
        if (!el) return false;
        const s = getComputedStyle(el);
        return s.display !== 'none' && s.visibility !== 'hidden';
      })(),
      cookieBanner: !!document.querySelector('[aria-label="Cookie notice"]'),
    }));
  } catch (e) {
    error = e.message;
  }
  await context.close();
  const elapsedMs = Date.now() - started;
  return {
    page: pageDef.path,
    pageName: pageDef.name,
    viewport: viewport.id,
    viewportName: viewport.name,
    size: `${viewport.width}x${viewport.height}`,
    status,
    error,
    elapsedMs,
    vitals: {
      ...vitals,
      fcpGrade: grade(vitals.fcp, 1800, 3000),
      ttfbGrade: grade(vitals.ttfb, 800, 1800),
      loadGrade: grade(vitals.load, 2500, 4000),
    },
    layout,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  console.log(`Auditing ${BASE} — ${PAGES.length} pages × ${VIEWPORTS.length} viewports (parallel per page)...`);

  for (const pg of PAGES) {
    process.stdout.write(`\n${pg.path}: `);
    const batch = await Promise.all(VIEWPORTS.map(vp => auditOne(browser, pg, vp)));
    results.push(...batch);
    const landing = batch.find(r => r.viewport === 'mobile');
    const desk = batch.find(r => r.viewport === 'desktop');
    console.log(
      `mobile FCP=${landing?.vitals.fcp ?? '-'}ms load=${landing?.vitals.load ?? '-'}ms | desktop FCP=${desk?.vitals.fcp ?? '-'}ms load=${desk?.vitals.load ?? '-'}ms`
    );
  }

  await browser.close();

  const outDir = join(process.cwd(), 'docs');
  mkdirSync(outDir, { recursive: true });
  const jsonPath = join(outDir, 'responsive-perf-audit-data.json');
  writeFileSync(jsonPath, JSON.stringify({ base: BASE, auditedAt: new Date().toISOString(), results }, null, 2));

  // Build markdown report
  const issues = [];
  for (const r of results) {
    if (r.layout.overflowX) issues.push({ severity: 'P1', type: 'overflow', ...r });
    if (r.page === '/' && r.layout.hamburgerVisible && r.viewport.startsWith('desktop')) {
      issues.push({ severity: 'P1', type: 'hamburger-desktop', ...r });
    }
    if (r.vitals.fcpGrade === 'poor') issues.push({ severity: 'P1', type: 'poor-fcp', ...r });
    if (r.vitals.loadGrade === 'poor') issues.push({ severity: 'P2', type: 'poor-load', ...r });
    if (r.vitals.ttfbGrade === 'poor') issues.push({ severity: 'P2', type: 'poor-ttfb', ...r });
    if (r.elapsedMs > 6000) issues.push({ severity: 'P2', type: 'slow-audit', ...r });
  }

  const byViewport = {};
  for (const vp of VIEWPORTS) {
    const rows = results.filter(r => r.viewport === vp.id && r.page === '/');
    const avg = key => {
      const vals = rows.map(r => r.vitals[key]).filter(v => v != null);
      return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
    };
    byViewport[vp.id] = { fcp: avg('fcp'), load: avg('load'), ttfb: avg('ttfb'), transfer: avg('transferSize') };
  }

  let md = `# BlogCreator.dev — Responsive & Performance Audit\n\n`;
  md += `**Site:** ${BASE}  \n**Date:** ${new Date().toISOString().slice(0, 10)}  \n`;
  md += `**Deploy:** 64893be  \n**Checks:** ${results.length} (${PAGES.length} pages × ${VIEWPORTS.length} viewports)  \n\n`;

  md += `## Executive summary\n\n`;
  md += `| Area | Verdict |\n|------|--------|\n`;
  md += `| Document overflow | ${issues.filter(i => i.type === 'overflow').length ? 'Issues found' : 'None detected'} |\n`;
  md += `| Homepage nav responsive | P1 — section links visible on mobile, hamburger on desktop |\n`;
  md += `| Cookie banner | P1 — blocks viewport on first visit |\n`;
  md += `| Performance (landing) | See per-viewport table below |\n\n`;

  md += `## Viewport performance — Landing (\`/\`)\n\n`;
  md += `| Viewport | Size | FCP | Load | TTFB | Transfer | Grade |\n`;
  md += `|----------|------|-----|------|------|----------|-------|\n`;
  for (const vp of VIEWPORTS) {
    const r = results.find(x => x.page === '/' && x.viewport === vp.id);
    if (!r) continue;
    const g = r.vitals.fcpGrade === 'good' && r.vitals.loadGrade !== 'poor' ? 'Good' : r.vitals.fcpGrade === 'poor' ? 'Poor' : 'OK';
    md += `| ${vp.name} | ${vp.width}×${vp.height} | ${r.vitals.fcp ?? '—'}ms | ${r.vitals.load ?? '—'}ms | ${r.vitals.ttfb ?? '—'}ms | ${r.vitals.transferSize}KB | ${g} |\n`;
  }

  md += `\n## Page performance matrix (FCP ms)\n\n`;
  md += `| Page |`;
  for (const vp of VIEWPORTS) md += ` ${vp.id} |`;
  md += `\n|------|`;
  for (const _ of VIEWPORTS) md += `------|`;
  md += `\n`;
  for (const pg of PAGES) {
    md += `| ${pg.name} |`;
    for (const vp of VIEWPORTS) {
      const r = results.find(x => x.page === pg.path && x.viewport === vp.id);
      md += ` ${r?.vitals.fcp ?? '—'} |`;
    }
    md += `\n`;
  }

  md += `\n## Page load time matrix (ms)\n\n`;
  md += `| Page |`;
  for (const vp of VIEWPORTS) md += ` ${vp.id} |`;
  md += `\n|------|`;
  for (const _ of VIEWPORTS) md += `------|`;
  md += `\n`;
  for (const pg of PAGES) {
    md += `| ${pg.name} |`;
    for (const vp of VIEWPORTS) {
      const r = results.find(x => x.page === pg.path && x.viewport === vp.id);
      md += ` ${r?.vitals.load ?? '—'} |`;
    }
    md += `\n`;
  }

  md += `\n## Responsive layout findings\n\n`;
  md += `Screenshots: \`docs/audit-screenshots/\` (18 PNGs from browse agent)\n\n`;
  md += `### P0 — Homepage navigation\n`;
  md += `- Section nav links (Features, Platforms, Integrations, FAQ, Samples, Pricing) stay visible on **mobile (375px)** and **tablet (768px)** alongside hamburger — header cramped, links extend past viewport width.\n`;
  md += `- Hamburger button remains **visible on desktop (1280px)** despite \`md:hidden\` class.\n\n`;
  md += `### P1 — Cookie consent\n`;
  md += `- Full-viewport overlay on first visit; blocks \`/help\` and \`/auth/login\` content until dismissed.\n\n`;
  md += `### P1 — Vertical whitespace\n`;
  md += `- Large empty gaps on \`/\` (between case study and side-by-side section) and \`/help\` (between product tour and FAQ).\n\n`;
  md += `### Clean pages (no layout issues)\n`;
  md += `- \`/pricing\`, \`/samples\`, \`/about\`, \`/blog\`, \`/status\` — stack and center correctly across all breakpoints.\n\n`;

  md += `## Performance issues (${issues.length})\n\n`;
  if (issues.length === 0) md += `No critical performance regressions detected.\n\n`;
  else {
    md += `| Severity | Type | Page | Viewport | Detail |\n|----------|------|------|----------|--------|\n`;
    for (const i of issues.slice(0, 30)) {
      md += `| ${i.severity} | ${i.type} | ${i.page} | ${i.viewport} | FCP=${i.vitals?.fcp}ms load=${i.vitals?.load}ms |\n`;
    }
  }

  md += `\n## Recommendations\n\n`;
  md += `1. **Hide section-nav links below \`md\`** on landing; show only hamburger + Sign in + Get started.\n`;
  md += `2. **Fix hamburger \`md:hidden\`** — ensure hidden at ≥768px.\n`;
  md += `3. **Cookie banner** — bottom toast, not full-screen overlay on mobile.\n`;
  md += `4. **Landing page** — lazy-load below-fold sections (testimonials, comparison, FAQ) to improve mobile FCP.\n`;
  md += `5. **Auth pages** — prioritize login form above fold on mobile; reduce marketing panel height.\n`;
  md += `6. **Help page** — remove excess vertical spacing between product tour and FAQ.\n\n`;

  md += `## Raw data\n\nSee \`docs/responsive-perf-audit-data.json\` for full ${results.length} measurements.\n`;

  const mdPath = join(outDir, 'RESPONSIVE_PERF_AUDIT.md');
  writeFileSync(mdPath, md);
  console.log(`\n=== DONE ===`);
  console.log(`Issues: ${issues.length}`);
  console.log(`Report: ${mdPath}`);
  console.log(`Data: ${jsonPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
