// Optional card payments through Stripe Checkout. Off until the owner's own
// STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are set. Talks to Stripe's REST
// API directly, so there's no SDK to install.
const crypto = require('crypto');

const createStripe = ({ secretKey, webhookSecret, fetchImpl = fetch } = {}) => {
    if (!secretKey || !webhookSecret) return null;

    const createCheckoutSession = async ({ invoiceNumber, invoiceId, amountCents, customerEmail, successUrl, cancelUrl }) => {
        const params = new URLSearchParams({
            mode: 'payment',
            'line_items[0][quantity]': '1',
            'line_items[0][price_data][currency]': 'usd',
            'line_items[0][price_data][unit_amount]': String(amountCents),
            'line_items[0][price_data][product_data][name]': `Invoice ${invoiceNumber}`,
            success_url: successUrl,
            cancel_url: cancelUrl,
            client_reference_id: String(invoiceId),
            'metadata[invoiceId]': String(invoiceId),
            'payment_intent_data[metadata][invoiceId]': String(invoiceId),
        });
        if (customerEmail) params.set('customer_email', customerEmail);
        const res = await fetchImpl('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });
        const body = await res.json();
        if (!res.ok) throw new Error((body.error && body.error.message) || `Stripe responded ${res.status}`);
        return { id: body.id, url: body.url };
    };

    // Checks the Stripe-Signature header (HMAC-SHA256 of "timestamp.payload")
    // and returns the parsed event, or null when it doesn't match.
    const verifyWebhook = (rawBody, header, { now = Date.now(), toleranceSec = 300 } = {}) =>
        verifyStripeSignature(rawBody, header, webhookSecret, { now, toleranceSec });

    return { createCheckoutSession, verifyWebhook };
};

const verifyStripeSignature = (rawBody, header, secret, { now = Date.now(), toleranceSec = 300 } = {}) => {
    if (!header || !Buffer.isBuffer(rawBody)) return null;
    const parts = String(header).split(',').map((p) => p.trim().split('=')).reduce((acc, kv) => {
        (acc[kv[0]] = acc[kv[0]] || []).push(kv);
        return acc;
    }, {});
    const timestamp = parts.t && parts.t[0] && Number(parts.t[0][1]);
    const signatures = (parts.v1 || []).map(([, v]) => v);
    if (!timestamp || !signatures.length) return null;
    if (Math.abs(now / 1000 - timestamp) > toleranceSec) return null;
    const expected = crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody.toString('utf8')}`).digest('hex');
    const match = signatures.some((sig) => sig.length === expected.length
        && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)));
    if (!match) return null;
    try {
        return JSON.parse(rawBody.toString('utf8'));
    } catch {
        return null;
    }
};

module.exports = { createStripe, verifyStripeSignature };
