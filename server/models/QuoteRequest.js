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
  message: {
    type: String,
    required: true,
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