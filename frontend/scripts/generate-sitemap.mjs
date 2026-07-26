/**
 * Generates public/sitemap.xml at build time.
 *
 * Why this exists: the sitemap used to list only the ~17 static pages, so course
 * and event detail pages - the pages we actually want ranking - were never
 * declared to search engines and could only be found by crawling internal links.
 * This fetches published courses and events and includes them.
 *
 * Safe by design: if the API is unreachable the existing sitemap.xml is left
 * untouched and the build still succeeds. A deploy must never fail over SEO.
 *
 * Run: node scripts/generate-sitemap.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://www.raasacademy.com';
const API = process.env.VITE_API_BASE_URL || 'https://rass1.onrender.com/api';
const OUT = path.resolve('public/sitemap.xml');
const TIMEOUT_MS = 20000;

// Static pages, with the priorities/frequencies we want to advertise.
const STATIC_ROUTES = [
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  { loc: '/courses', changefreq: 'daily', priority: '0.9' },
  { loc: '/events', changefreq: 'daily', priority: '0.8' },
  { loc: '/about', changefreq: 'monthly', priority: '0.7' },
  { loc: '/companies', changefreq: 'monthly', priority: '0.7' },
  { loc: '/universities', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.7' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.6' },
  { loc: '/faq', changefreq: 'monthly', priority: '0.5' },
  { loc: '/help-center', changefreq: 'monthly', priority: '0.5' },
  { loc: '/company-partnership', changefreq: 'monthly', priority: '0.6' },
  { loc: '/university-partnership', changefreq: 'monthly', priority: '0.6' },
  { loc: '/StudentAmbassadorForm', changefreq: 'monthly', priority: '0.5' },
  { loc: '/login', changefreq: 'yearly', priority: '0.3' },
  { loc: '/register', changefreq: 'yearly', priority: '0.4' },
  { loc: '/terms', changefreq: 'yearly', priority: '0.2' },
  { loc: '/privacy', changefreq: 'yearly', priority: '0.2' },
];

const xmlEscape = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const isoDate = (value) => {
  const d = value ? new Date(value) : new Date();
  return (Number.isNaN(d.getTime()) ? new Date() : d).toISOString().split('T')[0];
};

async function getJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchCourses() {
  try {
    const data = await getJson(`${API}/courses`);
    const list = Array.isArray(data) ? data : data?.courses || [];
    return list
      .filter((c) => c && c._id)
      .map((c) => ({
        loc: `/courses/${c._id}`,
        lastmod: isoDate(c.updatedAt || c.createdAt),
        changefreq: 'weekly',
        priority: '0.9',
      }));
  } catch (err) {
    console.warn(`  ! could not fetch courses (${err.message})`);
    return null;
  }
}

async function fetchEvents() {
  try {
    // Ask for a large page so we get everything, not just the default 10.
    const data = await getJson(`${API}/admin/events?limit=500`);
    const list = Array.isArray(data) ? data : data?.events || data?.data || [];
    return list
      .filter((e) => e && e._id)
      .map((e) => ({
        loc: `/events/${e._id}`,
        lastmod: isoDate(e.updatedAt || e.createdAt || e.date),
        changefreq: 'weekly',
        priority: '0.7',
      }));
  } catch (err) {
    console.warn(`  ! could not fetch events (${err.message})`);
    return null;
  }
}

const today = isoDate();

console.log('Generating sitemap…');
console.log(`  api: ${API}`);

const [courses, events] = await Promise.all([fetchCourses(), fetchEvents()]);

if (courses === null && events === null) {
  console.warn('  ! API unreachable - leaving the existing sitemap.xml unchanged');
  process.exit(0);
}

const entries = [
  ...STATIC_ROUTES.map((r) => ({ ...r, lastmod: today })),
  ...(courses || []),
  ...(events || []),
];

// Guard against duplicate <loc> entries, which search engines flag.
const seen = new Set();
const unique = entries.filter((e) => {
  if (seen.has(e.loc)) return false;
  seen.add(e.loc);
  return true;
});

const body = unique
  .map(
    (e) => `  <url>
    <loc>${xmlEscape(SITE + e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;

fs.writeFileSync(OUT, xml, 'utf8');
console.log(
  `  wrote ${unique.length} urls -> public/sitemap.xml ` +
    `(${STATIC_ROUTES.length} static, ${(courses || []).length} courses, ${(events || []).length} events)`
);
