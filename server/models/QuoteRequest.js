// models/QuoteRequest.js
// A lead from the website form (or one the owner adds by hand in /admin).
const mongoose = require('mongoose');

// 'completed' and 'declined' are older names for 'won' and 'lost'; leads
// saved before the dashboard may still carry them.
const LEAD_STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost', 'completed', 'declined'];

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
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }
});

quoteRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);
module.exports.LEAD_STATUSES = LEAD_STATUSES;
