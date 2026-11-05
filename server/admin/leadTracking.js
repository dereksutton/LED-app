// Job tracking on leads: the change history, marking a lead won, and
// matching hand-entered customers to the lead they came from.
const QuoteRequest = require('../models/QuoteRequest');
const { formatMoney, DAY } = require('./money');
const { ORGANIC_LABELS, CHANNEL_LABELS, normalizeSource } = require('../lib/leadSources');

// How each tracked field reads in the history.
const SHOW = {
    status: (v) => v || '',
    howDidYouHear: (v) => normalizeSource(v) || v || '',
    sourceDetail: (v) => v || '',
    organic: (v) => (v ? ORGANIC_LABELS[v] || v : ''),
    channel: (v) => (v ? CHANNEL_LABELS[v] || v : ''),
    jobAmountCents: (v) => (typeof v === 'number' ? formatMoney(v) : ''),
    isSpam: (v) => (v ? 'Spam' : 'Not spam'),
    customer: (v) => v || '',
};
const LABELS = {
    status: 'Status', howDidYouHear: 'How they heard', sourceDetail: 'Referred by', organic: 'Google credit',
    channel: 'Came in by', jobAmountCents: 'Job amount', isSpam: 'Spam', customer: 'Customer',
};

// Adds one history line when a tracked field really changes.
const logChange = (lead, by, field, from, to) => {
    const show = SHOW[field] || ((v) => (v === undefined || v === null ? '' : String(v)));
    const a = show(from);
    const b = show(to);
    if (a === b) return false;
    lead.history.push({ at: new Date(), by, field: LABELS[field] || field, from: a, to: b });
    return true;
};

const isWon = (status) => status === 'won' || status === 'completed';

// Sets status won (stamping wonAt) and, when the lead has no job amount yet,
// the amount given. Used when the owner marks a quote accepted and when a
// customer accepts one online.
const markLeadWon = async (leadId, { by, amountCents } = {}) => {
    const lead = await QuoteRequest.findById(leadId);
    if (!lead) return null;
    if (!isWon(lead.status)) {
        logChange(lead, by, 'status', lead.status, 'won');
        lead.status = 'won';
    }
    if (!lead.wonAt) lead.wonAt = new Date();
    if (typeof lead.jobAmountCents !== 'number' && typeof amountCents === 'number' && amountCents > 0) {
        logChange(lead, by, 'jobAmountCents', undefined, amountCents);
        lead.jobAmountCents = amountCents;
    }
    lead.updatedAt = new Date();
    await lead.save();
    return lead;
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The last 10 digits of a US number, or null.
const phoneDigits = (phone) => {
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1);
    return digits.length === 10 ? digits : null;
};

// Matches a stored phone in any format ("(904) 555-0100", "+19045550100").
const phonePattern = (digits) => new RegExp(`${digits.split('').join('\\D*')}\\D*$`);

const MATCH_WINDOW_DAYS = 365;

// The lead a hand-entered customer most likely came from: same phone or
// email, not spam, from the last 12 months. Organic Google leads first,
// then the newest.
const findLeadMatch = async ({ phone, email, now = Date.now() } = {}) => {
    const or = [];
    const digits = phoneDigits(phone);
    if (digits) or.push({ phone: phonePattern(digits) });
    const mail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (mail) or.push({ email: new RegExp(`^${escapeRegex(mail)}$`, 'i') });
    if (!or.length) return null;
    const leads = await QuoteRequest.find({
        $or: or,
        isSpam: { $ne: true },
        createdAt: { $gte: new Date(now - MATCH_WINDOW_DAYS * DAY) },
    }, { notes: 0 }).sort({ createdAt: -1 }).limit(20);
    if (!leads.length) return null;
    const rank = (l) => (l.organic === 'search' || l.organic === 'gbp' ? 0 : 1);
    const lead = [...leads].sort((a, b) => rank(a) - rank(b) || b.createdAt - a.createdAt)[0];
    const by = digits && phonePattern(digits).test(lead.phone || '') ? 'phone' : 'email';
    return { lead, by };
};

module.exports = {
    logChange, markLeadWon, isWon, findLeadMatch, phoneDigits, phonePattern, MATCH_WINDOW_DAYS,
};
