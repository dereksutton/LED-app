# SEO Audit & Implementation Spec — ledcustompainting.com

**Source:** Google Search Console data review (trailing 90 days, as of 5/20/2026)
**Purpose:** Hand this file to Claude Code (or any engineer) and have it implement the recommended improvements. Each section ends with a concrete task checklist and acceptance criteria.

---

## 0. Executive Summary

- **Impressions (90d):** 5,330
- **Clicks (90d):** 18
- **Average CTR:** 0.3%
- **Average Position:** 38.8
- **Indexed pages:** 4 of 10 known URLs
- **Sitemap:** `/sitemap.xml` — Success, 9 pages discovered, last read 5/17/2026
- **HTTPS:** 4/4 valid, 0 issues
- **External backlinks:** 2 (both low-quality)
- **Core Web Vitals:** Insufficient CrUX data (too little real-user traffic)

**Headline issues, in priority order:**
1. 5 of the site's most commercial pages (all `/services/*` except `commercial-painting` and `ceiling-services`) are **Discovered – currently not indexed**.
2. Site ranks for the right commercial keywords but at positions 29–48 (page 3–5), earning impressions but ~0 clicks.
3. Local SEO signals are weak (e.g., "painters fleming island fl" sits at position 48.6).
4. Backlink profile is essentially empty (2 spammy external links).
5. Homepage `<title>`/`<meta description>` are not optimized for the queries already generating impressions.

---

## 1. Repository Conventions (read this first)

When implementing, follow these conventions:

- Treat this audit as the source of truth for SEO changes. Cross-reference each PR/commit with the section number (e.g., `SEO-3.2`).
- Use **kebab-case URLs** that already exist; do not change existing slugs (avoid breaking any earned signals). If a URL must change, add a **301 redirect**.
- All new pages must include: unique `<title>`, unique `<meta name="description">`, self-referencing `<link rel="canonical">`, Open Graph + Twitter card tags, and `LocalBusiness`/`Service` JSON-LD where appropriate.
- All images: descriptive `alt` text, lazy-load below the fold, modern formats (WebP/AVIF), explicit `width`/`height` to prevent CLS.
- All internal links: descriptive anchor text (no "click here" / "learn more" without context).
- Do **not** add `noindex` to any service, location, or content page. Keep `noindex` only on `/terms-of-service/`, `/privacy-policy/`, and any thank-you/confirmation pages.
- After any content/template change, update `sitemap.xml` `<lastmod>` values.

---

## 2. CRITICAL — Indexing Fixes (Section P0)

### 2.1 Pages currently NOT indexed (must fix)

| URL | Status | Action |
|---|---|---|
| `/services/` | Discovered – not indexed | Expand content + internal links + request indexing |
| `/services/cabinet-refinishing/` | Discovered – not indexed | Expand content + internal links + request indexing |
| `/services/exterior-painting/` | Discovered – not indexed | Expand content + internal links + request indexing |
| `/services/interior-painting/` | Discovered – not indexed | Expand content + internal links + request indexing |
| `/services/pressure-washing/` | Discovered – not indexed | Expand content + internal links + request indexing |
| `/terms-of-service/` | Excluded by `noindex` | ✅ Intentional, no change |

### 2.2 Pages currently indexed (protect / improve)

- `/`
- `/contact/`
- `/services/commercial-painting/`
- `/services/ceiling-services/`

### 2.3 Implementation Tasks

- [ ] For each non-indexed URL, verify it returns HTTP 200, has a unique `<title>`, unique `<meta description>`, self-referencing canonical, and is NOT blocked by `robots.txt` or a `noindex` directive.
- [ ] Confirm each non-indexed URL is present in `sitemap.xml` and bump `<lastmod>` to today's date.
- [ ] Expand each non-indexed service page to **700–1,200 words** of unique, locally-relevant content (see content template in §6).
- [ ] Add internal links from `/` and from the two indexed service pages (`commercial-painting`, `ceiling-services`) to each non-indexed page using descriptive anchor text.
- [ ] After deployment, request indexing in GSC URL Inspection for each non-indexed URL.

### 2.4 Acceptance Criteria

- All 5 URLs return 200, are crawlable, and appear in the updated sitemap.
- Within 14 days of deployment + reindex request, GSC shows "URL is on Google" for each.

---

## 3. CRITICAL — Homepage & Meta Optimization (Section P0)

### 3.1 Current Problem

Homepage gets 5,050 impressions / 17 clicks (0.3% CTR) at position 38.6. Title/description are not aligned with the high-impression queries.

### 3.2 Target Queries (already earning impressions)

- painting contractors
- painting services near me
- painting company
- painter near me
- residential painting company
- interior painters
- painting services
- painters near me
- painters fleming island fl

### 3.3 Implementation Tasks

- [ ] Update homepage `<title>` to: `Painting Contractors in Fleming Island, FL | LED Custom Painting`  (≤ 60 chars).
- [ ] Update homepage `<meta name="description">` to: `Licensed & insured painting contractors serving Fleming Island, FL. Interior, exterior, cabinet refinishing & pressure washing. Free quotes — call today.`  (≤ 158 chars).
- [ ] Ensure H1 contains the primary phrase: `Painting Contractors in Fleming Island, FL`.
- [ ] First 100 words of homepage copy include: "painting contractors," "Fleming Island," and at least 2 of the service keywords.
- [ ] Add a visible services section linking to all 6 service pages using exact-match anchor text (e.g., "Interior Painting Services," "Exterior Painting Services," "Cabinet Refinishing," "Pressure Washing," "Ceiling Services," "Commercial Painting").
- [ ] Add a `<link rel="canonical" href="https://ledcustompainting.com/">` self-reference.
- [ ] Apply equivalent title/description rewrites to each service page (template in §6.3).

### 3.4 Acceptance Criteria

- All page titles unique, ≤ 60 chars, contain primary keyword + brand.
- All meta descriptions unique, 140–158 chars, include a call to action.
- Homepage H1 contains "Painting Contractors" + "Fleming Island, FL".

---

## 4. HIGH — Local SEO (Section P1)

### 4.1 Current Problem

"painters fleming island fl" ranks at position 48.6 despite being a low-competition, high-intent geo query. Local entity signals are weak.

### 4.2 Implementation Tasks

- [ ] Create or strengthen a dedicated location section/page targeting Fleming Island, FL. Recommended URL: `/painters-fleming-island-fl/` OR strengthen the homepage if the site is single-location.
- [ ] Add NAP (Name, Address, Phone) consistently in the footer of every page. Use the same exact format everywhere.
- [ ] Embed a Google Map of the business location on the contact page.
- [ ] Add a "Service Area" section listing nearby neighborhoods/cities (Orange Park, Middleburg, Green Cove Springs, Jacksonville suburbs, Clay County).
- [ ] Add `LocalBusiness` JSON-LD schema to the homepage and contact page (template in §7.1).
- [ ] Add `Service` JSON-LD to each service page (template in §7.2).
- [ ] Add `Organization` JSON-LD sitewide with `sameAs` links to social profiles + Google Business Profile.

### 4.3 Non-code tasks (flag to client/owner)

- [ ] Claim & fully optimize Google Business Profile (categories, services, photos, posts, hours, attributes).
- [ ] Solicit Google reviews (target: 10+ in next 90 days).
- [ ] Submit consistent NAP citations to: Yelp, Bing Places, BBB, Houzz, HomeAdvisor, Angi, Thumbtack, Nextdoor, Sherwin-Williams contractor directory, Benjamin Moore contractor directory, Clay County Chamber of Commerce.

### 4.4 Acceptance Criteria

- LocalBusiness, Service, Organization JSON-LD pass Google Rich Results Test with no errors.
- NAP appears in identical format on every page.
- "painters fleming island fl" position improves to ≤ 20 within 90 days.

---

## 5. HIGH — Near-Miss Page Optimization (Section P1)

### 5.1 `/services/ceiling-services/` — Page 1 Opportunity

Currently position 12.9 with 119 impressions and 0 clicks. Smallest push of any page to reach page 1.

- [ ] Expand to 800+ words. Cover: popcorn ceiling removal, ceiling repair, smooth/knockdown refinishing, drywall patching, color matching, paint types, process, before/after images.
- [ ] Add `<title>`: `Ceiling Painting & Popcorn Removal in Fleming Island, FL | LED Custom Painting`
- [ ] Add `<meta description>` with CTA.
- [ ] Add internal links from homepage + 3 other service pages.
- [ ] Add Service JSON-LD.
- [ ] Add an FAQ section in prose (don't bother with FAQPage schema — see §8.3).

### 5.2 `/services/commercial-painting/`

Position 33.5, 241 impressions, 0 clicks.

- [ ] Same template as 5.1, targeted to commercial keywords ("commercial painters Fleming Island," "office painting contractors Jacksonville," "retail painting services").

### 5.3 `/contact/`

Position 30.5, 120 impressions, 0 clicks. Improve to capture brand + "contact" intent.

- [ ] Title: `Contact LED Custom Painting | Free Painting Quotes in Fleming Island, FL`
- [ ] Add a clear, above-the-fold contact form, phone CTA, embedded map, and business hours.

---

## 6. Content Templates

### 6.1 Service Page Skeleton (use for all 5 unindexed pages)

```markdown
# [Service Name] in Fleming Island, FL

[1-2 sentence value prop with primary keyword + location.]

## Why Choose LED Custom Painting for [Service]?
- Licensed & insured
- [X] years serving Fleming Island & Clay County
- Free, no-obligation quotes
- [Specific differentiator]

## Our [Service] Process
1. Consultation & free quote
2. Surface prep
3. Premium materials (Sherwin-Williams, Benjamin Moore, etc.)
4. Application
5. Cleanup & walk-through

## What's Included
[Bulleted list of deliverables.]

## Materials & Brands We Use
[Paragraph naming brands — earns relevance signals.]

## Recent Projects in Fleming Island & Surrounding Areas
[2-3 short case-study paragraphs with images + alt text.]

## Frequently Asked Questions
### How long does [service] take?
[Answer in prose, 2-3 sentences.]
### How much does [service] cost in Fleming Island?
[Answer in prose, 2-3 sentences.]
### Do you offer warranties?
[Answer.]
### What areas do you serve?
[Answer — list neighborhoods/cities.]

## Get a Free [Service] Quote
[CTA with phone + form.]
```

### 6.2 Per-page keyword targets

| Page | Primary keyword | Secondary keywords |
|---|---|---|
| `/services/interior-painting/` | interior painters fleming island fl | interior painting services, residential interior painting, room painting |
| `/services/exterior-painting/` | exterior painters fleming island fl | exterior house painting, exterior painting services, stucco painting |
| `/services/cabinet-refinishing/` | cabinet refinishing fleming island | kitchen cabinet painting, cabinet painters, cabinet refacing |
| `/services/pressure-washing/` | pressure washing fleming island fl | power washing services, house pressure washing, driveway cleaning |
| `/services/` | painting services fleming island fl | painting contractors, residential painting company |

### 6.3 Title/Meta template

```
<title>{Primary Keyword} | LED Custom Painting</title>
<meta name="description" content="{Service description} in Fleming Island, FL. Licensed & insured. Free quotes — call [PHONE] today.">
```

---

## 7. Structured Data (JSON-LD)

### 7.1 LocalBusiness — add to `/` and `/contact/`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://ledcustompainting.com/#localbusiness",
  "name": "LED Custom Painting",
  "image": "https://ledcustompainting.com/[logo-or-storefront].jpg",
  "url": "https://ledcustompainting.com/",
  "telephone": "[PHONE]",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[STREET]",
    "addressLocality": "Fleming Island",
    "addressRegion": "FL",
    "postalCode": "[ZIP]",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[LAT]",
    "longitude": "[LNG]"
  },
  "areaServed": [
    {"@type": "City", "name": "Fleming Island"},
    {"@type": "City", "name": "Orange Park"},
    {"@type": "City", "name": "Middleburg"},
    {"@type": "City", "name": "Green Cove Springs"},
    {"@type": "City", "name": "Jacksonville"}
  ],
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "08:00",
    "closes": "17:00"
  }],
  "sameAs": [
    "[Google Business Profile URL]",
    "[Facebook URL]",
    "[Instagram URL]"
  ]
}
</script>
```

### 7.2 Service — add to each `/services/*` page

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "[Interior Painting]",
  "provider": {"@id": "https://ledcustompainting.com/#localbusiness"},
  "areaServed": {"@type": "City", "name": "Fleming Island, FL"},
  "name": "[Interior Painting Services in Fleming Island, FL]",
  "description": "[1-2 sentence description.]",
  "url": "https://ledcustompainting.com/services/interior-painting/"
}
</script>
```

### 7.3 Organization — sitewide (in `<head>` layout)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "LED Custom Painting",
  "url": "https://ledcustompainting.com/",
  "logo": "https://ledcustompainting.com/[logo].png",
  "sameAs": ["[GBP URL]","[Facebook]","[Instagram]"]
}
</script>
```

---

## 8. Existing Structured Data (review/maintain)

### 8.1 Breadcrumbs

6 valid / 0 invalid. ✅ Keep current implementation. Verify breadcrumbs render on every new page added.

### 8.2 Review snippets

4 valid / 0 invalid. ✅ Keep. Add more legitimate reviews where appropriate (do not fabricate).

### 8.3 FAQ schema

2 valid / 0 invalid, BUT **GSC banner notice (5/7/2026):** FAQ rich results are no longer appearing in Google Search and the report will be removed in June 2026.

- [ ] Do NOT invest in adding more FAQ schema.
- [ ] Existing FAQ schema can stay (harmless), but rewrite FAQ content as **prose within service pages** so it can rank for People Also Ask queries.

---

## 9. Internal Linking

### 9.1 Current state

Only 11 internal links logged across the site.

### 9.2 Implementation Tasks

- [ ] Add a **services mega-section** on the homepage with a card/grid linking to all 6 service pages with descriptive anchor text.
- [ ] Add a **footer** containing links to: all service pages, contact, location/area-served page, GBP, social.
- [ ] On each service page, add a "Related Services" section linking to 2–3 sibling services.
- [ ] Use keyword-rich anchor text (e.g., "interior painting services in Fleming Island"), not "learn more."
- [ ] Add breadcrumbs to all non-home pages (already implemented per §8.1 — verify on new pages).

### 9.3 Acceptance Criteria

- Every service page is ≤ 1 click from the homepage.
- Every service page has ≥ 3 internal inbound links from other site pages.

---

## 10. Technical SEO

### 10.1 Sitemap

- [ ] Verify `sitemap.xml` includes all 9+ pages with accurate `<lastmod>`, `<changefreq>`, `<priority>`.
- [ ] After major content changes, ping GSC to re-fetch.

### 10.2 robots.txt

- [ ] Confirm `robots.txt` allows crawling of all public pages and references the sitemap:
```
  User-agent: *
  Allow: /
  Sitemap: https://ledcustompainting.com/sitemap.xml
```

### 10.3 Canonicals

- [ ] Every indexable page has a self-referencing `<link rel="canonical">`.
- [ ] Hash-fragment URLs (`/#services`, `/#quote`, `/#testimonials`) are NOT canonicalized as separate URLs.

### 10.4 HTTPS

- ✅ 4/4 valid, no issues. Maintain.

### 10.5 Mobile experience

Mobile CTR (1%) is 10× desktop CTR (0.1%). Protect this strength.

- [ ] Confirm responsive layout, ≥ 48px tap targets, no horizontal scroll, no intrusive interstitials.
- [ ] Hero image: preload, WebP/AVIF, ≤ 100 KB, explicit dimensions.

### 10.6 Core Web Vitals (manual baseline)

CrUX has insufficient data. Establish a manual baseline via PageSpeed Insights for each indexable page.

- [ ] Lab LCP < 2.5s on mobile.
- [ ] Lab INP < 200 ms.
- [ ] Lab CLS < 0.1.
- [ ] Defer non-critical JS, remove unused plugins, enable HTTP/2 + Brotli, set long cache headers on static assets.

---

## 11. Backlink & Authority (off-site — task list for owner/SEO)

### 11.1 Current state

- 2 external links total, from `seol.store` and `writeradar.com` (low quality).
- Only linking anchor text: "ledcustompainting com" (not a real keyword).

### 11.2 Tasks

- [ ] Review `seol.store` and `writeradar.com`. If clearly spammy, prepare a `disavow.txt` and submit via GSC Disavow tool. Do not rush — only disavow if pattern is clearly toxic.
- [ ] Build local citations (see §4.3).
- [ ] Pursue links from: Clay County Chamber of Commerce, local realtor/interior designer partnerships, supplier directories (Sherwin-Williams, Benjamin Moore), local sponsorships, community project PR.
- [ ] Target: 10–20 quality referring domains within 6 months.

---

## 12. Tracking & Measurement

- [ ] Re-verify GA4 + GSC integration.
- [ ] Set up weekly GSC monitoring with the following KPIs:
  - Indexed page count (goal: 9/9 by Day 30)
  - Average position for top 10 commercial queries (goal: 10-point lift in 90 days)
  - Homepage CTR (goal: 1.0%+ in 90 days)
  - Clicks (goal: 75+ in trailing 90 days by Day 90)
- [ ] Track "painters fleming island fl" specifically (goal: ≤ 20 in 90 days, ≤ 10 in 180 days).

---

## 13. Prioritized Roadmap

### Week 1–2 (P0 quick wins)
- §2 Indexing fixes (templates + reindex requests)
- §3 Homepage + meta rewrites
- §9 Internal linking pass

### Week 3–6 (P0 content depth)
- §6 Service page expansions (5 pages × 700–1,200 words)
- §5 Near-miss optimization (ceiling-services, commercial-painting, contact)
- §7 LocalBusiness, Service, Organization schema

### Week 7–12 (P1 authority)
- §4 Local SEO buildout + GBP optimization
- §11 Citations + 5–10 quality local backlinks
- §10.6 Core Web Vitals tuning
- §12 Weekly monitoring established

---

## 14. Definition of Done (per task)

A task is "done" when:
1. Code/content is deployed to production.
2. Page passes Google Rich Results Test (if schema was added).
3. URL has been re-submitted to GSC URL Inspection.
4. Acceptance criteria for the corresponding section are met.
5. A note is added to a `seo-changelog.md` with date, section reference, and change summary.

---

## 15. Files Likely to Be Touched

> Adjust to actual stack (WordPress, Next.js, static, etc.). Update this list once Claude Code identifies the framework.

- `/sitemap.xml`
- `/robots.txt`
- Homepage template (`index.*` / `page-home.*` / `app/page.tsx`)
- Service page templates (`/services/*`)
- Contact page (`/contact/`)
- Global `<head>` layout / SEO component
- Footer component (NAP + service links)
- JSON-LD partials/components
- Image assets (compression + alt text)
- `seo-changelog.md` (create new)

---

**End of SEO Audit Spec.**