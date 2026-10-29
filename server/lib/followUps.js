// Optional follow-ups after a lead comes in. Both are off unless their
// settings are present, so nothing changes until the owner sets them up.

// The confirmation goes to whatever address the visitor typed, so it carries
// none of their input: a bot can't use it to send its own text to strangers.
const buildCustomerReply = ({ to, from, replyTo, phone }) => ({
    from,
    to,
    reply_to: replyTo,
    subject: 'We got your quote request',
    text: `Thanks for reaching out to LED Custom Painting & More.\n\nWe received your quote request and will be in touch within one business day. If it's urgent, call or text us at ${phone}.\n\nLED Custom Painting & More`,
    html: `<p>Thanks for reaching out to LED Custom Painting &amp; More.</p><p>We received your quote request and will be in touch within one business day. If it's urgent, call or text us at <a href="tel:${phone.replace(/[^\d+]/g, '')}">${phone}</a>.</p><p>LED Custom Painting &amp; More</p>`,
});

const buildOwnerSms = (lead) => {
    const parts = [lead.name, lead.phone, lead.projectType, lead.address].filter(Boolean);
    return `New quote request: ${parts.join(' | ')}`.replace(/[\r\n]+/g, ' ').slice(0, 300);
};

// Sends one SMS through Twilio's REST API. Returns null when not configured.
const createTwilioSms = ({ accountSid, authToken, from, to, fetchImpl = fetch }) => {
    if (!accountSid || !authToken || !from || !to) return null;
    const url = `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    return async (body) => {
        const res = await fetchImpl(url, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ From: from, To: to, Body: body }).toString(),
        });
        if (!res.ok) throw new Error(`Twilio responded ${res.status}`);
        return res.json();
    };
};

module.exports = { buildCustomerReply, buildOwnerSms, createTwilioSms };
