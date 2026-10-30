// Shared helpers for the dashboard routes: input checks, numbering,
// settings and the shapes sent to the browser.
const mongoose = require('mongoose');
const { Settings, Counter } = require('./models');
const { computeTotals, invoiceState } = require('./money');
const defaults = require('./defaults');
const { randomToken } = require('./crypto');
const { describeAttribution } = require('../lib/leadEmail');

class InputError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.name = 'InputError';
        this.status = status;
    }
}

const str = (value, max = 300) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== 'string') throw new InputError('Invalid text value.');
    const trimmed = value.trim();
    if (trimmed.length > max) throw new InputError(`Text is too long (max ${max} characters).`);
    return trimmed;
};

const num = (value, { min = -Infinity, max = Infinity, label = 'Number' } = {}) => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    if (!Number.isFinite(n) || n < min || n > max) throw new InputError(`${label} is out of range.`);
    return n;
};

const date = (value) => {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) throw new InputError('Invalid date.');
    return d;
};

const id = (value, label = 'record') => {
    if (!mongoose.isValidObjectId(value) || String(value).length !== 24) throw new InputError(`Unknown ${label}.`, 404);
    return String(value);
};

const parseItems = (items) => {
    if (items === undefined) return undefined;
    if (!Array.isArray(items) || items.length > 100) throw new InputError('Line items are invalid.');
    return items.map((item) => {
        const description = str(item && item.description, 2000);
        if (!description) throw new InputError('Every line item needs a description.');
        return {
            description,
            quantity: num(item.quantity, { min: 0, max: 1e6, label: 'Quantity' }) ?? 1,
            unitPriceCents: Math.round(num(item.unitPriceCents, { min: -1e10, max: 1e10, label: 'Price' }) ?? 0),
        };
    });
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const PREFIX = { quote: 'Q', invoice: 'INV', contract: 'C' };
const nextNumber = async (kind) => {
    const counter = await Counter.findOneAndUpdate(
        { _id: kind },
        { $inc: { seq: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    return `${PREFIX[kind]}-${1000 + counter.seq}`;
};

const newPublicToken = () => randomToken(24);

const getSettings = async () => {
    let settings = await Settings.findById('business');
    if (!settings) {
        settings = await Settings.findOneAndUpdate(
            { _id: 'business' },
            {
                $setOnInsert: {
                    quoteTerms: defaults.quoteTerms,
                    invoiceTerms: defaults.invoiceTerms,
                    paymentInstructions: defaults.paymentInstructions,
                    contractTemplate: defaults.contractTemplate,
                },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
        );
    }
    return settings;
};

const plain = (doc) => (doc && typeof doc.toObject === 'function' ? doc.toObject() : doc);

const base = (doc) => {
    const o = plain(doc);
    const { _id, __v, ...rest } = o;
    return { id: String(_id), ...rest };
};

const serializeLead = (lead) => {
    const o = base(lead);
    o.notes = (o.notes || []).map(({ _id, ...n }) => ({ id: String(_id), ...n }));
    // Show older status names the way the dashboard names them.
    if (o.status === 'completed') o.status = 'won';
    if (o.status === 'declined') o.status = 'lost';
    o.trackedSource = describeAttribution(lead.attribution);
    return o;
};

const serializeCustomer = (c) => base(c);

const serializeQuote = (q) => ({ ...base(q), ...computeTotals(q) });

const serializeInvoice = (inv) => {
    const o = base(inv);
    o.payments = (o.payments || []).map(({ _id, ...p }) => ({ id: String(_id), ...p }));
    const totals = computeTotals(inv);
    const state = invoiceState(inv);
    return { ...o, ...totals, paidCents: state.paidCents, balanceCents: state.balanceCents, displayStatus: state.status, overdue: state.overdue };
};

const serializeContract = (c) => base(c);

const serializeSettings = (s) => {
    const { _id, __v, ...rest } = plain(s);
    return rest;
};

// Midnight on the 1st of this month in Florida time.
const startOfMonthEastern = (now = new Date()) => {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York', year: 'numeric', month: '2-digit',
    }).formatToParts(now).map((p) => [p.type, p.value]));
    // Try both possible offsets (EST/EDT) and keep the one that lands on the 1st at 00:00 there.
    for (const offset of ['-05:00', '-04:00']) {
        const candidate = new Date(`${parts.year}-${parts.month}-01T00:00:00${offset}`);
        const check = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York', day: '2-digit', hour: '2-digit', hourCycle: 'h23',
        }).formatToParts(candidate).reduce((a, p) => ({ ...a, [p.type]: p.value }), {});
        if (check.day === '01' && check.hour === '00') return candidate;
    }
    return new Date(`${parts.year}-${parts.month}-01T05:00:00Z`);
};

module.exports = {
    InputError, str, num, date, id, parseItems, escapeRegex, nextNumber, newPublicToken, getSettings,
    serializeLead, serializeCustomer, serializeQuote, serializeInvoice, serializeContract, serializeSettings,
    startOfMonthEastern,
};
