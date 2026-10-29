require('dotenv').config({ path: __dirname + '/.env', override: true });

const mongoose = require('mongoose');
const { Resend } = require('resend');
const connectDB = require('./config/db');
const QuoteRequest = require('./models/QuoteRequest');
const { createApp } = require('./app');

const PORT = process.env.PORT || 3001;

if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing. Lead notification emails will fail.');
}
const resend = new Resend(process.env.RESEND_API_KEY || 'missing');

// Send through Resend, retrying once on a transient failure.
const sendEmail = async (message) => {
    let lastError;
    for (let attempt = 1; attempt <= 2; attempt++) {
        const { data, error } = await resend.emails.send(message);
        if (!error) {
            console.log('Lead email sent:', data.id);
            return data;
        }
        lastError = new Error(error.message || 'Resend error');
        console.error(`Lead email attempt ${attempt} failed:`, lastError.message);
    }
    throw lastError;
};

// Fail fast when the database is down instead of waiting on Mongoose's buffer.
const saveLead = async (lead) => {
    if (mongoose.connection.readyState !== 1) {
        throw new Error('Database not connected');
    }
    const doc = await QuoteRequest.create(lead);
    return doc._id;
};

const corsOrigins = process.env.NODE_ENV === 'production' ? [] : ['http://localhost:3000'];
if (process.env.CORS_ORIGIN) {
    corsOrigins.push(...process.env.CORS_ORIGIN.split(',').map((o) => o.trim()));
}

const app = createApp({
    sendEmail,
    saveLead,
    notifyTo: process.env.LEAD_NOTIFY_EMAIL || 'ledcustompainting@gmail.com',
    notifyFrom: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    corsOrigins,
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

// Connect in the background so the form keeps emailing leads even while the
// database is unavailable.
connectDB().catch(() => {
    console.error('MongoDB unavailable after all retries. Leads will be emailed but not stored.');
});
