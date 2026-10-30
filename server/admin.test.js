// Dashboard API tests. They need a MongoDB: set TEST_MONGO_URI, or run one
// locally on the default port (docker run -p 27017:27017 mongo:7). Without
// one they're skipped, except in CI where they fail.
const { test, before, after, describe } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const mongoose = require('mongoose');
const { createApp } = require('./app');
const { AdminUser, QuoteRequest, Invoice, Contract } = require('./admin/models');
const { hashPassword } = require('./admin/crypto');
const { createStripe } = require('./admin/stripe');

const MONGO = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = `led_admin_test_${crypto.randomBytes(4).toString('hex')}`;
const ORIGIN = 'https://ledcustompainting.com';
const PASSWORD = 'correct horse battery staple';
const WEBHOOK_SECRET = 'whsec_test';

let connected = false;
let server;
let baseUrl;
let clock = Date.now();
const sent = [];
const texts = [];
const stripeCalls = [];
let failEmail = false;

before(async () => {
    try {
        await mongoose.connect(MONGO, { dbName: DB_NAME, serverSelectionTimeoutMS: 2000 });
        connected = true;
    } catch (err) {
        if (process.env.CI) throw err;
        console.warn(`Skipping dashboard tests: no MongoDB at ${MONGO}`);
        return;
    }
    await mongoose.connection.syncIndexes();
    const stripe = createStripe({
        secretKey: 'sk_test_x',
        webhookSecret: WEBHOOK_SECRET,
        fetchImpl: async (url, opts) => {
            stripeCalls.push({ url, body: new URLSearchParams(opts.body) });
            return { ok: true, json: async () => ({ id: 'cs_test_1', url: 'https://checkout.stripe.com/c/pay/cs_test_1' }) };
        },
    });
    const app = createApp({
        sendEmail: async (msg) => {
            if (failEmail) throw new Error('resend down');
            sent.push(msg);
            return { id: 'e1' };
        },
        saveLead: async (lead) => (await QuoteRequest.create(lead))._id,
        notifyTo: 'owner@example.com',
        notifyFrom: 'quotes@example.com',
        rateLimitMax: 1000,
        admin: {
            siteUrl: ORIGIN, secureCookie: true, stripe, now: () => clock,
            textMessage: async (to, body) => { texts.push({ to, body }); },
            loginRateLimitMax: 1000, publicRateLimitMax: 1000,
        },
    });
    await new Promise((resolve) => { server = app.listen(0, resolve); });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    if (server) server.close();
    if (connected) {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    }
});

const call = async (method, path, { body, cookie, origin = ORIGIN, csrf = true, raw, headers = {} } = {}) => {
    const h = { ...headers };
    if (origin) h.Origin = origin;
    if (csrf) h['X-Requested-With'] = 'led-admin';
    if (cookie) h.Cookie = cookie;
    if (body !== undefined && !raw) h['Content-Type'] = 'application/json';
    const res = await fetch(`${baseUrl}${path}`, { method, headers: h, body: raw || (body === undefined ? undefined : JSON.stringify(body)) });
    const type = res.headers.get('content-type') || '';
    const data = type.includes('json') ? await res.json() : Buffer.from(await res.arrayBuffer());
    return { status: res.status, data, headers: res.headers };
};

// The newest sign-in code sent to this login, by email or text.
const emailedCode = (email) => {
    const msg = [...sent].reverse().find((m) => m.to === email && /sign-in code/.test(m.subject));
    return msg && msg.subject.slice(0, 6);
};
const textedCode = (phone) => {
    const msg = [...texts].reverse().find((m) => m.to === phone);
    return msg && msg.body.slice(0, 6);
};

const askForCode = (email, extra = {}) => call('POST', '/api/admin/login', { body: { email, password: PASSWORD, ...extra } });
const enterCode = (email, code) => call('POST', '/api/admin/login', { body: { email, password: PASSWORD, code } });

// Creates a login, signs in with an emailed code and returns the cookie.
const signIn = async (email = 'efrain@example.com', fields = {}) => {
    await AdminUser.deleteOne({ email });
    await AdminUser.create({ email, name: 'Efrain', passwordHash: await hashPassword(PASSWORD), ...fields });
    clock += 60_000;
    const asked = await askForCode(email);
    assert.equal(asked.status, 200, JSON.stringify(asked.data));
    const res = await enterCode(email, emailedCode(email));
    assert.equal(res.status, 200, JSON.stringify(res.data));
    return { cookie: res.headers.getSetCookie()[0].split(';')[0] };
};

// The connection is made in before(), after tests are declared, so check it
// when each test runs.
const dbTest = (name, fn) => test(name, async (t) => {
    if (!connected) return t.skip('no MongoDB');
    await fn(t);
});

describe('dashboard sign-in', () => {
    dbTest('every dashboard route needs a session', async () => {
        for (const [m, p] of [['GET', '/api/admin/me'], ['GET', '/api/admin/leads'], ['GET', '/api/admin/summary'],
            ['GET', '/api/admin/quotes'], ['GET', '/api/admin/invoices'], ['GET', '/api/admin/contracts'],
            ['GET', '/api/admin/customers'], ['GET', '/api/admin/settings'], ['POST', '/api/admin/customers']]) {
            const res = await call(m, p, { body: m === 'POST' ? { name: 'x' } : undefined });
            assert.equal(res.status, 401, `${m} ${p}`);
        }
    });

    dbTest('the password sends a code by email, and the code signs in', async () => {
        await AdminUser.create({ email: 'new@example.com', name: 'New', passwordHash: await hashPassword(PASSWORD) });
        const first = await askForCode('new@example.com');
        assert.equal(first.status, 200);
        assert.deepEqual(first.data, { step: 'code', channel: 'email', to: 'n•••@example.com', canText: false });
        assert.equal(first.headers.getSetCookie().length, 0);
        const code = emailedCode('new@example.com');
        assert.match(code, /^\d{6}$/);
        const stored = await AdminUser.findOne({ email: 'new@example.com' });
        assert.notEqual(stored.loginCode.hash, code);

        // Asking again while the code is still good doesn't send another.
        const before = sent.length;
        await askForCode('new@example.com');
        assert.equal(sent.length, before);

        const wrong = await enterCode('new@example.com', code === '000000' ? '111111' : '000000');
        assert.equal(wrong.status, 401);
        assert.equal(wrong.data.step, 'code');

        const ok = await enterCode('new@example.com', code);
        assert.equal(ok.status, 200);
        const cookie = ok.headers.getSetCookie()[0];
        assert.match(cookie, /HttpOnly/);
        assert.match(cookie, /SameSite=Strict/);
        assert.match(cookie, /Secure/);
    });

    dbTest('with a phone on file the code can be texted, and texting is remembered', async () => {
        await signIn('texter@example.com', { phone: '+19045550123' });
        clock += 60_000;
        const asked = await askForCode('texter@example.com', { channel: 'sms' });
        assert.deepEqual(asked.data, { step: 'code', channel: 'sms', to: '•••0123', canText: true });
        const code = textedCode('+19045550123');
        assert.match(texts[texts.length - 1].body, /@ledcustompainting\.com #\d{6}$/);
        assert.equal((await enterCode('texter@example.com', code)).status, 200);

        clock += 60_000;
        const next = await askForCode('texter@example.com');
        assert.equal(next.data.channel, 'sms');
        // Switching back to email sends a new code there.
        clock += 60_000;
        const email = await askForCode('texter@example.com', { channel: 'email', resend: true });
        assert.equal(email.data.channel, 'email');
        assert.equal((await enterCode('texter@example.com', emailedCode('texter@example.com'))).status, 200);
    });

    dbTest('without a phone, asking for a text still emails the code', async () => {
        await signIn('nophone@example.com');
        clock += 60_000;
        const asked = await askForCode('nophone@example.com', { channel: 'sms' });
        assert.equal(asked.data.channel, 'email');
        assert.equal(asked.data.canText, false);
    });

    dbTest('wrong password and unknown email get the same answer', async () => {
        await signIn('same@example.com');
        const a = await call('POST', '/api/admin/login', { body: { email: 'same@example.com', password: 'wrong password!!' } });
        const b = await call('POST', '/api/admin/login', { body: { email: 'nobody@example.com', password: 'wrong password!!' } });
        assert.equal(a.status, 401);
        assert.deepEqual(a.data, b.data);
    });

    dbTest('five wrong tries lock the account for 15 minutes', async () => {
        await signIn('lock@example.com');
        clock += 60_000;
        await askForCode('lock@example.com');
        const code = emailedCode('lock@example.com');
        for (let i = 0; i < 5; i++) {
            await call('POST', '/api/admin/login', { body: { email: 'lock@example.com', password: 'wrong password!!' } });
        }
        const locked = await enterCode('lock@example.com', code);
        assert.equal(locked.status, 429);
        clock += 16 * 60_000;
        // The code that was waiting was thrown away by the lock.
        assert.equal((await enterCode('lock@example.com', code)).status, 401);
        await askForCode('lock@example.com');
        assert.equal((await enterCode('lock@example.com', emailedCode('lock@example.com'))).status, 200);
    });

    dbTest('a code works once and expires after 10 minutes', async () => {
        await signIn('replay@example.com');
        const used = emailedCode('replay@example.com');
        assert.equal((await enterCode('replay@example.com', used)).status, 401);

        clock += 60_000;
        await askForCode('replay@example.com');
        const late = emailedCode('replay@example.com');
        clock += 11 * 60_000;
        const res = await enterCode('replay@example.com', late);
        assert.equal(res.status, 401);
        assert.match(res.data.message, /expired/);
    });

    dbTest('five wrong codes throw the code away', async () => {
        await signIn('guess@example.com');
        clock += 60_000;
        await askForCode('guess@example.com');
        const code = emailedCode('guess@example.com');
        const wrong = code === '123456' ? '654321' : '123456';
        for (let i = 0; i < 4; i++) await enterCode('guess@example.com', wrong);
        await AdminUser.updateOne({ email: 'guess@example.com' }, { failedAttempts: 0 }); // keep the account lock out of this test
        const fifth = await enterCode('guess@example.com', wrong);
        assert.match(fifth.data.message, /Too many wrong codes/);
        assert.equal((await enterCode('guess@example.com', code)).status, 401);
    });

    dbTest('new codes are limited to one per 30 seconds and five an hour', async () => {
        await signIn('resend@example.com');
        assert.equal((await askForCode('resend@example.com', { resend: true })).status, 429);
        for (let i = 0; i < 4; i++) {
            clock += 31_000;
            assert.equal((await askForCode('resend@example.com', { resend: true })).status, 200, `send ${i + 2}`);
        }
        clock += 31_000;
        const sixth = await askForCode('resend@example.com', { resend: true });
        assert.equal(sixth.status, 429);
        assert.match(sixth.data.message, /Too many codes/);
    });

    dbTest('a code that fails to send says so', async () => {
        await AdminUser.create({ email: 'down@example.com', name: 'Down', passwordHash: await hashPassword(PASSWORD) });
        failEmail = true;
        try {
            const res = await askForCode('down@example.com');
            assert.equal(res.status, 502);
            assert.match(res.data.message, /couldn't email the code/);
        } finally {
            failEmail = false;
        }
        clock += 60_000;
        assert.equal((await askForCode('down@example.com')).status, 200);
    });

    dbTest('the texting phone needs the password to change', async () => {
        const { cookie } = await signIn('phone@example.com');
        const me = await call('GET', '/api/admin/me', { cookie });
        assert.equal(me.data.smsAvailable, true);
        assert.equal((await call('POST', '/api/admin/account/phone', { cookie, body: { currentPassword: 'nope nope nope', phone: '9045550123' } })).status, 401);
        assert.equal((await call('POST', '/api/admin/account/phone', { cookie, body: { currentPassword: PASSWORD, phone: '555' } })).status, 400);
        const ok = await call('POST', '/api/admin/account/phone', { cookie, body: { currentPassword: PASSWORD, phone: '(904) 555-0123' } });
        assert.equal(ok.data.user.phone, '+19045550123');
        await AdminUser.updateOne({ email: 'phone@example.com' }, { codeChannel: 'sms' });
        const cleared = await call('POST', '/api/admin/account/phone', { cookie, body: { currentPassword: PASSWORD, phone: '' } });
        assert.equal(cleared.data.user.phone, '');
        assert.equal(cleared.data.user.codeChannel, 'email');
    });

    dbTest('sessions end on sign-out and after 12 idle hours', async () => {
        const { cookie } = await signIn('session@example.com');
        assert.equal((await call('GET', '/api/admin/me', { cookie })).status, 200);
        await call('POST', '/api/admin/logout', { cookie });
        assert.equal((await call('GET', '/api/admin/me', { cookie })).status, 401);

        const second = await signIn('session@example.com');
        clock += 13 * 60 * 60_000;
        assert.equal((await call('GET', '/api/admin/me', { cookie: second.cookie })).status, 401);
    });

    dbTest('changes from another site are refused', async () => {
        const { cookie } = await signIn();
        const foreign = await call('POST', '/api/admin/customers', { cookie, body: { name: 'X' }, origin: 'https://evil.example' });
        assert.equal(foreign.status, 403);
        const noHeader = await call('POST', '/api/admin/customers', { cookie, body: { name: 'X' }, csrf: false });
        assert.equal(noHeader.status, 403);
        const ok = await call('POST', '/api/admin/customers', { cookie, body: { name: 'X' } });
        assert.equal(ok.status, 201);
    });

    dbTest('changing the password signs out other devices', async () => {
        const a = await signIn('pw@example.com');
        clock += 60_000;
        await askForCode('pw@example.com');
        const b = await enterCode('pw@example.com', emailedCode('pw@example.com'));
        const cookieB = b.headers.getSetCookie()[0].split(';')[0];
        const weak = await call('POST', '/api/admin/account/password', { cookie: a.cookie, body: { currentPassword: PASSWORD, newPassword: 'short' } });
        assert.equal(weak.status, 400);
        const res = await call('POST', '/api/admin/account/password', { cookie: a.cookie, body: { currentPassword: PASSWORD, newPassword: 'a much longer new password' } });
        assert.equal(res.status, 200);
        assert.equal((await call('GET', '/api/admin/me', { cookie: a.cookie })).status, 200);
        assert.equal((await call('GET', '/api/admin/me', { cookie: cookieB })).status, 401);
    });
});

describe('leads to paid invoice', () => {
    let cookie;
    let leadId;
    let customerId;
    let quote;
    let contract;
    let deposit;

    before(async () => { if (connected) ({ cookie } = await signIn('flow@example.com')); });

    dbTest('website leads show up with notes and statuses', async () => {
        await call('POST', '/send-quote', {
            body: {
                name: 'Jane Doe', email: 'jane@example.com', phone: '(904) 555-0100', street: '123 Main St', city: 'Orange Park', zip: '32073',
                projectType: 'Exterior Painting', howDidYouHear: 'Referral', sourceDetail: 'Pat Smith', attribution: { utmSource: 'nextdoor' },
            },
        });
        const list = await call('GET', '/api/admin/leads?status=new', { cookie });
        const lead = list.data.leads.find((l) => l.email === 'jane@example.com');
        assert.ok(lead);
        assert.equal(lead.address, '123 Main St, Orange Park, FL 32073');
        assert.equal(lead.howDidYouHear, 'Referral');
        assert.equal(lead.trackedSource, 'nextdoor');
        leadId = lead.id;

        const bySource = await call('GET', '/api/admin/leads?source=referral', { cookie });
        assert.ok(bySource.data.leads.some((l) => l.id === leadId));
        assert.equal((await call('GET', '/api/admin/leads?source=Facebook', { cookie })).data.leads.length, 0);
        const summary = await call('GET', '/api/admin/summary', { cookie });
        assert.deepEqual(summary.data.sources.find((r) => r.source === 'Referral'), { source: 'Referral', leads: 1, won: 0 });
        const badSource = await call('PATCH', `/api/admin/leads/${leadId}`, { cookie, body: { howDidYouHear: 'Billboard' } });
        assert.equal(badSource.status, 400);

        const search = await call('GET', '/api/admin/leads?q=main%20st', { cookie });
        assert.ok(search.data.leads.some((l) => l.id === leadId));

        const noted = await call('POST', `/api/admin/leads/${leadId}/notes`, { cookie, body: { text: 'Called, wants it before Thanksgiving' } });
        assert.equal(noted.data.lead.notes[0].by, 'Efrain');

        const updated = await call('PATCH', `/api/admin/leads/${leadId}`, { cookie, body: { status: 'contacted' } });
        assert.equal(updated.data.lead.status, 'contacted');
        const bad = await call('PATCH', `/api/admin/leads/${leadId}`, { cookie, body: { status: 'nonsense' } });
        assert.equal(bad.status, 400);
    });

    dbTest('sales pitches go to Spam, leads are never deleted, and spam can come back', async () => {
        sent.length = 0;
        await call('POST', '/send-quote', {
            body: {
                name: 'Growth Team', email: 'pitch@seo-agency.example', phone: '(555) 555-0100', street: '1 Market St', city: 'Jacksonville', zip: '32202',
                projectType: 'Other', howDidYouHear: 'Google Search',
                message: 'Hi, I noticed your website is not on the first page of Google. Our SEO team can fix that. Free audit: https://seo-agency.example/audit',
            },
        });
        assert.match(sent[0].subject, /^Likely spam: /);
        assert.match(sent[0].text, /Spam folder/);

        const all = await call('GET', '/api/admin/leads?status=', { cookie });
        assert.ok(!all.data.leads.some((l) => l.email === 'pitch@seo-agency.example'));
        assert.equal(all.data.spamCount, 1);
        const spam = await call('GET', '/api/admin/leads?status=spam', { cookie });
        assert.equal(spam.data.leads.length, 1);
        const pitch = spam.data.leads[0];
        assert.equal(pitch.isSpam, true);
        assert.equal(pitch.spam.by, 'auto');
        assert.match(pitch.spam.reason, /SEO/);

        const summary = await call('GET', '/api/admin/summary', { cookie });
        assert.ok(!summary.data.sources.some((r) => r.source === 'Google Search'));
        assert.ok(!summary.data.recentLeads.some((l) => l.id === pitch.id));
        assert.equal(summary.data.autoSpamLast30Days, 1);

        const deleted = await call('DELETE', `/api/admin/leads/${pitch.id}`, { cookie });
        assert.equal(deleted.status, 404);
        const convert = await call('POST', `/api/admin/leads/${pitch.id}/convert`, { cookie, body: { createQuote: true } });
        assert.equal(convert.status, 409);

        const restored = await call('POST', `/api/admin/leads/${pitch.id}/spam`, { cookie, body: { spam: false } });
        assert.equal(restored.data.lead.isSpam, false);
        assert.ok((await call('GET', '/api/admin/leads?status=new', { cookie })).data.leads.some((l) => l.id === pitch.id));
        const marked = await call('POST', `/api/admin/leads/${pitch.id}/spam`, { cookie, body: { spam: true } });
        assert.equal(marked.data.lead.spam.by, 'Efrain');
        assert.equal((await call('GET', '/api/admin/leads?status=spam', { cookie })).data.leads.length, 1);
    });

    dbTest('older lead statuses read as won and lost', async () => {
        const old = await QuoteRequest.create({ name: 'Old', email: 'old@example.com', phone: '1', address: 'x', projectType: 'y', status: 'completed' });
        const res = await call('GET', `/api/admin/leads/${old._id}`, { cookie });
        assert.equal(res.data.lead.status, 'won');
        const won = await call('GET', '/api/admin/leads?status=won', { cookie });
        assert.ok(won.data.leads.some((l) => l.id === String(old._id)));
    });

    dbTest('a lead becomes a customer and a draft quote', async () => {
        const res = await call('POST', `/api/admin/leads/${leadId}/convert`, { cookie, body: { createQuote: true } });
        assert.equal(res.status, 200);
        customerId = res.data.customer.id;
        assert.equal(res.data.customer.email, 'jane@example.com');
        assert.match(res.data.quote.number, /^Q-\d+$/);
        quote = res.data.quote;
        const again = await call('POST', `/api/admin/leads/${leadId}/convert`, { cookie, body: {} });
        assert.equal(again.data.customer.id, customerId);
    });

    dbTest('quote totals are worked out on the server', async () => {
        const res = await call('PATCH', `/api/admin/quotes/${quote.id}`, {
            cookie,
            body: {
                title: 'Exterior repaint',
                items: [
                    { description: 'Prep and pressure wash', quantity: 1, unitPriceCents: 45000 },
                    { description: 'Two coats, body and trim', quantity: 2, unitPriceCents: 125050 },
                ],
                taxRate: 7.5,
                discountCents: 10000,
                depositPercent: 30,
            },
        });
        assert.equal(res.status, 200);
        quote = res.data.quote;
        assert.equal(quote.subtotalCents, 295100);
        assert.equal(quote.taxCents, Math.round(285100 * 0.075));
        assert.equal(quote.totalCents, 285100 + Math.round(285100 * 0.075));
        assert.equal(quote.depositCents, Math.round(quote.totalCents * 0.3));
        const summary = await call('GET', '/api/admin/summary', { cookie });
        assert.equal(summary.data.openQuotes.count, 0);
        assert.equal(summary.data.openQuotes.draftCount, 1);
    });

    dbTest('draft links do not open', async () => {
        const res = await call('GET', `/api/public/doc/${quote.publicToken}`);
        assert.equal(res.status, 404);
    });

    dbTest('sending emails the customer a link and a PDF', async () => {
        sent.length = 0;
        const res = await call('POST', `/api/admin/quotes/${quote.id}/send`, { cookie, body: { message: 'Thanks for having us out.' } });
        assert.equal(res.status, 200);
        assert.equal(res.data.quote.status, 'sent');
        assert.equal(sent.length, 1);
        assert.equal(sent[0].to, 'jane@example.com');
        assert.equal(sent[0].reply_to, 'owner@example.com');
        assert.ok(sent[0].text.includes(`${ORIGIN}/d/?t=${quote.publicToken}`));
        assert.equal(sent[0].attachments[0].content.subarray(0, 4).toString(), '%PDF');
    });

    dbTest('a sent quote counts toward open quotes on Home, a draft does not', async () => {
        const summary = await call('GET', '/api/admin/summary', { cookie });
        assert.equal(summary.data.openQuotes.count, 1);
        assert.equal(summary.data.openQuotes.totalCents, quote.totalCents);
        assert.equal(summary.data.openQuotes.items[0].totalCents, quote.totalCents);
        assert.equal(summary.data.openQuotes.draftCount, 0);
    });

    dbTest('the customer sees the quote but nothing internal', async () => {
        const res = await call('GET', `/api/public/doc/${quote.publicToken}`);
        assert.equal(res.status, 200);
        assert.equal(res.data.kind, 'quote');
        assert.equal(res.data.totalCents, quote.totalCents);
        assert.equal(res.data.status, 'viewed');
        const text = JSON.stringify(res.data);
        for (const secret of ['history', 'customerId', 'leadId', 'publicToken', 'jane@example.com', '555-0100']) {
            assert.ok(!text.includes(secret), `leaked ${secret}`);
        }
        const pdf = await call('GET', `/api/public/doc/${quote.publicToken}/pdf`);
        assert.equal(pdf.data.subarray(0, 4).toString(), '%PDF');
    });

    dbTest('made-up tokens get nothing', async () => {
        assert.equal((await call('GET', `/api/public/doc/${'a'.repeat(32)}`)).status, 404);
        assert.equal((await call('GET', '/api/public/doc/short')).status, 404);
        assert.equal((await call('GET', '/api/public/doc/%7B%22%24ne%22%3A1%7D')).status, 404);
    });

    dbTest('the customer accepts online and the owner hears about it', async () => {
        sent.length = 0;
        const missing = await call('POST', `/api/public/doc/${quote.publicToken}/accept`, { body: { name: 'Jane Doe' } });
        assert.equal(missing.status, 400);
        const res = await call('POST', `/api/public/doc/${quote.publicToken}/accept`, { body: { name: 'Jane Doe', agree: true } });
        assert.equal(res.status, 200);
        assert.equal(sent[0].to, 'owner@example.com');
        assert.match(sent[0].subject, /accepted/);
        const twice = await call('POST', `/api/public/doc/${quote.publicToken}/accept`, { body: { name: 'Jane Doe', agree: true } });
        assert.equal(twice.status, 409);
        const lead = await call('GET', `/api/admin/leads/${leadId}`, { cookie });
        assert.equal(lead.data.lead.status, 'won');
        const edit = await call('PATCH', `/api/admin/quotes/${quote.id}`, { cookie, body: { title: 'changed' } });
        assert.equal(edit.status, 409);
        // Accepted work moves from open quotes to ready to invoice.
        const summary = await call('GET', '/api/admin/summary', { cookie });
        assert.equal(summary.data.openQuotes.count, 0);
        assert.equal(summary.data.readyToInvoice.count, 1);
        assert.equal(summary.data.readyToInvoice.totalCents, quote.totalCents);
    });

    dbTest('a contract is filled from the quote and signed online', async () => {
        const made = await call('POST', `/api/admin/quotes/${quote.id}/contract`, { cookie, body: {} });
        assert.equal(made.status, 201);
        contract = made.data.contract;
        assert.ok(contract.body.includes('Jane Doe'));
        assert.ok(contract.body.includes('Two coats, body and trim'));
        assert.ok(!contract.body.includes('{{'));

        const edited = await call('PATCH', `/api/admin/contracts/${contract.id}`, { cookie, body: { body: `${contract.body}\n\n10. Extra clause.` } });
        assert.equal(edited.status, 200);

        await call('POST', `/api/admin/contracts/${contract.id}/send`, { cookie, body: {} });
        const locked = await call('PATCH', `/api/admin/contracts/${contract.id}`, { cookie, body: { body: 'sneaky change' } });
        assert.equal(locked.status, 409);

        const view = await call('GET', `/api/public/doc/${contract.publicToken}`);
        assert.ok(view.data.body.includes('Extra clause'));
        const png = `data:image/png;base64,${Buffer.from('fake png').toString('base64')}`;

        const stale = await call('POST', `/api/public/doc/${contract.publicToken}/sign`, { body: { name: 'Jane Doe', agree: true, signature: png, bodyHash: 'old' } });
        assert.equal(stale.status, 409);
        const noSig = await call('POST', `/api/public/doc/${contract.publicToken}/sign`, { body: { name: 'Jane Doe', agree: true, signature: 'javascript:alert(1)', bodyHash: view.data.bodyHash } });
        assert.equal(noSig.status, 400);

        const signed = await call('POST', `/api/public/doc/${contract.publicToken}/sign`, { body: { name: 'Jane Doe', agree: true, signature: png, bodyHash: view.data.bodyHash } });
        assert.equal(signed.status, 200);
        const stored = await Contract.findById(contract.id);
        assert.equal(stored.signature.name, 'Jane Doe');
        assert.equal(stored.signature.bodyHash, crypto.createHash('sha256').update(stored.body).digest('hex'));
        const pdf = await call('GET', `/api/admin/contracts/${contract.id}/pdf`, { cookie });
        assert.equal(pdf.data.subarray(0, 4).toString(), '%PDF');
    });

    dbTest('deposit and balance invoices add up to the quote', async () => {
        const dep = await call('POST', `/api/admin/quotes/${quote.id}/invoice`, { cookie, body: { kind: 'deposit' } });
        deposit = dep.data.invoice;
        assert.equal(deposit.totalCents, quote.depositCents);
        const bal = await call('POST', `/api/admin/quotes/${quote.id}/invoice`, { cookie, body: { kind: 'balance' } });
        assert.ok(Math.abs(bal.data.invoice.totalCents + deposit.totalCents - quote.totalCents) <= 1);
        const summary = await call('GET', '/api/admin/summary', { cookie });
        assert.equal(summary.data.readyToInvoice.count, 0);
    });

    dbTest('payments recorded by hand settle the invoice', async () => {
        await call('POST', `/api/admin/invoices/${deposit.id}/send`, { cookie, body: {} });
        const part = await call('POST', `/api/admin/invoices/${deposit.id}/payments`, { cookie, body: { amountCents: 10000, method: 'zelle' } });
        assert.equal(part.data.invoice.displayStatus, 'partial');
        const rest = await call('POST', `/api/admin/invoices/${deposit.id}/payments`, { cookie, body: { amountCents: deposit.totalCents - 10000, method: 'check' } });
        assert.equal(rest.data.invoice.displayStatus, 'paid');
        assert.equal(rest.data.invoice.balanceCents, 0);
        const voided = await call('POST', `/api/admin/invoices/${deposit.id}/void`, { cookie, body: {} });
        assert.equal(voided.status, 409);
    });

    dbTest('overdue invoices are flagged on the home screen', async () => {
        const inv = await call('POST', '/api/admin/invoices', {
            cookie, body: { customerId, items: [{ description: 'Touch-ups', quantity: 1, unitPriceCents: 20000 }], dueDate: '2020-01-01' },
        });
        await call('POST', `/api/admin/invoices/${inv.data.invoice.id}/mark-sent`, { cookie, body: {} });
        const summary = await call('GET', '/api/admin/summary', { cookie });
        assert.equal(summary.status, 200);
        assert.ok(summary.data.unpaidInvoices.overdueCount >= 1);
        assert.equal(summary.data.unpaidInvoices.items[0].customerName, 'Jane Doe');
        assert.ok(summary.data.revenueThisMonthCents >= deposit.totalCents);
    });

    dbTest('card payments go through Stripe Checkout and are recorded once', async () => {
        const inv = await call('POST', '/api/admin/invoices', {
            cookie, body: { customerId, items: [{ description: 'Cabinets', quantity: 1, unitPriceCents: 150000 }] },
        });
        const invoice = inv.data.invoice;
        await call('POST', `/api/admin/invoices/${invoice.id}/mark-sent`, { cookie, body: {} });
        const view = await call('GET', `/api/public/doc/${invoice.publicToken}`);
        assert.equal(view.data.canPayOnline, true);
        const checkout = await call('POST', `/api/public/doc/${invoice.publicToken}/checkout`, { body: {} });
        assert.match(checkout.data.url, /^https:\/\/checkout\.stripe\.com\//);
        assert.equal(stripeCalls.at(-1).body.get('line_items[0][price_data][unit_amount]'), '150000');

        const event = JSON.stringify({
            type: 'checkout.session.completed',
            data: { object: { id: 'cs_test_1', payment_status: 'paid', amount_total: 150000, metadata: { invoiceId: invoice.id } } },
        });
        const t = Math.floor(Date.now() / 1000);
        const sig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(`${t}.${event}`).digest('hex');
        const forged = await call('POST', '/api/stripe/webhook', { raw: event, origin: null, csrf: false, headers: { 'Stripe-Signature': `t=${t},v1=${'0'.repeat(64)}`, 'Content-Type': 'application/json' } });
        assert.equal(forged.status, 400);
        for (let i = 0; i < 2; i++) {
            const ok = await call('POST', '/api/stripe/webhook', { raw: event, origin: null, csrf: false, headers: { 'Stripe-Signature': `t=${t},v1=${sig}`, 'Content-Type': 'application/json' } });
            assert.equal(ok.status, 200);
        }
        const stored = await Invoice.findById(invoice.id);
        assert.equal(stored.payments.length, 1);
        assert.equal(stored.payments[0].method, 'stripe');
    });

    dbTest('customers list their documents and can only be deleted when empty', async () => {
        const res = await call('GET', `/api/admin/customers/${customerId}`, { cookie });
        assert.ok(res.data.quotes.length >= 1);
        assert.ok(res.data.invoices.length >= 1);
        assert.ok(res.data.contracts.length >= 1);
        assert.equal((await call('DELETE', `/api/admin/customers/${customerId}`, { cookie })).status, 409);
        assert.equal((await call('GET', '/api/admin/customers/not-an-id', { cookie })).status, 404);
    });

    dbTest('settings are saved and used for new quotes', async () => {
        const res = await call('PUT', '/api/admin/settings', { cookie, body: { defaultDepositPercent: 50, license: 'CBC123' } });
        assert.equal(res.data.settings.defaultDepositPercent, 50);
        const q = await call('POST', '/api/admin/quotes', { cookie, body: { customerId, items: [{ description: 'Walls', quantity: 1, unitPriceCents: 1000 }] } });
        assert.equal(q.data.quote.depositPercent, 50);
        assert.equal((await call('DELETE', `/api/admin/quotes/${q.data.quote.id}`, { cookie })).status, 200);
        assert.equal((await call('DELETE', `/api/admin/quotes/${quote.id}`, { cookie })).status, 409);
    });
});
