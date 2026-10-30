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

module.exports = { LEAD_SOURCES, normalizeSource, parseAttribution };
