// How a lead heard about LED. The website form must pick one of these, so
// the dashboard can count leads and wins by source.
const LEAD_SOURCES = [
    'Google Search',
    'Google Maps',
    'Facebook',
    'Instagram',
    'Nextdoor',
    'Referral',
    'Previous Customer',
    'Truck or Yard Sign',
    'Other',
];

// Matches the list case-insensitively; anything else is null.
const normalizeSource = (value) => {
    const v = typeof value === 'string' ? value.trim().toLowerCase() : '';
    return LEAD_SOURCES.find((s) => s.toLowerCase() === v) || null;
};

// Tracking the site picks up on its own (ad clicks, UTM tags, the site that
// sent the visitor). Only these keys are kept, each a short string.
const ATTRIBUTION_FIELDS = {
    utmSource: 100, utmMedium: 100, utmCampaign: 150, utmTerm: 150, utmContent: 150,
    clickId: 20, referrer: 200, landingPage: 300,
};
const CLICK_IDS = ['google', 'facebook', 'microsoft'];

const parseAttribution = (input) => {
    if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined;
    const out = {};
    for (const [key, max] of Object.entries(ATTRIBUTION_FIELDS)) {
        const v = typeof input[key] === 'string' ? input[key].trim().slice(0, max) : '';
        if (v) out[key] = v;
    }
    if (out.clickId && !CLICK_IDS.includes(out.clickId)) delete out.clickId;
    const firstSeen = typeof input.firstSeenAt === 'string' ? new Date(input.firstSeenAt) : null;
    if (firstSeen && !Number.isNaN(firstSeen.getTime()) && firstSeen.getTime() <= Date.now()) out.firstSeenAt = firstSeen;
    return Object.keys(out).length ? out : undefined;
};

// How a lead reached LED: the quote form, a phone call,
// a text, or one the owner typed in some other way.
const LEAD_CHANNELS = ['form', 'call', 'text', 'manual'];

// Organic Google credit: 'search' (Google Search), 'gbp' (the Google
// Business Profile) or 'none'.
const ORGANIC_SOURCES = ['search', 'gbp', 'none'];

// The short code the site puts in a prefilled text, so a text or call can be
// tied back to the visit it came from.
const REF_CODE_RE = /^[A-Z0-9]{4,8}$/;
const normalizeRefCode = (value) => {
    const v = typeof value === 'string' ? value.trim().toUpperCase().replace(/^REF\s*/, '') : '';
    return REF_CODE_RE.test(v) ? v : null;
};

const PAID_MEDIUMS = ['cpc', 'ppc', 'paid', 'paidsearch', 'paid_search', 'paid-search', 'display', 'cpm', 'paid_social', 'paidsocial'];

const isGoogleHost = (host) => /(^|\.)google\.[a-z.]{2,7}$/i.test(String(host || '').replace(/:\d+$/, ''));
const isMapsHost = (host) => /^maps\.google\./i.test(String(host || ''));

// Works out organic Google credit from what the site tracked and what the
// visitor (or owner) said. Tracked signals win over the form answer; an ad
// click or a paid tag never counts.
//   -> { organic: 'search' | 'gbp' | 'none', reason }
const classifyOrganic = ({ attribution, howDidYouHear } = {}) => {
    const a = attribution || {};
    const source = String(a.utmSource || '').toLowerCase();
    const medium = String(a.utmMedium || '').toLowerCase();
    const campaign = String(a.utmCampaign || '').toLowerCase();
    if (a.clickId) return { organic: 'none', reason: 'Came from an ad click' };
    if (PAID_MEDIUMS.includes(medium)) return { organic: 'none', reason: 'Came from a paid link' };
    if (source === 'google' && medium === 'organic' && campaign.startsWith('gbp')) {
        return { organic: 'gbp', reason: 'Tagged Google Business Profile link' };
    }
    if (source && !source.includes('google')) return { organic: 'none', reason: `Tagged link from ${a.utmSource}` };
    if (!source && isMapsHost(a.referrer)) return { organic: 'gbp', reason: 'Came from Google Maps' };
    if (!source && isGoogleHost(a.referrer)) return { organic: 'search', reason: 'Came from a Google search' };
    const said = normalizeSource(howDidYouHear);
    if (said === 'Google Search') return { organic: 'search', reason: 'Said they found LED on Google Search' };
    if (said === 'Google Maps') return { organic: 'gbp', reason: 'Said they found LED on Google Maps' };
    return { organic: 'none', reason: '' };
};

// A lead's credit: what was stored when it came in, or for leads from before
// tagging existed, worked out now from the same signals.
const leadOrganic = (lead) => {
    if (lead && lead.organic) return { organic: lead.organic, reason: lead.organicReason || '' };
    return classifyOrganic(lead || {});
};

const ORGANIC_LABELS = { search: 'Google Search', gbp: 'Google Business Profile', none: 'Not organic Google' };
const CHANNEL_LABELS = { form: 'Quote form', call: 'Phone call', text: 'Text', manual: 'Added by hand' };

module.exports = {
    LEAD_SOURCES, normalizeSource, parseAttribution,
    LEAD_CHANNELS, ORGANIC_SOURCES, ORGANIC_LABELS, CHANNEL_LABELS,
    classifyOrganic, leadOrganic, normalizeRefCode, isGoogleHost,
};
