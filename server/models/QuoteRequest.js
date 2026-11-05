// models/QuoteRequest.js
// A lead from the website form (or one the owner adds by hand in /admin).
const mongoose = require('mongoose');

// 'completed' and 'declined' are older names for 'won' and 'lost'; leads
// saved before the dashboard may still carry them.
const LEAD_STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost', 'completed', 'declined'];

// One line per change to a lead's source, status or job amount, so every
// credited job can be traced back.
const historySchema = new mongoose.Schema({
  at: { type: Date, default: Date.now },
  by: { type: String, trim: true },
  field: { type: String, trim: true },
  from: { type: String, trim: true },
  to: { type: String, trim: true }
}, { _id: false });

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true, maxlength: 5000 },
  by: { type: String, trim: true },
  at: { type: Date, default: Date.now }
}, { _id: true });

const quoteRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  // Full address for display; the form also keeps its parts.
  address: {
    type: String,
    trim: true
  },
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  zip: { type: String, trim: true },
  projectType: {
    type: String,
    trim: true
  },
  propertyType: {
    type: String,
    trim: true
  },
  timeline: {
    type: String,
    trim: true
  },
  budgetRange: {
    type: String,
    trim: true
  },
  paintingArea: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  howDidYouHear: {
    type: String,
    trim: true
  },
  // Who referred them, or where "Other" was.
  sourceDetail: { type: String, trim: true },
  // What the site picked up on its own: ad click, UTM tags, referring site.
  attribution: {
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    utmTerm: String,
    utmContent: String,
    clickId: String,
    referrer: String,
    landingPage: String,
    firstSeenAt: Date
  },
  source: {
    type: String,
    enum: ['website', 'manual'],
    default: 'website'
  },
  // How the lead reached LED (see lib/leadSources.js).
  channel: { type: String, enum: ['form', 'callback', 'call', 'text', 'manual'] },
  // Organic Google credit, worked out when the lead is made: 'search', 'gbp'
  // or 'none', and why. organicManual: set by hand, so edits to
  // howDidYouHear no longer change it.
  organic: { type: String, enum: ['search', 'gbp', 'none'] },
  organicReason: { type: String, trim: true },
  organicManual: { type: Boolean },
  // The site's ref code from a prefilled text or a tapped call button.
  refCode: { type: String, trim: true },
  // core / nearby / edge / out, from the ZIP (lib/serviceArea.js).
  serviceZone: { type: String, enum: ['core', 'nearby', 'edge', 'out'] },
  // Best time to call back, from the callback form.
  bestTime: { type: String, trim: true },
  // The job: what it was won for and when.
  jobAmountCents: { type: Number, min: 0 },
  wonAt: Date,
  history: [historySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  status: {
    type: String,
    enum: LEAD_STATUSES,
    default: 'new'
  },
  notes: [noteSchema],
  // Sales pitches and other junk. Kept, never deleted, but left out of the
  // leads list, Home and source numbers. by is 'auto' or the owner's name.
  isSpam: { type: Boolean, default: false },
  spam: {
    markedAt: Date,
    by: String,
    reason: String
  },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }
});

quoteRequestSchema.index({ createdAt: -1 });
quoteRequestSchema.index({ isSpam: 1, createdAt: -1 });
quoteRequestSchema.index({ wonAt: 1 });

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);
module.exports.LEAD_STATUSES = LEAD_STATUSES;
