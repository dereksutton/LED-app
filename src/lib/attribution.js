// Remembers how a visitor first arrived (ad click, UTM tags, the site that
// sent them) so the quote form can send it with the lead. Stored only in
// this browser; nothing personal is kept.
const KEY = 'led_attribution';

const CLICK_PARAMS = [
  ['gclid', 'google'], ['gbraid', 'google'], ['wbraid', 'google'],
  ['fbclid', 'facebook'], ['msclkid', 'microsoft'],
];
const UTM = { utm_source: 'utmSource', utm_medium: 'utmMedium', utm_campaign: 'utmCampaign', utm_term: 'utmTerm', utm_content: 'utmContent' };

export function readAttribution() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(KEY) || 'null');
    return stored && typeof stored === 'object' ? stored : null;
  } catch {
    return null;
  }
}

// Called on every public page view. A visit that came from an ad or a
// tagged link replaces what was stored; otherwise the first visit stays.
export function captureAttribution() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const visit = {};
  for (const [param, key] of Object.entries(UTM)) {
    const v = params.get(param);
    if (v) visit[key] = v.slice(0, 150);
  }
  const click = CLICK_PARAMS.find(([param]) => params.get(param));
  if (click) visit.clickId = click[1];
  let referrer = '';
  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    if (ref && ref.host !== window.location.host) referrer = ref.host;
  } catch {
    // unreadable referrer
  }
  if (referrer) visit.referrer = referrer;

  const stored = readAttribution();
  const campaign = Boolean(click || visit.utmSource || visit.utmCampaign);
  if (stored && !campaign && (stored.referrer || !referrer)) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({
      ...visit,
      landingPage: window.location.pathname.slice(0, 300),
      firstSeenAt: (stored && stored.firstSeenAt) || new Date().toISOString(),
    }));
  } catch {
    // storage blocked: the lead just goes without tracking
  }
}
