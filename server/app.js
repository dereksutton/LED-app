const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { buildLeadEmail } = require('./lib/leadEmail');
const { buildCustomerReply, buildOwnerSms } = require('./lib/followUps');
const { mountAdmin } = require('./admin');

const REQUIRED_FIELDS = ['name', 'email', 'phone', 'address', 'projectType'];
const OPTIONAL_FIELDS = ['propertyType', 'timeline', 'budgetRange', 'paintingArea', 'message', 'howDidYouHear'];
const MAX_LENGTH = { message: 5000, default: 300 };
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

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
        return { error: 'Missing required fields' };
    }
    if (!EMAIL_RE.test(lead.email)) {
        return { error: 'Invalid email format' };
    }
    return { lead };
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
    corsOrigins = [], rateLimitMax = 5, admin = null,
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

    app.post('/send-quote', limiter, async (req, res) => {
        // Honeypot: real visitors never see or fill this field.
        if (req.body && req.body.website) {
            return res.status(200).json({ success: true, message: 'Quote request received.' });
        }

        const { lead, error } = parseQuoteRequest(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error });
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
        if (sendSms) {
            followUps.push(['SMS', sendSms(buildOwnerSms(lead))]);
        }
        if (customerReply) {
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
    });

    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'Server is running' });
    });

    return app;
};

module.exports = { createApp, parseQuoteRequest };
