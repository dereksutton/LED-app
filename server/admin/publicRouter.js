// /api/public: the pages customers open from an emailed link. Each link
// carries a long random token; there is no other way in.
const express = require('express');
const rateLimit = require('express-rate-limit');
const { Customer, Quote, Invoice, Contract, QuoteRequest } = require('./models');
const { computeTotals, invoiceState, formatMoney } = require('./money');
const { quotePdf, invoicePdf, contractPdf } = require('./pdf');
const { buildOwnerAlert } = require('./emails');
const { InputError, str, getSettings } = require('./docs');

const TOKEN_RE = /^[A-Za-z0-9_-]{30,64}$/;
const SIGNATURE_RE = /^data:image\/png;base64,[A-Za-z0-9+/=]+$/;
const MAX_SIGNATURE_LENGTH = 300000;

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const findByToken = async (token) => {
    if (!TOKEN_RE.test(String(token))) return null;
    for (const [kind, Model] of [['quote', Quote], ['invoice', Invoice], ['contract', Contract]]) {
        const doc = await Model.findOne({ publicToken: token });
        // Drafts aren't shared yet, so their links don't open.
        if (doc && doc.status !== 'draft') return { kind, doc };
    }
    return null;
};

const businessInfo = (s) => ({
    businessName: s.businessName, phone: s.phone, email: s.email, address: s.address, license: s.license,
});

const items = (doc) => (doc.items || []).map(({ description, quantity, unitPriceCents }) => ({ description, quantity, unitPriceCents }));

// Only what the customer needs to see: no internal notes, history or ids.
const publicView = ({ kind, doc, customer, settings, stripeEnabled }) => {
    const common = {
        kind,
        number: doc.number,
        title: doc.title,
        status: doc.status,
        sentAt: doc.sentAt,
        business: businessInfo(settings),
        customer: { name: customer.name, address: customer.address },
    };
    if (kind === 'quote') {
        return {
            ...common,
            items: items(doc),
            taxRate: doc.taxRate,
            depositPercent: doc.depositPercent,
            notes: doc.notes,
            terms: doc.terms,
            validUntil: doc.validUntil,
            acceptedAt: doc.acceptedAt,
            acceptedName: doc.acceptedName,
            ...computeTotals(doc),
        };
    }
    if (kind === 'invoice') {
        const state = invoiceState(doc);
        return {
            ...common,
            items: items(doc),
            taxRate: doc.taxRate,
            notes: doc.notes,
            terms: doc.terms,
            dueDate: doc.dueDate,
            paymentInstructions: settings.paymentInstructions,
            ...computeTotals(doc),
            paidCents: state.paidCents,
            balanceCents: state.balanceCents,
            status: state.status,
            canPayOnline: Boolean(stripeEnabled) && state.balanceCents > 0 && doc.status !== 'void',
        };
    }
    return {
        ...common,
        body: doc.body,
        bodyHash: doc.bodyHash,
        totalCents: doc.totalCents,
        signedAt: doc.signature && doc.signature.signedAt,
        signedName: doc.signature && doc.signature.name,
    };
};

const createPublicRouter = ({ sendEmail, emailFrom, ownerEmail, siteUrl, stripe, rateLimitMax = 60 }) => {
    const router = express.Router();
    router.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: rateLimitMax,
        validate: { xForwardedForHeader: false },
        handler: (req, res) => res.status(429).json({ message: 'Too many requests. Try again in a few minutes.' }),
    }));

    const load = async (token) => {
        const found = await findByToken(token);
        if (!found) throw new InputError('This link isn\'t valid. Ask us to send it again.', 404);
        return found;
    };

    const alertOwner = async (subject, lines, path) => {
        try {
            await sendEmail(buildOwnerAlert({ subject, lines, link: `${siteUrl}${path}`, to: ownerEmail, from: emailFrom }));
        } catch (err) {
            console.error('[OWNER_ALERT_FAILED]', err && err.message);
        }
    };

    router.get('/doc/:token', wrap(async (req, res) => {
        const { kind, doc } = await load(req.params.token);
        if (doc.status === 'sent') doc.status = 'viewed';
        if (!doc.viewedAt) {
            doc.viewedAt = new Date();
            doc.history.push({ event: 'Opened by customer' });
        }
        if (doc.isModified()) await doc.save();
        const [customer, settings] = await Promise.all([Customer.findById(doc.customerId), getSettings()]);
        res.json(publicView({ kind, doc, customer: customer || {}, settings, stripeEnabled: Boolean(stripe) }));
    }));

    router.get('/doc/:token/pdf', wrap(async (req, res) => {
        const { kind, doc } = await load(req.params.token);
        const [customer, settings] = await Promise.all([Customer.findById(doc.customerId), getSettings()]);
        const build = { quote: quotePdf, invoice: invoicePdf, contract: contractPdf }[kind];
        const pdf = await build({ [kind]: doc, customer: customer || {}, settings });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${doc.number}.pdf"`);
        res.send(pdf);
    }));

    router.post('/doc/:token/accept', wrap(async (req, res) => {
        const { kind, doc } = await load(req.params.token);
        if (kind !== 'quote') throw new InputError('Only estimates can be accepted.');
        if (!['sent', 'viewed'].includes(doc.status)) throw new InputError('This estimate was already answered.', 409);
        if (doc.validUntil && new Date(doc.validUntil).getTime() + 24 * 3600 * 1000 < Date.now()) {
            throw new InputError('This estimate has expired. Call us and we\'ll update it.', 409);
        }
        const name = str(req.body.name, 200);
        if (!name || req.body.agree !== true) throw new InputError('Type your full name and tick the box to accept.');
        doc.status = 'accepted';
        doc.acceptedAt = new Date();
        doc.acceptedName = name;
        doc.acceptedIp = req.ip;
        doc.history.push({ event: `Accepted online by ${name}` });
        await doc.save();
        if (doc.leadId) await QuoteRequest.updateOne({ _id: doc.leadId }, { status: 'won', updatedAt: new Date() });
        await alertOwner(`Estimate ${doc.number} accepted`, [
            `${name} accepted estimate ${doc.number} (${formatMoney(computeTotals(doc).totalCents)}).`,
            'Next step: send the contract or the deposit invoice from the dashboard.',
        ], `/admin/quotes/edit/?id=${doc._id}`);
        res.json({ ok: true, status: doc.status });
    }));

    router.post('/doc/:token/decline', wrap(async (req, res) => {
        const { kind, doc } = await load(req.params.token);
        if (kind !== 'quote') throw new InputError('Only estimates can be declined.');
        if (!['sent', 'viewed'].includes(doc.status)) throw new InputError('This estimate was already answered.', 409);
        const reason = str(req.body.reason, 1000);
        doc.status = 'declined';
        doc.declinedAt = new Date();
        doc.history.push({ event: `Declined online${reason ? `: ${reason}` : ''}` });
        await doc.save();
        await alertOwner(`Estimate ${doc.number} declined`, [
            `The customer declined estimate ${doc.number}.`,
            reason ? `Their reason: ${reason}` : 'They gave no reason.',
        ], `/admin/quotes/edit/?id=${doc._id}`);
        res.json({ ok: true, status: doc.status });
    }));

    router.post('/doc/:token/sign', express.json({ limit: '400kb' }), wrap(async (req, res) => {
        const { kind, doc } = await load(req.params.token);
        if (kind !== 'contract') throw new InputError('Only contracts can be signed.');
        if (!['sent', 'viewed'].includes(doc.status)) {
            throw new InputError(doc.status === 'signed' ? 'This contract is already signed.' : 'This contract can\'t be signed.', 409);
        }
        const name = str(req.body.name, 200);
        const signature = typeof req.body.signature === 'string' ? req.body.signature : '';
        if (!name || req.body.agree !== true) throw new InputError('Type your full name and tick the box to sign.');
        if (!SIGNATURE_RE.test(signature) || signature.length > MAX_SIGNATURE_LENGTH) {
            throw new InputError('Draw your signature in the box.');
        }
        // The customer's page sends back the fingerprint of the text it showed.
        if (req.body.bodyHash !== doc.bodyHash) {
            throw new InputError('This contract changed since you opened it. Reload the page and review it again.', 409);
        }
        doc.status = 'signed';
        doc.signature = {
            name,
            imageDataUrl: signature,
            signedAt: new Date(),
            ip: req.ip,
            forwardedFor: String(req.get('x-forwarded-for') || '').slice(0, 300),
            userAgent: String(req.get('user-agent') || '').slice(0, 300),
            bodyHash: doc.bodyHash,
        };
        doc.history.push({ event: `Signed online by ${name}` });
        await doc.save();
        await alertOwner(`Contract ${doc.number} signed`, [
            `${name} signed contract ${doc.number}.`,
            'The signed PDF is on the contract page in the dashboard.',
        ], `/admin/contracts/edit/?id=${doc._id}`);
        res.json({ ok: true, status: doc.status, signedAt: doc.signature.signedAt });
    }));

    router.post('/doc/:token/checkout', wrap(async (req, res) => {
        if (!stripe) throw new InputError('Online payment isn\'t available.', 404);
        const { kind, doc } = await load(req.params.token);
        if (kind !== 'invoice' || doc.status === 'void') throw new InputError('Only open invoices can be paid online.');
        const { balanceCents } = invoiceState(doc);
        if (balanceCents <= 0) throw new InputError('This invoice is already paid.', 409);
        const customer = await Customer.findById(doc.customerId);
        const back = `${siteUrl}/d/?t=${doc.publicToken}`;
        try {
            const session = await stripe.createCheckoutSession({
                invoiceNumber: doc.number,
                invoiceId: doc._id,
                amountCents: balanceCents,
                customerEmail: customer && customer.email,
                successUrl: `${back}&paid=1`,
                cancelUrl: back,
            });
            res.json({ url: session.url });
        } catch (err) {
            console.error('[STRIPE_CHECKOUT_FAILED]', err && err.message);
            throw new InputError('Online payment isn\'t working right now. Please call us.', 502);
        }
    }));

    return router;
};

// Stripe tells us when a Checkout payment completes. Records it once.
const createStripeWebhook = ({ stripe, sendEmail, emailFrom, ownerEmail, siteUrl }) => wrap(async (req, res) => {
    const event = stripe.verifyWebhook(req.body, req.get('stripe-signature'));
    if (!event) return res.status(400).json({ message: 'Bad signature' });
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
        const session = event.data && event.data.object;
        const invoiceId = session && session.metadata && session.metadata.invoiceId;
        if (session && session.payment_status === 'paid' && invoiceId && /^[a-f0-9]{24}$/.test(invoiceId)) {
            const invoice = await Invoice.findById(invoiceId);
            if (invoice && !invoice.payments.some((p) => p.stripeSessionId === session.id)) {
                invoice.payments.push({
                    amountCents: session.amount_total, method: 'stripe', receivedAt: new Date(), stripeSessionId: session.id, note: 'Paid online',
                });
                invoice.history.push({ event: `${formatMoney(session.amount_total)} paid online by card` });
                if (invoiceState(invoice).balanceCents === 0) invoice.paidAt = new Date();
                await invoice.save();
                try {
                    await sendEmail(buildOwnerAlert({
                        subject: `Invoice ${invoice.number} paid online`,
                        lines: [`${formatMoney(session.amount_total)} was paid by card on invoice ${invoice.number}.`],
                        link: `${siteUrl}/admin/invoices/edit/?id=${invoice._id}`,
                        to: ownerEmail,
                        from: emailFrom,
                    }));
                } catch (err) {
                    console.error('[OWNER_ALERT_FAILED]', err && err.message);
                }
            }
        }
    }
    res.json({ received: true });
});

module.exports = { createPublicRouter, createStripeWebhook, findByToken, TOKEN_RE };
