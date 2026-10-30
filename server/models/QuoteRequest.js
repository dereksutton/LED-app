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
  address: {
    type: String,
    trim: true
  },
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
