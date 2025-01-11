require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['POST'],
    credentials: true
}));

// Input validation middleware
const validateQuoteRequest = (req, res, next) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Invalid email format'
        });
    }

    next();
};

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit each IP to 5 requests per windowMs
});

app.post('/send-quote', limiter, validateQuoteRequest, async (req, res) => {
    const { name, email, message } = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // HTML email template
    const htmlContent = `
        <h2>New Quote Request</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>This email was sent from your website's quote request form.</small></p>
    `;

    // Email options
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        replyTo: email,
        to: 'dereksutton86@gmail.com',
        subject: `Quote Request from ${name}`,
        text: `Quote Request from ${name}
        Email: ${email}
        Message: ${message}`,
        html: htmlContent
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        
        // Send auto-reply to customer
        const autoReplyOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for your quote request',
            html: `
                <h2>Thank you for your quote request, ${name}!</h2>
                <p>We have received your request and will get back to you within 24-48 hours.</p>
                <p>Here's a copy of your submission:</p>
                <hr>
                ${htmlContent}
                <p>Best regards,<br>LED Custom Painting & More</p>
            `
        };
        
        await transporter.sendMail(autoReplyOptions);

        res.status(200).json({
            success: true,
            message: 'Quote request sent successfully!'
        });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send the quote request. Please try again later.'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});