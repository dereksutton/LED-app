require('dotenv').config();
const express = require('express');
const sgMail = require('@sendgrid/mail'); // Changed to SendGrid's mail package
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const QuoteRequest = require('./models/QuoteRequest');

console.log('Starting server with process.env.PORT =', process.env.PORT);
process.env.PORT = '3001';

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log('SendGrid API Key configured');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = 3001;

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:5173', 'http://147.182.175.175', 'https://147.182.175.175'],
    methods: ['POST', 'GET'],
    credentials: true
}));

// ✅ Rate limiting to prevent spam
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
});

// ✅ Input validation middleware
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

// ✅ Handle Quote Request Submission using SendGrid API
app.post('/send-quote', limiter, validateQuoteRequest, async (req, res) => {
    const { name, email, phone, message } = req.body;

    try {
        // 1. Save to MongoDB
        console.log('Attempting to save to MongoDB...');
        const newQuoteRequest = new QuoteRequest({
            name,
            email,
            phone,
            message
        });
        await newQuoteRequest.save();
        console.log('Quote request saved to database with ID:', newQuoteRequest._id);

        // 2. Send email using SendGrid API
        try {
            console.log('Preparing email with SendGrid API...');
            const msg = {
                to: 'ledcustompainting@gmail.com',
                from: {
                    email: process.env.EMAIL_USER,
                    name: 'LED Quote Request'
                },
                replyTo: email, // Use the customer's email as reply-to
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

            console.log('Sending email via SendGrid API...');
            await sgMail.send(msg);
            console.log('Email sent successfully via SendGrid API.');
        } catch (emailError) {
            console.error('Email sending failed via SendGrid API:', emailError);
            
            // More detailed error logging for SendGrid API errors
            if (emailError.response) {
                console.error('SendGrid API error details:');
                console.error(emailError.response.body);
            }
            
            // You may want to update this to return an error to the client
            // return res.status(500).json({
            //     success: false,
            //     message: 'Email sending failed, but your request was saved.',
            //     error: emailError.message
            // });
        }

        // 3. Respond to the client
        res.status(200).json({
            success: true,
            message: 'Quote request saved!',
            quoteId: newQuoteRequest._id
        });

    } catch (error) {
        console.error('Error detail:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Failed to process your request.',
            error: error.message
        });
    }
});

// ✅ Get all quote requests (protected route - requires authentication in production)
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
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on Port ${PORT} and accepting connections from all interfaces`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Try a different port.`);
    } else {
        console.error('Unexpected server error:', err);
    }
});