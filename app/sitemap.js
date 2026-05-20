import { getAllServiceSlugs } from '../src/data/services';

// Required for `output: 'export'` — emit sitemap.xml as a static file at build time.
export const dynamic = 'force-static';

const BASE = 'https://ledcustompainting.com';

// Bump when page content changes meaningfully so search engines re-crawl.
const LAST_MODIFIED = '2026-05-20';

export default function sitemap() {
  const servicePages = getAllServiceSlugs().map((slug) => ({
    url: `${BASE}/services/${slug}/`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE}/services/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...servicePages,
    {
      url: `${BASE}/painters-fleming-island-fl/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE}/contact/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
