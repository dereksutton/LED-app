const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('./app');
const { createTwilioSms, buildCustomerReply } = require('./lib/followUps');

const lead = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '(904) 555-0100',
    address: '32003',
    projectType: 'Interior Painting',
    message: 'Visit https://spam.example now',
};

const withApp = async (deps, fn) => {
    const app = createApp({
        saveLead: async () => 'id1',
        notifyTo: 'owner@example.com',
        notifyFrom: 'quotes@example.com',
        rateLimitMax: 1000,
        ...deps,
    });
    const server = await new Promise((resolve) => {
        const s = app.listen(0, () => resolve(s));
    });
    try {
        const post = (body) => fetch(`http://127.0.0.1:${server.address().port}/send-quote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        await fn(post);
    } finally {
        server.close();
    }
};

test('extras stay off by default', async () => {
    const sent = [];
    await withApp({ sendEmail: async (m) => { sent.push(m); } }, async (post) => {
        const res = await post(lead);
        assert.equal(res.status, 200);
        assert.equal(sent.length, 1);
        assert.equal(sent[0].to, 'owner@example.com');
    });
});

test('owner gets a text and the visitor gets a confirmation when turned on', async () => {
    const sent = [];
    const texts = [];
    await withApp({
        sendEmail: async (m) => { sent.push(m); },
        sendSms: async (body) => { texts.push(body); },
        customerReply: { phone: '(904) 385-0426' },
    }, async (post) => {
        await post(lead);
        assert.equal(texts.length, 1);
        assert.match(texts[0], /Jane Doe/);
        const reply = sent.find((m) => m.to === 'jane@example.com');
        assert.ok(reply);
        assert.equal(reply.reply_to, 'owner@example.com');
    });
});

test('confirmation email carries none of the visitor input', () => {
    const msg = buildCustomerReply({ to: 'a@b.co', from: 'q@x.co', replyTo: 'o@x.co', phone: '(904) 385-0426' });
    assert.doesNotMatch(msg.text + msg.html + msg.subject, /spam|Jane/);
});

test('a failed text or confirmation never fails the request', async () => {
    await withApp({
        sendEmail: async (m) => { if (m.to === 'jane@example.com') throw new Error('nope'); },
        sendSms: async () => { throw new Error('twilio down'); },
        customerReply: { phone: '(904) 385-0426' },
    }, async (post) => {
        const res = await post(lead);
        assert.equal(res.status, 200);
    });
});

test('Twilio sender is off without all its settings', () => {
    assert.equal(createTwilioSms({ accountSid: 'AC1', authToken: 't', from: '+1' }), null);
});

test('Twilio sender posts the message with basic auth', async () => {
    let call;
    const send = createTwilioSms({
        accountSid: 'AC1', authToken: 'tok', from: '+19045550100', to: '+19045550123',
        fetchImpl: async (url, opts) => { call = { url, opts }; return { ok: true, json: async () => ({}) }; },
    });
    await send('hello');
    assert.match(call.url, /Accounts\/AC1\/Messages\.json$/);
    assert.equal(call.opts.headers.Authorization, `Basic ${Buffer.from('AC1:tok').toString('base64')}`);
    const body = new URLSearchParams(call.opts.body);
    assert.equal(body.get('To'), '+19045550123');
    assert.equal(body.get('Body'), 'hello');
});
