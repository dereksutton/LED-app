// models/QuoteRequest.js
const mongoose = require('mongoose');

const quoteRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  projectType: {
    type: String,
    required: true,
    trim: true
  },
  propertyType: {
    type: String,
    required: true,
    trim: true
  },
  timeline: {
    type: String,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'quoted', 'completed', 'declined'],
    default: 'new'
  }
});

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);