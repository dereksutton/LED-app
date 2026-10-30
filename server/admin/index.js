// Wires the dashboard API into the Express app.
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { createAuth } = require('./auth');
const { createAdminRouter } = require('./router');
const { createPublicRouter, createStripeWebhook } = require('./publicRouter');

const CSRF_HEADER = 'x-requested-with';
const CSRF_VALUE = 'led-admin';

const mountAdmin = (app, {
    sendEmail, emailFrom, emailReplyTo, ownerEmail, corsOrigins = [],
    siteUrl = 'https://ledcustompainting.com',
    secureCookie = true,
    stripe = null,
    isDbReady = () => mongoose.connection.readyState === 1,
    loginRateLimitMax,
    publicRateLimitMax,
    now,
}) => {
    const site = new URL(siteUrl);
    const allowedOrigins = new Set([
        site.origin,
        `${site.protocol}//${site.hostname.startsWith('www.') ? site.hostname.slice(4) : `www.${site.hostname}`}`,
        ...corsOrigins,
    ]);
    app.locals.stripeEnabled = Boolean(stripe);

    const noStore = (req, res, next) => {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        next();
    };

    const needsDb = (req, res, next) => {
        if (!isDbReady()) return res.status(503).json({ message: 'The database isn\'t connected. Try again in a minute.' });
        next();
    };

    // Changes must come from our own pages: a browser on another site can't
    // add the custom header without CORS approval, and its Origin is refused.
    const sameSiteOnly = (req, res, next) => {
        if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
        const origin = req.get('origin');
        if ((origin && !allowedOrigins.has(origin)) || req.get(CSRF_HEADER) !== CSRF_VALUE) {
            return res.status(403).json({ message: 'Request refused.' });
        }
        next();
    };

    // Stripe posts here with a signature over the raw body.
    if (stripe) {
        app.post('/api/stripe/webhook', express.raw({ type: '*/*', limit: '1mb' }), needsDb,
            createStripeWebhook({ stripe, sendEmail, emailFrom, ownerEmail, siteUrl: site.origin }));
    }

    const apiCors = cors({
        origin: [...allowedOrigins],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'X-Requested-With'],
    });

    const auth = createAuth({ secureCookie, ...(now ? { now } : {}) });
    app.use('/api/admin', noStore, apiCors, express.json({ limit: '200kb' }), sameSiteOnly, needsDb,
        createAdminRouter({ auth, sendEmail, emailFrom, emailReplyTo, siteUrl: site.origin, loginRateLimitMax }));
    app.use('/api/public', noStore, apiCors, express.json({ limit: '400kb' }), sameSiteOnly, needsDb,
        createPublicRouter({ sendEmail, emailFrom, ownerEmail, siteUrl: site.origin, stripe, rateLimitMax: publicRateLimitMax }));

    // Errors from either router come back as short JSON messages.
    // eslint-disable-next-line no-unused-vars
    app.use('/api', (err, req, res, next) => {
        if (err.type && err.status) { // body-parser: bad JSON or too large
            return res.status(err.status).json({ message: err.status === 413 ? 'That\'s too large to save.' : 'That request couldn\'t be read.' });
        }
        if (err.name === 'InputError') return res.status(err.status).json({ message: err.message });
        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).json({ message: 'Some of the details aren\'t valid.' });
        }
        if (err.status && err.status < 500) return res.status(err.status).json({ message: err.message });
        console.error('[ADMIN_ERROR]', req.method, req.path, err);
        res.status(500).json({ message: 'Something went wrong. Try again.' });
    });
};

module.exports = { mountAdmin, CSRF_HEADER, CSRF_VALUE };
