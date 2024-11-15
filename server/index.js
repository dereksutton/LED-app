const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/send-quote', async (req, res) => {
    const { name, email, message } = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email options
    const mailOptions = {
        from: email,
        to: 'dereksutton86@gmail.com',
        subject: `Quote Request from ${name}`,
        text: `You have a new quote request from:
        
        Name: ${name}
        Email: ${email}
        Message: ${message}`,
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Quote request sent successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to send the quote request. Please try again later.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});