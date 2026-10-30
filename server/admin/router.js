// /api/admin: everything behind the owner's login.
const express = require('express');
const rateLimit = require('express-rate-limit');
const {
    AdminUser, AdminSession, QuoteRequest, Customer, Quote, Invoice, Contract, Settings,
} = require('./models');
const { LEAD_STATUSES } = require('../models/QuoteRequest');
const { normalizeSource } = require('../lib/leadSources');
const { hashPassword, verifyPassword, checkPasswordStrength, sha256 } = require('./crypto');
const { computeTotals, invoiceState, paidCents, formatMoney, DAY } = require('./money');
const { fillTemplate } = require('./defaults');
const { quotePdf, invoicePdf, contractPdf, formatDate } = require('./pdf');
const { buildDocumentEmail } = require('./emails');
const {
    InputError, str, num, date, id, parseItems, escapeRegex, nextNumber, newPublicToken, getSettings,
    serializeLead, serializeCustomer, serializeQuote, serializeInvoice, serializeContract, serializeSettings,
    startOfMonthEastern,
} = require('./docs');

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const pick = (obj, fields) => Object.fromEntries(fields.filter((f) => obj[f] !== undefined).map((f) => [f, obj[f]]));

const findOr404 = async (Model, rawId, label) => {
    const doc = await Model.findById(id(rawId, label));
    if (!doc) throw new InputError(`That ${label} doesn't exist.`, 404);
    return doc;
};

// '' clears the number; null means it isn't a phone number we can text.
const normalizePhone = (value) => {
    const raw = typeof value === 'string' ? value.trim() : '';
    if (!raw) return '';
    const digits = raw.replace(/\D/g, '');
    if (raw.startsWith('+') && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    return null;
};

const createAdminRouter = ({
    auth, sendEmail, emailFrom, emailReplyTo, siteUrl, loginRateLimitMax = 10,
}) => {
    const router = express.Router();

    const loginLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: loginRateLimitMax,
        validate: { xForwardedForHeader: false },
        handler: (req, res) => res.status(429).json({ message: 'Too many tries. Wait 15 minutes and try again.' }),
    });

    router.post('/login', loginLimiter, auth.login);
    router.post('/logout', auth.logout);

    router.use(auth.requireAuth);

    router.get('/me', (req, res) => res.json({ user: auth.publicUser(req.admin), smsAvailable: auth.smsAvailable }));

    // The phone that sign-in codes can be texted to. Changing how you sign
    // in asks for the password again.
    router.post('/account/phone', wrap(async (req, res) => {
        const current = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : '';
        if (!(await verifyPassword(current, req.admin.passwordHash))) {
            throw new InputError('Your current password is wrong.', 401);
        }
        const phone = normalizePhone(req.body.phone);
        if (phone === null) throw new InputError('Enter a US cell number like (904) 555-0123.');
        await AdminUser.updateOne({ _id: req.admin._id }, phone
            ? { phone }
            : { $unset: { phone: 1 }, codeChannel: 'email' });
        const user = await AdminUser.findById(req.admin._id);
        res.json({ user: auth.publicUser(user) });
    }));

    router.post('/account/password', wrap(async (req, res) => {
        const current = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : '';
        const next = typeof req.body.newPassword === 'string' ? req.body.newPassword : '';
        if (!(await verifyPassword(current, req.admin.passwordHash))) {
            throw new InputError('Your current password is wrong.', 401);
        }
        const weak = checkPasswordStrength(next);
        if (weak) throw new InputError(weak);
        await AdminUser.updateOne({ _id: req.admin._id }, { passwordHash: await hashPassword(next) });
        // Sign out every other device.
        await AdminSession.deleteMany({ userId: req.admin._id, _id: { $ne: req.adminSession._id } });
        res.json({ ok: true });
    }));

    // ----- Home -----
    router.get('/summary', wrap(async (req, res) => {
        const monthStart = startOfMonthEastern();
        const since = new Date(Date.now() - 90 * DAY);
        const [newLeads, leadsThisMonth, recentLeads, openQuotes, invoices, awaitingSignature, sourceLeads] = await Promise.all([
            QuoteRequest.countDocuments({ status: 'new' }),
            QuoteRequest.countDocuments({ createdAt: { $gte: monthStart } }),
            QuoteRequest.find().sort({ createdAt: -1 }).limit(5),
            Quote.find({ status: { $in: ['sent', 'viewed'] } }).sort({ sentAt: -1 }),
            Invoice.find({ status: { $ne: 'void' } }),
            Contract.find({ status: { $in: ['sent', 'viewed'] } }).sort({ sentAt: -1 }),
            QuoteRequest.find({ createdAt: { $gte: since } }, { howDidYouHear: 1, status: 1 }),
        ]);
        // Leads and wins by how they heard about LED, last 90 days.
        const bySource = {};
        for (const lead of sourceLeads) {
            const key = normalizeSource(lead.howDidYouHear) || 'Not recorded';
            const row = bySource[key] || (bySource[key] = { source: key, leads: 0, won: 0 });
            row.leads += 1;
            if (lead.status === 'won' || lead.status === 'completed') row.won += 1;
        }
        const sources = Object.values(bySource).sort((a, b) => b.leads - a.leads || b.won - a.won);
        const unpaid = invoices.map(serializeInvoice).filter((i) => i.status !== 'draft' && i.balanceCents > 0);
        const revenueThisMonthCents = invoices.reduce((sum, inv) => sum + (inv.payments || [])
            .filter((p) => p.receivedAt >= monthStart)
            .reduce((s, p) => s + p.amountCents, 0), 0);
        const customerIds = [...new Set([...openQuotes, ...unpaid, ...awaitingSignature].map((d) => String(d.customerId)))];
        const customers = await Customer.find({ _id: { $in: customerIds } }, { name: 1 });
        const names = Object.fromEntries(customers.map((c) => [String(c._id), c.name]));
        const brief = (d) => ({ ...d, customerName: names[String(d.customerId)] || '' });
        res.json({
            newLeads,
            leadsThisMonth,
            revenueThisMonthCents,
            openQuotes: {
                count: openQuotes.length,
                totalCents: openQuotes.reduce((s, q) => s + computeTotals(q).totalCents, 0),
                items: openQuotes.slice(0, 5).map((q) => brief(serializeQuote(q))),
            },
            unpaidInvoices: {
                count: unpaid.length,
                balanceCents: unpaid.reduce((s, i) => s + i.balanceCents, 0),
                overdueCount: unpaid.filter((i) => i.overdue).length,
                items: unpaid.sort((a, b) => Number(b.overdue) - Number(a.overdue)).slice(0, 5).map(brief),
            },
            awaitingSignature: {
                count: awaitingSignature.length,
                items: awaitingSignature.slice(0, 5).map((c) => brief(serializeContract(c))),
            },
            recentLeads: recentLeads.map(serializeLead),
            sources,
        });
    }));

    // ----- Leads -----
    const LEAD_FIELDS = ['name', 'email', 'phone', 'address', 'projectType', 'propertyType', 'timeline',
        'budgetRange', 'paintingArea', 'message', 'howDidYouHear', 'sourceDetail'];
    const parseLeadFields = (body) => {
        const out = {};
        for (const f of LEAD_FIELDS) {
            const v = str(body[f], f === 'message' ? 5000 : 300);
            if (v !== undefined) out[f] = v;
        }
        if (out.howDidYouHear) {
            out.howDidYouHear = normalizeSource(out.howDidYouHear);
            if (!out.howDidYouHear) throw new InputError('Pick how they heard about you from the list.');
        }
        return out;
    };
    const dashboardStatus = (status) => {
        const s = str(status, 20);
        if (s === undefined) return undefined;
        if (!['new', 'contacted', 'quoted', 'won', 'lost'].includes(s)) throw new InputError('Unknown status.');
        return s;
    };

    router.get('/leads', wrap(async (req, res) => {
        const filter = {};
        const status = typeof req.query.status === 'string' ? req.query.status : '';
        if (status === 'won') filter.status = { $in: ['won', 'completed'] };
        else if (status === 'lost') filter.status = { $in: ['lost', 'declined'] };
        else if (status === 'open') filter.status = { $in: ['new', 'contacted', 'quoted'] };
        else if (LEAD_STATUSES.includes(status)) filter.status = status;
        const source = typeof req.query.source === 'string' ? req.query.source : '';
        if (source === 'none') filter.howDidYouHear = { $in: [null, ''] };
        else if (source) filter.howDidYouHear = new RegExp(`^${escapeRegex(source)}$`, 'i');
        const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : '';
        if (q) {
            const re = new RegExp(escapeRegex(q), 'i');
            filter.$or = [{ name: re }, { email: re }, { phone: re }, { address: re }, { projectType: re }, { sourceDetail: re }];
        }
        const leads = await QuoteRequest.find(filter, { notes: 0 }).sort({ createdAt: -1 }).limit(500);
        res.json({ leads: leads.map(serializeLead) });
    }));

    router.post('/leads', wrap(async (req, res) => {
        const fields = parseLeadFields(req.body);
        if (!fields.name) throw new InputError('Add a name.');
        if (!fields.phone && !fields.email) throw new InputError('Add a phone number or email.');
        const lead = await QuoteRequest.create({ ...fields, source: 'manual', status: 'new' });
        res.status(201).json({ lead: serializeLead(lead) });
    }));

    router.get('/leads/:id', wrap(async (req, res) => {
        const lead = await findOr404(QuoteRequest, req.params.id, 'lead');
        const quotes = await Quote.find({ leadId: lead._id }).sort({ createdAt: -1 });
        res.json({ lead: serializeLead(lead), quotes: quotes.map(serializeQuote) });
    }));

    router.patch('/leads/:id', wrap(async (req, res) => {
        const lead = await findOr404(QuoteRequest, req.params.id, 'lead');
        Object.assign(lead, parseLeadFields(req.body));
        const status = dashboardStatus(req.body.status);
        if (status) lead.status = status;
        lead.updatedAt = new Date();
        await lead.save();
        res.json({ lead: serializeLead(lead) });
    }));

    router.delete('/leads/:id', wrap(async (req, res) => {
        const lead = await findOr404(QuoteRequest, req.params.id, 'lead');
        await QuoteRequest.deleteOne({ _id: lead._id });
        res.json({ ok: true });
    }));

    router.post('/leads/:id/notes', wrap(async (req, res) => {
        const lead = await findOr404(QuoteRequest, req.params.id, 'lead');
        const text = str(req.body.text, 5000);
        if (!text) throw new InputError('Write a note first.');
        lead.notes.push({ text, by: req.admin.name, at: new Date() });
        lead.updatedAt = new Date();
        await lead.save();
        res.status(201).json({ lead: serializeLead(lead) });
    }));

    router.delete('/leads/:id/notes/:noteId', wrap(async (req, res) => {
        const lead = await findOr404(QuoteRequest, req.params.id, 'lead');
        lead.notes = lead.notes.filter((n) => String(n._id) !== String(req.params.noteId));
        await lead.save();
        res.json({ lead: serializeLead(lead) });
    }));

    // Makes (or reuses, matched by email) a customer from the lead.
    const customerFromLead = async (lead) => {
        if (lead.customerId) {
            const existing = await Customer.findById(lead.customerId);
            if (existing) return existing;
        }
        let customer = lead.email ? await Customer.findOne({ email: lead.email }) : null;
        if (!customer) {
            customer = await Customer.create({
                name: lead.name, email: lead.email, phone: lead.phone, address: lead.address, leadId: lead._id,
            });
        }
        lead.customerId = customer._id;
        await lead.save();
        return customer;
    };

    router.post('/leads/:id/convert', wrap(async (req, res) => {
        const lead = await findOr404(QuoteRequest, req.params.id, 'lead');
        const customer = await customerFromLead(lead);
        let quote = null;
        if (req.body.createQuote) {
            quote = await createQuote({
                customerId: customer._id,
                leadId: lead._id,
                title: lead.projectType || 'Painting estimate',
                items: [{ description: lead.projectType || 'Painting', quantity: 1, unitPriceCents: 0 }],
            });
        }
        res.json({ customer: serializeCustomer(customer), quote: quote && serializeQuote(quote) });
    }));

    // ----- Customers -----
    const CUSTOMER_FIELDS = { name: 200, email: 200, phone: 50, address: 300, notes: 5000 };
    const parseCustomer = (body) => {
        const out = {};
        for (const [f, max] of Object.entries(CUSTOMER_FIELDS)) {
            const v = str(body[f], max);
            if (v !== undefined) out[f] = f === 'email' ? v.toLowerCase() : v;
        }
        if (out.email && !/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(out.email)) throw new InputError('That email doesn\'t look right.');
        return out;
    };

    router.get('/customers', wrap(async (req, res) => {
        const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : '';
        const filter = {};
        if (q) {
            const re = new RegExp(escapeRegex(q), 'i');
            filter.$or = [{ name: re }, { email: re }, { phone: re }, { address: re }];
        }
        const customers = await Customer.find(filter).sort({ name: 1 }).limit(1000);
        res.json({ customers: customers.map(serializeCustomer) });
    }));

    router.post('/customers', wrap(async (req, res) => {
        const fields = parseCustomer(req.body);
        if (!fields.name) throw new InputError('Add a name.');
        const customer = await Customer.create(fields);
        res.status(201).json({ customer: serializeCustomer(customer) });
    }));

    router.get('/customers/:id', wrap(async (req, res) => {
        const customer = await findOr404(Customer, req.params.id, 'customer');
        const [quotes, invoices, contracts, leads] = await Promise.all([
            Quote.find({ customerId: customer._id }).sort({ createdAt: -1 }),
            Invoice.find({ customerId: customer._id }).sort({ createdAt: -1 }),
            Contract.find({ customerId: customer._id }, { 'signature.imageDataUrl': 0 }).sort({ createdAt: -1 }),
            QuoteRequest.find({ customerId: customer._id }, { notes: 0 }).sort({ createdAt: -1 }),
        ]);
        res.json({
            customer: serializeCustomer(customer),
            quotes: quotes.map(serializeQuote),
            invoices: invoices.map(serializeInvoice),
            contracts: contracts.map(serializeContract),
            leads: leads.map(serializeLead),
        });
    }));

    router.patch('/customers/:id', wrap(async (req, res) => {
        const customer = await findOr404(Customer, req.params.id, 'customer');
        const fields = parseCustomer(req.body);
        if (fields.name === '') throw new InputError('Add a name.');
        Object.assign(customer, fields, { updatedAt: new Date() });
        await customer.save();
        res.json({ customer: serializeCustomer(customer) });
    }));

    router.delete('/customers/:id', wrap(async (req, res) => {
        const customer = await findOr404(Customer, req.params.id, 'customer');
        const used = await Promise.all([Quote, Invoice, Contract].map((M) => M.countDocuments({ customerId: customer._id })));
        if (used.some(Boolean)) throw new InputError('This customer has quotes, invoices or contracts, so it can\'t be deleted.', 409);
        await Customer.deleteOne({ _id: customer._id });
        await QuoteRequest.updateMany({ customerId: customer._id }, { $unset: { customerId: 1 } });
        res.json({ ok: true });
    }));

    // ----- Shared document actions -----
    const docLink = (doc) => `${siteUrl}/d/?t=${doc.publicToken}`;

    const loadCustomer = async (customerId) => {
        const customer = await Customer.findById(customerId);
        if (!customer) throw new InputError('That customer doesn\'t exist.', 404);
        return customer;
    };

    const KINDS = {
        quote: {
            Model: Quote, label: 'quote', serialize: serializeQuote, pdf: quotePdf,
            amount: (d) => computeTotals(d).totalCents,
        },
        invoice: {
            Model: Invoice, label: 'invoice', serialize: serializeInvoice, pdf: invoicePdf,
            amount: (d) => invoiceState(d).balanceCents,
        },
        contract: {
            Model: Contract, label: 'contract', serialize: serializeContract, pdf: contractPdf,
            amount: () => 0,
        },
    };

    const buildPdf = async (kind, doc) => {
        const [customer, settings] = await Promise.all([loadCustomer(doc.customerId), getSettings()]);
        return KINDS[kind].pdf({ [kind]: doc, customer, settings });
    };

    // Marks a draft as sent. A contract's text is frozen from here on.
    const markSent = (kind, doc, event) => {
        if (doc.status === 'void') throw new InputError('This one is void.', 409);
        if (kind === 'contract' && doc.status === 'signed') throw new InputError('This contract is already signed.', 409);
        if (doc.status === 'draft') doc.status = 'sent';
        if (!doc.sentAt) doc.sentAt = new Date();
        if (kind === 'contract' && !doc.bodyHash) doc.bodyHash = sha256(doc.body || '');
        doc.history.push({ event });
        doc.updatedAt = new Date();
    };

    const docRoutes = (kind) => {
        const { Model, label, serialize } = KINDS[kind];
        const path = `/${kind}s/:id`;

        router.post(`${path}/send`, wrap(async (req, res) => {
            const doc = await findOr404(Model, req.params.id, label);
            const customer = await loadCustomer(doc.customerId);
            if (!customer.email) throw new InputError('Add an email address to this customer first.');
            if (kind !== 'contract' && !(doc.items || []).length) throw new InputError('Add at least one line item first.');
            const message = str(req.body.message, 3000);
            markSent(kind, doc, `Emailed to ${customer.email}`);
            const settings = await getSettings();
            const pdf = await KINDS[kind].pdf({ [kind]: doc, customer, settings });
            try {
                await sendEmail(buildDocumentEmail({
                    kind,
                    number: doc.number,
                    customerName: customer.name,
                    amountCents: KINDS[kind].amount(doc),
                    link: docLink(doc),
                    message,
                    settings,
                    to: customer.email,
                    from: emailFrom,
                    replyTo: emailReplyTo,
                    pdf,
                }));
            } catch (err) {
                console.error(`[ADMIN_SEND_FAILED] ${doc.number}`, err && err.message);
                throw new InputError('The email couldn\'t be sent. Try again, or copy the link and text it instead.', 502);
            }
            await doc.save();
            res.json({ [kind]: serialize(doc), link: docLink(doc) });
        }));

        // For when the owner shares the link themselves (text, in person).
        router.post(`${path}/mark-sent`, wrap(async (req, res) => {
            const doc = await findOr404(Model, req.params.id, label);
            markSent(kind, doc, 'Link shared by hand');
            await doc.save();
            res.json({ [kind]: serialize(doc), link: docLink(doc) });
        }));

        router.get(`${path}/pdf`, wrap(async (req, res) => {
            const doc = await findOr404(Model, req.params.id, label);
            const pdf = await buildPdf(kind, doc);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${doc.number}.pdf"`);
            res.send(pdf);
        }));

        router.delete(path, wrap(async (req, res) => {
            const doc = await findOr404(Model, req.params.id, label);
            if (doc.status !== 'draft' || (doc.payments && doc.payments.length)) {
                throw new InputError('Only unsent drafts can be deleted. Void it instead.', 409);
            }
            await Model.deleteOne({ _id: doc._id });
            res.json({ ok: true });
        }));

        router.get(`/${kind}s`, wrap(async (req, res) => {
            const filter = {};
            if (typeof req.query.customerId === 'string' && req.query.customerId) filter.customerId = id(req.query.customerId, 'customer');
            const docs = await Model.find(filter, kind === 'contract' ? { body: 0, 'signature.imageDataUrl': 0 } : {})
                .sort({ createdAt: -1 }).limit(1000);
            const customers = await Customer.find({ _id: { $in: [...new Set(docs.map((d) => String(d.customerId)))] } }, { name: 1 });
            const names = Object.fromEntries(customers.map((c) => [String(c._id), c.name]));
            let list = docs.map((d) => ({ ...serialize(d), customerName: names[String(d.customerId)] || '' }));
            const status = typeof req.query.status === 'string' ? req.query.status : '';
            if (status) list = list.filter((d) => (d.displayStatus || d.status) === status);
            res.json({ [`${kind}s`]: list });
        }));
    };

    // ----- Quotes -----
    const quoteFields = (body) => ({
        title: str(body.title, 200),
        items: parseItems(body.items),
        taxRate: num(body.taxRate, { min: 0, max: 100, label: 'Tax rate' }),
        discountCents: num(body.discountCents, { min: 0, max: 1e10, label: 'Discount' }),
        depositPercent: num(body.depositPercent, { min: 0, max: 100, label: 'Deposit' }),
        notes: str(body.notes, 10000),
        terms: str(body.terms, 20000),
        validUntil: date(body.validUntil),
    });

    const createQuote = async (fields) => {
        const settings = await getSettings();
        return Quote.create({
            number: await nextNumber('quote'),
            publicToken: newPublicToken(),
            taxRate: settings.defaultTaxRate,
            depositPercent: settings.defaultDepositPercent,
            terms: settings.quoteTerms,
            validUntil: new Date(Date.now() + (settings.quoteValidDays || 30) * DAY),
            history: [{ event: 'Created' }],
            ...Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined)),
        });
    };

    docRoutes('quote');

    router.post('/quotes', wrap(async (req, res) => {
        const customer = await loadCustomer(id(req.body.customerId, 'customer'));
        const leadId = req.body.leadId ? id(req.body.leadId, 'lead') : undefined;
        const quote = await createQuote({ ...quoteFields(req.body), customerId: customer._id, leadId });
        res.status(201).json({ quote: serializeQuote(quote) });
    }));

    router.get('/quotes/:id', wrap(async (req, res) => {
        const quote = await findOr404(Quote, req.params.id, 'quote');
        const [customer, invoices, contracts] = await Promise.all([
            Customer.findById(quote.customerId),
            Invoice.find({ quoteId: quote._id }).sort({ createdAt: 1 }),
            Contract.find({ quoteId: quote._id }, { body: 0, 'signature.imageDataUrl': 0 }).sort({ createdAt: 1 }),
        ]);
        res.json({
            quote: serializeQuote(quote),
            customer: customer && serializeCustomer(customer),
            invoices: invoices.map(serializeInvoice),
            contracts: contracts.map(serializeContract),
            link: quote.status === 'draft' ? null : docLink(quote),
        });
    }));

    router.patch('/quotes/:id', wrap(async (req, res) => {
        const quote = await findOr404(Quote, req.params.id, 'quote');
        if (['accepted', 'declined'].includes(quote.status)) {
            throw new InputError('This quote was already answered. Make a copy to change it.', 409);
        }
        Object.assign(quote, Object.fromEntries(Object.entries(quoteFields(req.body)).filter(([, v]) => v !== undefined)));
        if (req.body.customerId) quote.customerId = (await loadCustomer(id(req.body.customerId, 'customer')))._id;
        quote.updatedAt = new Date();
        await quote.save();
        res.json({ quote: serializeQuote(quote) });
    }));

    // Owner can record a verbal yes or no, or pull a quote back to draft.
    router.post('/quotes/:id/status', wrap(async (req, res) => {
        const quote = await findOr404(Quote, req.params.id, 'quote');
        const status = str(req.body.status, 20);
        if (!['accepted', 'declined', 'draft'].includes(status)) throw new InputError('Unknown status.');
        quote.status = status;
        if (status === 'accepted') {
            quote.acceptedAt = new Date();
            quote.acceptedName = `${req.admin.name} (recorded by owner)`;
            quote.acceptedIp = undefined;
        }
        if (status === 'declined') quote.declinedAt = new Date();
        quote.history.push({ event: `Marked ${status} by ${req.admin.name}` });
        quote.updatedAt = new Date();
        await quote.save();
        if (status === 'accepted' && quote.leadId) {
            await QuoteRequest.updateOne({ _id: quote.leadId }, { status: 'won', updatedAt: new Date() });
        }
        res.json({ quote: serializeQuote(quote) });
    }));

    router.post('/quotes/:id/duplicate', wrap(async (req, res) => {
        const quote = await findOr404(Quote, req.params.id, 'quote');
        const copy = await createQuote(pick(quote.toObject(), ['customerId', 'leadId', 'title', 'items', 'taxRate', 'discountCents', 'depositPercent', 'notes', 'terms']));
        res.status(201).json({ quote: serializeQuote(copy) });
    }));

    // deposit: one line for the deposit. balance: the quote's lines less what
    // earlier invoices for this quote already billed. full: the quote's lines.
    router.post('/quotes/:id/invoice', wrap(async (req, res) => {
        const quote = await findOr404(Quote, req.params.id, 'quote');
        const kind = ['deposit', 'balance', 'full'].includes(req.body.kind) ? req.body.kind : 'full';
        const totals = computeTotals(quote);
        const settings = await getSettings();
        let items;
        let taxRate = quote.taxRate;
        let discountCents = quote.discountCents;
        let title = quote.title;
        if (kind === 'deposit') {
            if (!totals.depositCents) throw new InputError('This quote has no deposit set.');
            items = [{ description: `Deposit (${quote.depositPercent}%) for estimate ${quote.number}${quote.title ? `: ${quote.title}` : ''}`, quantity: 1, unitPriceCents: totals.depositCents }];
            taxRate = 0;
            discountCents = 0;
            title = `Deposit: ${quote.title || quote.number}`;
        } else {
            items = quote.items.map((i) => ({ description: i.description, quantity: i.quantity, unitPriceCents: i.unitPriceCents }));
            if (kind === 'balance') {
                const earlier = await Invoice.find({ quoteId: quote._id, status: { $ne: 'void' } });
                const billed = earlier.reduce((s, inv) => s + computeTotals(inv).totalCents, 0);
                if (billed > 0) {
                    // The credit line is taken before tax, so convert it back.
                    const preTax = Math.round(billed / (1 + (quote.taxRate || 0) / 100));
                    items.push({ description: `Less amount already invoiced (${earlier.map((i) => i.number).join(', ')})`, quantity: 1, unitPriceCents: -preTax });
                }
            }
        }
        const invoice = await Invoice.create({
            number: await nextNumber('invoice'),
            publicToken: newPublicToken(),
            customerId: quote.customerId,
            quoteId: quote._id,
            kind: kind === 'full' ? 'standard' : kind,
            title,
            items,
            taxRate,
            discountCents,
            terms: settings.invoiceTerms,
            dueDate: new Date(Date.now() + (settings.invoiceDueDays || 14) * DAY),
            history: [{ event: `Created from estimate ${quote.number}` }],
        });
        res.status(201).json({ invoice: serializeInvoice(invoice) });
    }));

    router.post('/quotes/:id/contract', wrap(async (req, res) => {
        const quote = await findOr404(Quote, req.params.id, 'quote');
        const [customer, settings] = await Promise.all([loadCustomer(quote.customerId), getSettings()]);
        const contract = await createContract({ customer, settings, quote });
        res.status(201).json({ contract: serializeContract(contract) });
    }));

    // ----- Invoices -----
    const invoiceFields = (body) => ({
        title: str(body.title, 200),
        items: parseItems(body.items),
        taxRate: num(body.taxRate, { min: 0, max: 100, label: 'Tax rate' }),
        discountCents: num(body.discountCents, { min: 0, max: 1e10, label: 'Discount' }),
        notes: str(body.notes, 10000),
        terms: str(body.terms, 20000),
        dueDate: date(body.dueDate),
    });

    docRoutes('invoice');

    router.post('/invoices', wrap(async (req, res) => {
        const customer = await loadCustomer(id(req.body.customerId, 'customer'));
        const settings = await getSettings();
        const fields = Object.fromEntries(Object.entries(invoiceFields(req.body)).filter(([, v]) => v !== undefined));
        const invoice = await Invoice.create({
            number: await nextNumber('invoice'),
            publicToken: newPublicToken(),
            customerId: customer._id,
            taxRate: settings.defaultTaxRate,
            terms: settings.invoiceTerms,
            dueDate: new Date(Date.now() + (settings.invoiceDueDays || 14) * DAY),
            history: [{ event: 'Created' }],
            ...fields,
        });
        res.status(201).json({ invoice: serializeInvoice(invoice) });
    }));

    router.get('/invoices/:id', wrap(async (req, res) => {
        const invoice = await findOr404(Invoice, req.params.id, 'invoice');
        const [customer, quote] = await Promise.all([
            Customer.findById(invoice.customerId),
            invoice.quoteId ? Quote.findById(invoice.quoteId, { number: 1, title: 1 }) : null,
        ]);
        res.json({
            invoice: serializeInvoice(invoice),
            customer: customer && serializeCustomer(customer),
            quote: quote && { id: String(quote._id), number: quote.number, title: quote.title },
            link: invoice.status === 'draft' ? null : docLink(invoice),
        });
    }));

    router.patch('/invoices/:id', wrap(async (req, res) => {
        const invoice = await findOr404(Invoice, req.params.id, 'invoice');
        if (invoice.status === 'void') throw new InputError('This invoice is void.', 409);
        Object.assign(invoice, Object.fromEntries(Object.entries(invoiceFields(req.body)).filter(([, v]) => v !== undefined)));
        invoice.updatedAt = new Date();
        await invoice.save();
        res.json({ invoice: serializeInvoice(invoice) });
    }));

    router.post('/invoices/:id/void', wrap(async (req, res) => {
        const invoice = await findOr404(Invoice, req.params.id, 'invoice');
        if (paidCents(invoice) > 0) throw new InputError('Remove the payments first, then void it.', 409);
        invoice.status = 'void';
        invoice.history.push({ event: `Voided by ${req.admin.name}` });
        await invoice.save();
        res.json({ invoice: serializeInvoice(invoice) });
    }));

    router.post('/invoices/:id/payments', wrap(async (req, res) => {
        const invoice = await findOr404(Invoice, req.params.id, 'invoice');
        if (invoice.status === 'void') throw new InputError('This invoice is void.', 409);
        const amountCents = Math.round(num(req.body.amountCents, { min: 1, max: 1e10, label: 'Amount' }) || 0);
        if (!amountCents) throw new InputError('Enter the amount received.');
        const method = ['cash', 'check', 'zelle', 'card', 'other'].includes(req.body.method) ? req.body.method : 'other';
        invoice.payments.push({ amountCents, method, receivedAt: date(req.body.receivedAt) || new Date(), note: str(req.body.note, 500) });
        invoice.history.push({ event: `${formatMoney(amountCents)} ${method} payment recorded by ${req.admin.name}` });
        if (invoice.status === 'draft') invoice.status = 'sent';
        if (invoiceState(invoice).balanceCents === 0) invoice.paidAt = new Date();
        await invoice.save();
        res.status(201).json({ invoice: serializeInvoice(invoice) });
    }));

    router.delete('/invoices/:id/payments/:paymentId', wrap(async (req, res) => {
        const invoice = await findOr404(Invoice, req.params.id, 'invoice');
        const before = invoice.payments.length;
        invoice.payments = invoice.payments.filter((p) => String(p._id) !== String(req.params.paymentId));
        if (invoice.payments.length === before) throw new InputError('That payment doesn\'t exist.', 404);
        invoice.history.push({ event: `Payment removed by ${req.admin.name}` });
        if (invoiceState(invoice).balanceCents > 0) invoice.paidAt = undefined;
        await invoice.save();
        res.json({ invoice: serializeInvoice(invoice) });
    }));

    // ----- Contracts -----
    const createContract = async ({ customer, settings, quote = null, title, body }) => {
        const totals = quote ? computeTotals(quote) : { totalCents: 0, depositCents: 0 };
        const scope = quote
            ? quote.items.map((i) => `- ${i.description}${i.quantity !== 1 ? ` (x${i.quantity})` : ''}`).join('\n')
            : '(describe the work)';
        const filled = body || fillTemplate(settings.contractTemplate, {
            date: formatDate(new Date()),
            businessName: settings.businessName,
            customerName: customer.name,
            customerAddress: customer.address || '(address)',
            quoteNumber: quote ? quote.number : '(none)',
            scope,
            total: formatMoney(totals.totalCents),
            deposit: formatMoney(totals.depositCents),
        });
        return Contract.create({
            number: await nextNumber('contract'),
            publicToken: newPublicToken(),
            customerId: customer._id,
            quoteId: quote ? quote._id : undefined,
            title: title || (quote ? `Contract for ${quote.title || quote.number}` : 'Painting services agreement'),
            body: filled,
            totalCents: totals.totalCents,
            depositCents: totals.depositCents,
            history: [{ event: quote ? `Created from estimate ${quote.number}` : 'Created' }],
        });
    };

    docRoutes('contract');

    router.post('/contracts', wrap(async (req, res) => {
        const customer = await loadCustomer(id(req.body.customerId, 'customer'));
        const settings = await getSettings();
        const quote = req.body.quoteId ? await findOr404(Quote, req.body.quoteId, 'quote') : null;
        const contract = await createContract({
            customer, settings, quote, title: str(req.body.title, 200), body: str(req.body.body, 60000),
        });
        res.status(201).json({ contract: serializeContract(contract) });
    }));

    router.get('/contracts/:id', wrap(async (req, res) => {
        const contract = await findOr404(Contract, req.params.id, 'contract');
        const [customer, quote] = await Promise.all([
            Customer.findById(contract.customerId),
            contract.quoteId ? Quote.findById(contract.quoteId, { number: 1, title: 1 }) : null,
        ]);
        res.json({
            contract: serializeContract(contract),
            customer: customer && serializeCustomer(customer),
            quote: quote && { id: String(quote._id), number: quote.number, title: quote.title },
            link: contract.status === 'draft' ? null : docLink(contract),
        });
    }));

    router.patch('/contracts/:id', wrap(async (req, res) => {
        const contract = await findOr404(Contract, req.params.id, 'contract');
        if (contract.status !== 'draft') {
            throw new InputError('A sent contract can\'t be changed. Void it and make a new one.', 409);
        }
        const title = str(req.body.title, 200);
        const body = str(req.body.body, 60000);
        if (title !== undefined) contract.title = title;
        if (body !== undefined) contract.body = body;
        contract.updatedAt = new Date();
        await contract.save();
        res.json({ contract: serializeContract(contract) });
    }));

    router.post('/contracts/:id/void', wrap(async (req, res) => {
        const contract = await findOr404(Contract, req.params.id, 'contract');
        if (contract.status === 'signed') throw new InputError('A signed contract can\'t be voided here.', 409);
        contract.status = 'void';
        contract.history.push({ event: `Voided by ${req.admin.name}` });
        await contract.save();
        res.json({ contract: serializeContract(contract) });
    }));

    router.post('/contracts/:id/duplicate', wrap(async (req, res) => {
        const contract = await findOr404(Contract, req.params.id, 'contract');
        const [customer, settings] = await Promise.all([loadCustomer(contract.customerId), getSettings()]);
        const quote = contract.quoteId ? await Quote.findById(contract.quoteId) : null;
        const copy = await createContract({ customer, settings, quote, title: contract.title, body: contract.body });
        res.status(201).json({ contract: serializeContract(copy) });
    }));

    // ----- Settings -----
    router.get('/settings', wrap(async (req, res) => {
        res.json({ settings: serializeSettings(await getSettings()), stripeEnabled: Boolean(req.app.locals.stripeEnabled) });
    }));

    router.put('/settings', wrap(async (req, res) => {
        await getSettings();
        const b = req.body;
        const update = {
            businessName: str(b.businessName, 200),
            phone: str(b.phone, 50),
            email: str(b.email, 200),
            address: str(b.address, 300),
            license: str(b.license, 100),
            defaultTaxRate: num(b.defaultTaxRate, { min: 0, max: 100, label: 'Tax rate' }),
            defaultDepositPercent: num(b.defaultDepositPercent, { min: 0, max: 100, label: 'Deposit' }),
            quoteValidDays: num(b.quoteValidDays, { min: 1, max: 365, label: 'Days' }),
            invoiceDueDays: num(b.invoiceDueDays, { min: 0, max: 365, label: 'Days' }),
            quoteTerms: str(b.quoteTerms, 20000),
            invoiceTerms: str(b.invoiceTerms, 20000),
            paymentInstructions: str(b.paymentInstructions, 5000),
            contractTemplate: str(b.contractTemplate, 60000),
        };
        const clean = Object.fromEntries(Object.entries(update).filter(([, v]) => v !== undefined));
        if (clean.businessName === '') throw new InputError('Add the business name.');
        const settings = await Settings.findByIdAndUpdate('business', { ...clean, updatedAt: new Date() }, { new: true });
        res.json({ settings: serializeSettings(settings) });
    }));

    return router;
};

module.exports = { createAdminRouter, normalizePhone };
