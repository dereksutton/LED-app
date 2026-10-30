import { execFileSync } from 'node:child_process';
import { getAllServiceSlugs } from '../src/data/services';

// Required for `output: 'export'` — emit sitemap.xml as a static file at build time.
export const dynamic = 'force-static';

const BASE = 'https://ledcustompainting.com';

// Date of the last commit touching any of these paths, so search engines see
// a page as changed only when its content did. Falls back to today when git
// history isn't available at build time.
const lastChanged = (...paths) => {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...paths], { encoding: 'utf8' }).trim();
    if (date) return date;
  } catch {
    // no git in this build environment
  }
  return new Date().toISOString().slice(0, 10);
};

const shared = ['src/data/site.js', 'src/components/SiteHeader.jsx', 'src/components/Footer.jsx'];

export default function sitemap() {
  const servicePages = getAllServiceSlugs().map((slug) => ({
    url: `${BASE}/services/${slug}/`,
    lastModified: lastChanged('src/data/services.js', 'src/components/ServicePageLayout.jsx', 'app/services/[slug]', ...shared),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE}/`,
      lastModified: lastChanged('app/page.jsx', 'src/components', 'src/data'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE}/services/`,
      lastModified: lastChanged('app/services/page.jsx', 'src/data/services.js', ...shared),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...servicePages,
    {
      url: `${BASE}/painters-fleming-island-fl/`,
      lastModified: lastChanged('app/painters-fleming-island-fl', ...shared),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE}/contact/`,
      lastModified: lastChanged('app/contact', 'src/components/Contact.jsx', ...shared),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
