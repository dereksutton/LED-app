// Data for the /admin dashboard. Money is stored in whole cents.
const mongoose = require('mongoose');
const QuoteRequest = require('../models/QuoteRequest');

const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const adminUserSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true },               // E.164, e.g. +19045550123, for texted codes
    codeChannel: { type: String, enum: ['email', 'sms'], default: 'email' },
    // The one sign-in code waiting to be typed, stored only as a hash.
    loginCode: {
        hash: String,
        channel: String,
        expiresAt: Date,
        attempts: { type: Number, default: 0 },
    },
    codeSentAt: [Date],                                 // recent sends, for the resend limit
    failedAttempts: { type: Number, default: 0 },
    lockedUntil: Date,
    lastLoginAt: Date,
    createdAt: { type: Date, default: Date.now },
});

const adminSessionSchema = new Schema({
    tokenHash: { type: String, required: true, unique: true },
    userId: { type: ObjectId, ref: 'AdminUser', required: true },
    createdAt: { type: Date, default: Date.now },
    lastSeenAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    ip: String,
    userAgent: String,
});
// Mongo deletes sessions once they expire.
adminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const customerSchema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 50 },
    address: { type: String, trim: true, maxlength: 300 },
    notes: { type: String, trim: true, maxlength: 5000 },
    leadId: { type: ObjectId, ref: 'QuoteRequest' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
});
customerSchema.index({ email: 1 });

const itemSchema = new Schema({
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    quantity: { type: Number, required: true, min: 0, max: 1e6 },
    unitPriceCents: { type: Number, required: true, min: -1e10, max: 1e10 },
}, { _id: false });

// Fields every quote, invoice and contract shares: the customer link page
// (publicToken) and when it was sent and opened.
const sharedDocFields = {
    number: { type: String, required: true, unique: true },
    customerId: { type: ObjectId, ref: 'Customer', required: true },
    publicToken: { type: String, required: true, unique: true },
    sentAt: Date,
    viewedAt: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    history: [{ _id: false, at: { type: Date, default: Date.now }, event: String }],
};

const quoteSchema = new Schema({
    ...sharedDocFields,
    leadId: { type: ObjectId, ref: 'QuoteRequest' },
    title: { type: String, trim: true, maxlength: 200 },
    items: [itemSchema],
    taxRate: { type: Number, default: 0, min: 0, max: 100 },
    discountCents: { type: Number, default: 0, min: 0 },
    depositPercent: { type: Number, default: 0, min: 0, max: 100 },
    notes: { type: String, maxlength: 10000 },
    terms: { type: String, maxlength: 20000 },
    validUntil: Date,
    status: { type: String, enum: ['draft', 'sent', 'viewed', 'accepted', 'declined'], default: 'draft' },
    acceptedAt: Date,
    acceptedName: String,
    acceptedIp: String,
    declinedAt: Date,
});

const paymentSchema = new Schema({
    amountCents: { type: Number, required: true, min: 1 },
    method: { type: String, enum: ['cash', 'check', 'zelle', 'card', 'stripe', 'other'], default: 'other' },
    receivedAt: { type: Date, default: Date.now },
    note: { type: String, trim: true, maxlength: 500 },
    stripeSessionId: String,
}, { _id: true });

const invoiceSchema = new Schema({
    ...sharedDocFields,
    quoteId: { type: ObjectId, ref: 'Quote' },
    kind: { type: String, enum: ['standard', 'deposit', 'balance'], default: 'standard' },
    title: { type: String, trim: true, maxlength: 200 },
    items: [itemSchema],
    taxRate: { type: Number, default: 0, min: 0, max: 100 },
    discountCents: { type: Number, default: 0, min: 0 },
    notes: { type: String, maxlength: 10000 },
    terms: { type: String, maxlength: 20000 },
    dueDate: Date,
    status: { type: String, enum: ['draft', 'sent', 'viewed', 'void'], default: 'draft' },
    payments: [paymentSchema],
    paidAt: Date,
});

const contractSchema = new Schema({
    ...sharedDocFields,
    quoteId: { type: ObjectId, ref: 'Quote' },
    title: { type: String, trim: true, maxlength: 200 },
    body: { type: String, maxlength: 60000 },
    totalCents: { type: Number, default: 0 },
    depositCents: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'sent', 'viewed', 'signed', 'void'], default: 'draft' },
    // SHA-256 of the body when it was sent, so the signed copy can be shown
    // to match what the customer saw.
    bodyHash: String,
    signature: {
        name: String,
        imageDataUrl: String,
        signedAt: Date,
        ip: String,
        forwardedFor: String,
        userAgent: String,
        bodyHash: String,
    },
});

const settingsSchema = new Schema({
    _id: { type: String, default: 'business' },
    businessName: { type: String, default: 'LED Custom Painting & More' },
    phone: { type: String, default: '(904) 385-0426' },
    email: { type: String, default: 'ledcustompainting@gmail.com' },
    address: { type: String, default: 'Jacksonville, FL' },
    license: { type: String, default: '' },
    defaultTaxRate: { type: Number, default: 0 },
    defaultDepositPercent: { type: Number, default: 30 },
    quoteValidDays: { type: Number, default: 30 },
    invoiceDueDays: { type: Number, default: 14 },
    quoteTerms: String,
    invoiceTerms: String,
    paymentInstructions: String,
    contractTemplate: String,
    updatedAt: Date,
});

const counterSchema = new Schema({ _id: String, seq: { type: Number, default: 0 } });

const model = (name, schema) => mongoose.models[name] || mongoose.model(name, schema);

module.exports = {
    QuoteRequest,
    AdminUser: model('AdminUser', adminUserSchema),
    AdminSession: model('AdminSession', adminSessionSchema),
    Customer: model('Customer', customerSchema),
    Quote: model('Quote', quoteSchema),
    Invoice: model('Invoice', invoiceSchema),
    Contract: model('Contract', contractSchema),
    Settings: model('Settings', settingsSchema),
    Counter: model('Counter', counterSchema),
};
