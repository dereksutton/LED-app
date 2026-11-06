const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { buildLeadEmail } = require('./lib/leadEmail');
const { buildCustomerReply, buildOwnerSms } = require('./lib/followUps');
const { mountAdmin } = require('./admin');

const {
    normalizeSource, parseAttribution, classifyOrganic, normalizeRefCode,
} = require('./lib/leadSources');
const { checkForSpam } = require('./lib/spamCheck');

const REQUIRED_FIELDS = ['name', 'email', 'phone', 'street', 'city', 'zip', 'projectType', 'howDidYouHear'];
const OPTIONAL_FIELDS = ['propertyType', 'timeline', 'budgetRange', 'paintingArea', 'message', 'sourceDetail'];
const MAX_LENGTH = { message: 5000, default: 300 };
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;
// A house number and a street name, e.g. "1520 Oak Ln" or "12-B N Main St".
const STREET_RE = /^\d+[A-Za-z]?(?:-[A-Za-z0-9]+)?\s+.*[A-Za-z]{2,}/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;

// Pull only known fields off the body, trimmed and length-checked.
const parseQuoteRequest = (body = {}) => {
    const lead = {};
    for (const field of [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS]) {
        const value = typeof body[field] === 'string' ? body[field].trim() : '';
        if (value.length > (MAX_LENGTH[field] || MAX_LENGTH.default)) {
            return { error: `${field} is too long` };
        }
        if (value) lead[field] = value;
    }
    if (REQUIRED_FIELDS.some((field) => !lead[field])) {
        return { error: 'Please fill in every required field.' };
    }
    if (!EMAIL_RE.test(lead.email)) {
        return { error: 'Invalid email format' };
    }
    if (!STREET_RE.test(lead.street)) {
        return { error: 'Please enter the full street address, with the house number.' };
    }
    if (!ZIP_RE.test(lead.zip)) {
        return { error: 'Please enter a 5-digit ZIP code.' };
    }
    lead.howDidYouHear = normalizeSource(lead.howDidYouHear);
    if (!lead.howDidYouHear) {
        return { error: 'Please tell us how you heard about us.' };
    }
    if (lead.howDidYouHear === 'Other' && !lead.sourceDetail) {
        return { error: 'Please tell us where you heard about us.' };
    }
    lead.state = 'FL';
    lead.address = `${lead.street}, ${lead.city}, FL ${lead.zip}`;
    return { lead: tagLead(lead, body, 'form') };
};

// Tracking, organic credit, ref code and service area, shared by both forms.
const tagLead = (lead, body, channel) => {
    const attribution = parseAttribution(body.attribution);
    if (attribution) lead.attribution = attribution;
    lead.channel = channel;
    const { organic, reason } = classifyOrganic(lead);
    lead.organic = organic;
    if (reason) lead.organicReason = reason;
    const refCode = normalizeRefCode(body.refCode);
    if (refCode) lead.refCode = refCode;
    return lead;
};

// A tap on the site's Call or Text button: no personal details, just the
// kind, the visitor's ref code, the page and the tracked visit.
const parseContactIntent = (body = {}) => {
    const kind = body.kind === 'call' || body.kind === 'text' ? body.kind : null;
    if (!kind) return { error: 'Unknown kind' };
    const intent = { kind };
    const refCode = normalizeRefCode(body.refCode);
    if (refCode) intent.refCode = refCode;
    if (typeof body.page === 'string' && body.page.startsWith('/')) intent.page = body.page.trim().slice(0, 300);
    const attribution = parseAttribution(body.attribution);
    if (attribution) intent.attribution = attribution;
    const { organic, reason } = classifyOrganic({ attribution });
    intent.organic = organic;
    if (reason) intent.organicReason = reason;
    return { intent };
};

/**
 * Builds the API. Dependencies are injected so the lead flow can be tested
 * without Resend or MongoDB.
 *   sendEmail(message) -> Promise, rejects on failure
 *   saveLead(lead)     -> Promise<id>, rejects on failure
 *   sendSms(body)      -> optional; texts the owner about each lead
 *   customerReply      -> optional { phone }; emails the visitor a confirmation
 *   admin              -> optional; turns on /api/admin and /api/public (see admin/index.js)
 */
const createApp = ({
    sendEmail, saveLead, notifyTo, notifyFrom, sendSms = null, customerReply = null,
    saveContactIntent = null, corsOrigins = [], rateLimitMax = 5, intentRateLimitMax = 30, admin = null,
}) => {
    const app = express();

    // Trust the first proxy (Render's reverse proxy) so express-rate-limit reads the real client IP
    app.set('trust proxy', 1);

    // The dashboard API sets up its own body limits, CORS and error handling,
    // so it goes before the form's middleware.
    if (admin) {
        mountAdmin(app, { sendEmail, emailFrom: notifyFrom, emailReplyTo: notifyTo, ownerEmail: notifyTo, corsOrigins, ...admin });
    }

    app.use(express.json({ limit: '20kb' }));
    app.use(express.urlencoded({ extended: true, limit: '20kb' }));
    app.use(cors({ origin: corsOrigins, methods: ['POST', 'GET'] }));

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: rateLimitMax,
        validate: { xForwardedForHeader: false },
    });

    // Saves, emails and follows up on a lead from either form.
    const handleLead = (parse) => async (req, res) => {
        // Honeypot: real visitors never see or fill this field.
        if (req.body && req.body.website) {
            return res.status(200).json({ success: true, message: 'Quote request received.' });
        }

        const { lead, error } = parse(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }

        // A sales pitch is kept and still emailed, but goes to the dashboard's
        // Spam folder and gets no text alert or auto-reply.
        const spamReason = checkForSpam(lead);
        if (spamReason) {
            lead.isSpam = true;
            lead.spam = { markedAt: new Date(), by: 'auto', reason: spamReason };
        }

        // Save and notify independently, so one failing never blocks the other.
        const [saved, emailed] = await Promise.allSettled([
            saveLead(lead),
            sendEmail(buildLeadEmail(lead, { to: notifyTo, from: notifyFrom })),
        ]);

        if (saved.status === 'rejected') {
            console.error('[LEAD_SAVE_FAILED]', saved.reason && saved.reason.message, JSON.stringify(lead));
        }
        if (emailed.status === 'rejected') {
            console.error('[LEAD_EMAIL_FAILED]', emailed.reason && emailed.reason.message, JSON.stringify(lead));
        }

        // The owner only sees leads by email; if that failed and nothing was
        // stored either, tell the visitor so they can call instead.
        if (emailed.status === 'rejected' && saved.status === 'rejected') {
            return res.status(500).json({
                success: false,
                message: 'We could not send your request. Please call us at (904) 385-0426.',
            });
        }

        // Extras never change the visitor's result; failures are only logged.
        const followUps = [];
        if (sendSms && !spamReason) {
            followUps.push(['SMS', sendSms(buildOwnerSms(lead))]);
        }
        if (customerReply && !spamReason && lead.email) {
            followUps.push(['AUTOREPLY', sendEmail(buildCustomerReply({
                to: lead.email, from: notifyFrom, replyTo: notifyTo, phone: customerReply.phone,
            }))]);
        }
        const results = await Promise.allSettled(followUps.map(([, p]) => p));
        results.forEach((r, i) => {
            if (r.status === 'rejected') {
                console.error(`[LEAD_${followUps[i][0]}_FAILED]`, r.reason && r.reason.message);
            }
        });

        res.status(200).json({ success: true, message: 'Quote request received.' });
    };

    app.post('/send-quote', limiter, handleLead(parseQuoteRequest));

    // Call and Text button taps. Never fails the visitor: the tap has
    // already opened their dialer or messages app.
    const intentLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: intentRateLimitMax,
        validate: { xForwardedForHeader: false },
        handler: (req, res) => res.status(204).end(),
    });
    app.post('/api/contact-intent', intentLimiter, async (req, res) => {
        const { intent, error } = parseContactIntent(req.body);
        if (error) return res.status(400).json({ success: false, message: error });
        if (saveContactIntent) {
            try {
                await saveContactIntent(intent);
            } catch (err) {
                console.error('[CONTACT_INTENT_SAVE_FAILED]', err && err.message);
            }
        }
        res.status(204).end();
    });

    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'Server is running' });
    });

    return app;
};

module.exports = { createApp, parseQuoteRequest, parseContactIntent };
