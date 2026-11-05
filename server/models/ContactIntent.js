// models/ContactIntent.js
// A tap on the site's Call or Text button. Holds no personal details: only
// the kind of tap, the visitor's ref code and how that visit was credited,
// so the owner can tie a call or text he gets to the visit it came from.
const mongoose = require('mongoose');

const contactIntentSchema = new mongoose.Schema({
    kind: { type: String, enum: ['call', 'text'], required: true },
    refCode: { type: String, trim: true, maxlength: 8 },
    page: { type: String, trim: true, maxlength: 300 },
    attribution: {
        utmSource: String,
        utmMedium: String,
        utmCampaign: String,
        utmTerm: String,
        utmContent: String,
        clickId: String,
        referrer: String,
        landingPage: String,
        firstSeenAt: Date,
    },
    organic: { type: String, enum: ['search', 'gbp', 'none'], default: 'none' },
    organicReason: { type: String, trim: true, maxlength: 200 },
    // The lead the owner tied this tap to.
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuoteRequest' },
    createdAt: { type: Date, default: Date.now },
});

contactIntentSchema.index({ refCode: 1, createdAt: -1 });
// Kept a year, long enough for a slow caller and the yearly commission window.
contactIntentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 366 * 24 * 60 * 60, name: 'expire_after_a_year' });

module.exports = mongoose.models.ContactIntent || mongoose.model('ContactIntent', contactIntentSchema);
