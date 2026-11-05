// Optional follow-ups after a lead comes in. Both are off unless their
// settings are present, so nothing changes until the owner sets them up.

// The confirmation goes to whatever address the visitor typed, so it carries
// none of their input: a bot can't use it to send its own text to strangers.
const buildCustomerReply = ({ to, from, replyTo, phone }) => {
    const tel = phone.replace(/[^\d+]/g, '');
    const steps = [
        'Efrain or someone on our team will call or text you within one business day to ask a few questions about the project.',
        'We set a time to come out and look. The estimate is free and there is no obligation.',
        'You get a written quote you can accept online.',
    ];
    return {
        from,
        to,
        reply_to: replyTo,
        subject: 'Thanks, we got your request',
        text: `Thanks for reaching out to LED Custom Painting & More. We got your request.\n\nWhat happens next:\n${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nIf you have photos of the area you want painted, just reply to this email with them. If it's urgent, call or text us at ${phone}.\n\nEfrain and the LED Custom Painting team\nServing Clay County, Mandarin and St. Johns`,
        html: `<p>Thanks for reaching out to LED Custom Painting &amp; More. We got your request.</p><p><strong>What happens next:</strong></p><ol>${steps.map((s) => `<li>${s}</li>`).join('')}</ol><p>If you have photos of the area you want painted, just reply to this email with them. If it's urgent, call or text us at <a href="tel:${tel}">${phone}</a>.</p><p>Efrain and the LED Custom Painting team<br>Serving Clay County, Mandarin and St. Johns</p>`,
    };
};

const buildOwnerSms = (lead) => {
    const parts = [lead.name, lead.phone, lead.projectType, lead.address].filter(Boolean);
    return `New quote request: ${parts.join(' | ')}`.replace(/[\r\n]+/g, ' ').slice(0, 300);
};

// Sends a text through Twilio's REST API: (to, body). Null when not configured.
const createTwilioSender = ({ accountSid, authToken, from, fetchImpl = fetch }) => {
    if (!accountSid || !authToken || !from) return null;
    const url = `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    return async (to, body) => {
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

// Texts the owner's number about each lead. Null unless all four settings are set.
const createTwilioSms = ({ to, ...settings }) => {
    const send = createTwilioSender(settings);
    return send && to ? (body) => send(to, body) : null;
};

module.exports = { buildCustomerReply, buildOwnerSms, createTwilioSms, createTwilioSender };
