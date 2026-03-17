require('dotenv').config({ path: __dirname + '/.env', override: true, });

console.log('RESEND_API_KEY length:', (process.env.RESEND_API_KEY || '').length);

const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const QuoteRequest = require('./models/QuoteRequest');

const PORT = process.env.PORT || 3001;
console.log('Starting server with PORT =', PORT);

// Initialize Resend with API Key
const resendApiKey = process.env.RESEND_API_KEY;
console.log('Resend API Key loaded?', !!resendApiKey);

if (!resendApiKey) {
    console.error('RESEND_API_KEY is missing. Check server/.env');
}

const resend = new Resend(resendApiKey);
console.log('Resend API Key configured');

// Connect to MongoDB
connectDB();

const app = express();

// Trust the first proxy (Render's reverse proxy) so express-rate-limit reads the real client IP
app.set('trust proxy', 1);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Build CORS origins from environment variable + localhost for dev
const corsOrigins = ['http://localhost:5173'];
if (process.env.CORS_ORIGIN) {
    corsOrigins.push(...process.env.CORS_ORIGIN.split(',').map(o => o.trim()));
}
app.use(cors({
    origin: corsOrigins,
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
    const { name, email, phone, address, projectType, propertyType, timeline } = req.body;

    if (!name || !email || !phone || !address || !projectType || !propertyType || !timeline) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    next();
};

// ✅ Handle Quote Request Submission using Resend API
app.post('/send-quote', limiter, validateQuoteRequest, async (req, res) => {
    const { name, email, phone, address, projectType, propertyType, timeline, budgetRange, paintingArea, message, howDidYouHear } = req.body;

    try {
        // 1. Save to MongoDB
        console.log('Attempting to save to MongoDB...');
        const newQuoteRequest = new QuoteRequest({
            name,
            email,
            phone,
            address,
            projectType,
            propertyType,
            timeline,
            budgetRange,
            paintingArea,
            message,
            howDidYouHear
        });
        await newQuoteRequest.save();
        console.log('Quote request saved to database with ID:', newQuoteRequest._id);

        // 2. Send email using Resend API
        try {
            console.log('Preparing email with Resend API...');

            // Build conditional HTML rows
            const budgetRow = budgetRange ? `<tr><td style="padding: 8px 0;"><strong>Budget Range:</strong></td><td style="padding: 8px 0;">${budgetRange}</td></tr>` : '';
            const paintingAreaRow = paintingArea ? `<tr><td style="padding: 8px 0;"><strong>Painting Area:</strong></td><td style="padding: 8px 0;">${paintingArea}</td></tr>` : '';
            const howHeardRow = howDidYouHear ? `<tr><td style="padding: 8px 0;"><strong>How They Heard About Us:</strong></td><td style="padding: 8px 0;">${howDidYouHear}</td></tr>` : '';
            const messageSection = message ? `<h3 style="color: #1a1a1a;">Project Details &amp; Special Requirements:</h3><div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #E8B4B8; margin-bottom: 20px;">${message.replace(/\n/g, '<br>')}</div>` : '';

            const submittedDate = new Date().toLocaleString('en-US', {
                timeZone: 'America/New_York',
                dateStyle: 'full',
                timeStyle: 'short'
            });

            const emailHtml = `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Quote Request</title>
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0F172A 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                  <h1 style="color: #F7E7CE; margin: 0; text-align: center;">New Quote Request</h1>
                </div>

                <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none;">
                  <h2 style="color: #1a1a1a; border-bottom: 2px solid #E8B4B8; padding-bottom: 10px;">Contact Information</h2>
                  <table style="width: 100%; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 8px 0;"><strong>Name:</strong></td>
                      <td style="padding: 8px 0;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Email:</strong></td>
                      <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #1a1a1a;">${email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Phone:</strong></td>
                      <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #1a1a1a;">${phone}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Property Address:</strong></td>
                      <td style="padding: 8px 0;">${address}</td>
                    </tr>
                  </table>

                  <h2 style="color: #1a1a1a; border-bottom: 2px solid #E8B4B8; padding-bottom: 10px;">Project Details</h2>
                  <table style="width: 100%; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 8px 0;"><strong>Project Type:</strong></td>
                      <td style="padding: 8px 0;">${projectType}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Property Type:</strong></td>
                      <td style="padding: 8px 0;">${propertyType}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Timeline:</strong></td>
                      <td style="padding: 8px 0;">${timeline}</td>
                    </tr>
                    ${budgetRow}
                    ${paintingAreaRow}
                    ${howHeardRow}
                  </table>

                  ${messageSection}

                  <div style="margin-top: 30px; padding: 20px; background: #FEFCF8; border-radius: 5px; text-align: center;">
                    <p style="margin: 0 0 15px 0;"><strong>Submitted:</strong> ${submittedDate}</p>
                    <a href="tel:${phone}" style="display: inline-block; padding: 12px 30px; background: #1a1a1a; color: #F7E7CE; text-decoration: none; border-radius: 5px; margin: 5px;">Call Customer</a>
                    <a href="mailto:${email}" style="display: inline-block; padding: 12px 30px; background: #0F172A; color: #F7E7CE; text-decoration: none; border-radius: 5px; margin: 5px;">Email Customer</a>
                  </div>
                </div>

                <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                  <p>This is an automated notification from your website's quote request form.</p>
                  <p style="color: #999; font-size: 11px;">Database ID: ${newQuoteRequest._id}</p>
                </div>
              </body>
              </html>
            `;

            const emailText = `New Quote Request\n\nCONTACT INFORMATION\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nProperty Address: ${address}\n\nPROJECT DETAILS\nProject Type: ${projectType}\nProperty Type: ${propertyType}\nTimeline: ${timeline}\n${budgetRange ? 'Budget Range: ' + budgetRange + '\n' : ''}${paintingArea ? 'Painting Area: ' + paintingArea + '\n' : ''}${howDidYouHear ? 'How They Heard About Us: ' + howDidYouHear + '\n' : ''}${message ? '\nProject Details & Special Requirements:\n' + message + '\n' : ''}\nSubmitted: ${submittedDate}\nDatabase ID: ${newQuoteRequest._id}`;

            const emailData = {
                from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
                to: 'ledcustompainting@gmail.com',
                reply_to: email,
                subject: `Quote Request from ${name}`,
                html: emailHtml,
                text: emailText,
            };

            console.log('Sending email via Resend API...');
            const { data, error } = await resend.emails.send(emailData);

            if (error) {
                throw error;
            }

            console.log('Email sent successfully via Resend API. Email ID:', data.id);
        } catch (emailError) {
            console.error('Email sending failed via Resend API:', emailError);

            // More detailed error logging for Resend API errors
            if (emailError.message) {
                console.error('Resend API error details:', emailError.message);
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