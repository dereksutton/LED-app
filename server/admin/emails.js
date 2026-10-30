// Emails the dashboard sends: a document to a customer, a heads-up to the
// owner when a customer accepts, signs or pays, and sign-in codes.
const { escapeHtml } = require('../lib/leadEmail');
const { formatMoney } = require('./money');

const oneLine = (s) => String(s || '').replace(/[\r\n]+/g, ' ').trim();

const LABELS = {
    quote: { noun: 'estimate', action: 'View and accept your estimate' },
    invoice: { noun: 'invoice', action: 'View your invoice' },
    contract: { noun: 'contract', action: 'Review and sign your contract' },
};

const buildDocumentEmail = ({
    kind, number, customerName, amountCents, link, message, settings, to, from, replyTo, pdf,
}) => {
    const label = LABELS[kind];
    const business = settings.businessName || 'LED Custom Painting & More';
    const greeting = `Hi ${oneLine(customerName).split(' ')[0] || 'there'},`;
    const intro = message && message.trim()
        ? message.trim()
        : `Here is your ${label.noun} ${number} from ${business}${amountCents ? ` for ${formatMoney(amountCents)}` : ''}.`;
    const text = `${greeting}\n\n${intro}\n\n${label.action}: ${link}\n\nA PDF copy is attached.\n\nQuestions? Call or text ${settings.phone} or reply to this email.\n\n${business}`;
    const html = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 560px;">
<p>${escapeHtml(greeting)}</p>
<p>${escapeHtml(intro).replace(/\n/g, '<br>')}</p>
<p><a href="${escapeHtml(link)}" style="display: inline-block; padding: 12px 24px; background: #0F172A; color: #F7E7CE; text-decoration: none; border-radius: 6px;">${escapeHtml(label.action)}</a></p>
<p>A PDF copy is attached. Questions? Call or text ${escapeHtml(settings.phone)} or reply to this email.</p>
<p>${escapeHtml(business)}</p>
</div>`;
    return {
        from,
        to,
        reply_to: replyTo,
        subject: oneLine(`${business}: ${label.noun} ${number}`).replace(/^./, (c) => c.toUpperCase()),
        text,
        html,
        attachments: pdf ? [{ filename: `${number}.pdf`, content: pdf }] : undefined,
    };
};

const buildOwnerAlert = ({ subject, lines, link, to, from }) => ({
    from,
    to,
    subject: oneLine(subject),
    text: `${lines.join('\n')}\n\nOpen the dashboard: ${link}`,
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">${lines.map((l) => `<p>${escapeHtml(l)}</p>`).join('')}<p><a href="${escapeHtml(link)}">Open the dashboard</a></p></div>`,
});

// The code is in the subject so it shows in the phone's notification.
const buildSignInCodeEmail = ({ to, from, name, code }) => ({
    from,
    to,
    subject: `${code} is your LED Business sign-in code`,
    text: `Hi ${oneLine(name).split(' ')[0] || 'there'},\n\nYour sign-in code is ${code}. It expires in 10 minutes.\n\nIf you didn't just try to sign in, someone may know your password. Change it in Settings.`,
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 560px;">
<p>Hi ${escapeHtml(oneLine(name).split(' ')[0] || 'there')},</p>
<p>Your sign-in code is</p>
<p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${escapeHtml(code)}</p>
<p>It expires in 10 minutes. If you didn't just try to sign in, someone may know your password. Change it in Settings.</p>
</div>`,
});

module.exports = { buildDocumentEmail, buildOwnerAlert, buildSignInCodeEmail };
