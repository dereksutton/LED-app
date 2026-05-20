# SEO Changelog — ledcustompainting.com

Tracks SEO changes against `SEO_AUDIT.md`. Each entry notes the date, the audit
section reference, and a summary of what changed.

---

## 2026-05-20 — Audit implementation (P0 + P1 code changes)

### Strategic decisions (confirmed with owner)
- **Geographic targeting:** Homepage stays broad (Jacksonville & North Florida —
  where most of the 5,330 trailing-90-day impressions originate). A dedicated
  Fleming Island location page was added instead of pivoting the homepage. This
  diverges from a literal reading of audit §3 but matches audit §4.2's alternative.
- **Business model:** Treated as a **service-area business** — schema shows city +
  service area, no street address.

### SEO-2, SEO-10.3 — Canonical / indexing fix (root cause)
- **Bug found (not in audit):** `next.config.mjs` sets `trailingSlash: true`, so
  pages are served at `/services/interior-painting/`, but every `canonical` and
  `openGraph.url` omitted the trailing slash. The self-canonical therefore pointed
  at a redirecting URL — a strong candidate cause of "Discovered – currently not
  indexed."
- **Fix:** Added trailing slashes to all `alternates.canonical` and
  `openGraph.url` values in `app/layout.jsx`, `app/services/page.jsx`,
  `app/services/[slug]/page.jsx`, `app/contact/page.jsx`,
  `app/privacy-policy/page.jsx`, `app/terms-of-service/page.jsx`. Verified in the
  built `out/` HTML — every canonical now matches its live URL and sitemap entry.

### SEO-3 — Homepage & meta optimization
- Homepage `<title>` → `Jacksonville Painting Contractors | LED Custom Painting`
  (54 chars).
- Homepage `<meta description>` rewritten with a call to action (155 chars).
- OG/Twitter titles, descriptions, and image alt text updated to match.
- Homepage H1 changed to `Precision Painting Contractors in Jacksonville &
  North Florida` (contains the primary "painting contractors" keyword + geo).
- Added a keyword-rich intro paragraph high on the homepage (`Services` section)
  covering "painting contractors," Jacksonville, Fleming Island, North Florida,
  and all six service keywords; "Fleming Island" links to the new location page.

### SEO-3, SEO-6 — Service page meta
- Added unique `seoTitle` / `seoDescription` fields to each service in
  `src/data/services.js`; `generateMetadata` now uses them (with fallbacks).
- All six service titles are now unique, ≤ 60 chars, keyword + brand.
- All six service descriptions are unique, ~145–155 chars, with phone CTA.
- Added `twitter` metadata to `/services/` (previously inherited the homepage card).

### SEO-4, SEO-7 — Structured data
- `LocalBusiness` schema in `app/layout.jsx` upgraded to
  `["LocalBusiness", "HousePainter"]`, reconfigured as a service-area business:
  removed the placeholder `postalCode` (32256); `areaServed` switched from a
  GeoCircle to an explicit city list (Jacksonville, Fleming Island, Orange Park,
  Middleburg, Green Cove Springs, Ponte Vedra, Clay County, Duval County); added
  `description` and `logo`. `sameAs` now includes the Google Business Profile
  (`?cid=` URL); `aggregateRating` corrected to the real Google total
  (5.0, 82 reviews — was a placeholder 127).
- `Service` schema on service pages: `areaServed` expanded to a city list
  including Fleming Island; added `url`; `name` now includes the city.
- `BreadcrumbList` JSON-LD added to `/services/`, `/contact/`, and the new
  Fleming Island page (service detail pages already had it).
- Note: a separate `Organization` node (audit §7.3) was intentionally **not**
  added — `LocalBusiness`/`HousePainter` is a subtype of `Organization` and a
  duplicate entity with the same name would be an anti-pattern.

### SEO-4 — Local SEO / Fleming Island
- New page `app/painters-fleming-island-fl/page.jsx` — `/painters-fleming-island-fl/`.
  H1 "Painting Contractors in Fleming Island, FL", ~800 words of
  Fleming-Island-specific content, links to all six service pages, neighborhood
  and service-area sections, prose FAQ, `Service` + `BreadcrumbList` schema.
- Footer: added an "Our Service Area" section naming Fleming Island (linked),
  Jacksonville, Orange Park, Middleburg, Green Cove Springs, Doctors Inlet,
  Oakleaf, Ponte Vedra; standardized the NAP service-area line.
- Contact page: embedded a Google Map of the service area and a clear business
  hours block (Mon–Fri 8–6, Sat 9–4, Sun closed — consistent with schema).

### SEO-5 — Near-miss pages
- `ceiling-services` title now targets popcorn-removal intent
  (`Ceiling Painting & Popcorn Removal | LED Custom Painting`).
- `commercial-painting` meta tightened toward commercial keywords.
- Both already exceed the 800-word content target; inbound internal links
  increased via the new Fleming Island page and services-index intro.

### SEO-8.3 — FAQ
- No new `FAQPage` schema added (Google sunsetting FAQ rich results, June 2026).
  Existing FAQ schema on service pages left in place (harmless). The new Fleming
  Island page presents its FAQ as prose, not schema.

### SEO-9 — Internal linking
- Homepage intro, services-index intro, and footer all link to the Fleming
  Island page with descriptive anchor text.
- Visible `Breadcrumbs` component (`src/components/Breadcrumbs.jsx`) added to
  service detail pages, `/services/`, `/contact/`, and the Fleming Island page.
- Legal pages (`/privacy-policy/`, `/terms-of-service/`) intentionally skipped —
  they are `noindex` and already carry a "Back to Home" nav link.

### SEO-10 — Technical SEO
- `public/sitemap.xml` replaced with a generated `app/sitemap.js` (auto-lists all
  routes, includes the new page, `lastmod` 2026-05-20, `dynamic = 'force-static'`
  for static export).
- Service-page hero `<img>` set to `loading="eager"`, `fetchPriority="high"`,
  `decoding="async"` (it is the LCP element); alt text made descriptive.
- `robots.txt` left as-is — already satisfies §10.2 and blocks scraper bots.

### Verified
- `npm run build` succeeds — 15 static routes generated, including
  `/painters-fleming-island-fl/` and `/sitemap.xml`.
- Confirmed in `out/`: every canonical carries the trailing slash; all page
  titles render uniquely; `HousePainter` schema renders site-wide.

---

## Pending — owner action required

- **Post-deploy:** request indexing in GSC URL Inspection for the five
  previously non-indexed `/services/*` URLs and the new Fleming Island page.
- **Off-site (audit §4.3, §11):** Google Business Profile optimization, review
  solicitation, NAP citations, and backlink outreach remain owner/SEO tasks.

---

## Pre-existing tech debt (noted, not changed)

- `tailwind.config.js` uses CommonJS (`module.exports`) while `package.json`
  declares `"type": "module"`; the build prints a warning. Pre-existing, out of
  scope for this SEO pass — convert to ESM `export default` when convenient.
