require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { google } = require('googleapis');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const QuoteRequest = require('./models/QuoteRequest');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['POST', 'GET'], // Added GET for potential future admin dashboard
    credentials: true
}));

// ✅ Google OAuth 2.0 Setup
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);
oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

// ✅ Rate limiting to prevent spam
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
});

// ✅ Input validation
const validateQuoteRequest = (req, res, next) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    next();
};

// ✅ Handle Quote Request Submission
app.post('/send-quote', limiter, validateQuoteRequest, async (req, res) => {
    const { name, email, phone, message } = req.body;

    try {
        // 1. Save to MongoDB
        const newQuoteRequest = new QuoteRequest({
            name,
            email,
            phone,
            message
        });
        
        await newQuoteRequest.save();
        console.log('Quote request saved to database with ID:', newQuoteRequest._id);
        
        // 2. Send Email
        const accessToken = await oauth2Client.getAccessToken();
        console.log('Access token obtained');

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
                expires: 3599
            }
        });

        const mailOptions = {
            from: `"LED Quote Request" <${process.env.EMAIL_USER}>`,
            replyTo: email,
            to: 'ledcustompainting@gmail.com',
            subject: `Quote Request from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nDatabase ID: ${newQuoteRequest._id}\n\nMessage:\n${message}`,
            html: `
                <h2>New Quote Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Database ID:</strong> ${newQuoteRequest._id}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><small>This email was sent from your website's quote request form.</small></p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        
        res.status(200).json({ 
            success: true, 
            message: 'Quote request sent!',
            quoteId: newQuoteRequest._id
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Failed to process your request.' });
    }
});

// ✅ Get all quote requests (protected route - would need auth in production)
app.get('/quote-requests', async (req, res) => {
    try {
        const quoteRequests = await QuoteRequest.find().sort({ createdAt: -1 });
        res.json(quoteRequests);
    } catch (error) {
        console.error('Error fetching quote requests:', error);
        res.status(500).json({ error: 'Failed to fetch quote requests' });
    }
});

// ✅ Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});

// ✅ Start Server
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));