const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('./app');
const { classifyOrganic, normalizeRefCode } = require('./lib/leadSources');

const validLead = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '(904) 555-0100',
    street: '123 Main St',
    city: 'Fleming Island',
    zip: '32003',
    projectType: 'Exterior Painting',
    howDidYouHear: 'Google Search',
    propertyType: 'Single Family Home',
    timeline: 'Within 1 month',
};

// Each test swaps these to control how the fake dependencies behave.
let saveImpl;
let emailImpl;
const sent = [];
const saved = [];
const intents = [];

let server;
let baseUrl;

before(async () => {
    const app = createApp({
        sendEmail: (msg) => emailImpl(msg),
        saveLead: (lead) => saveImpl(lead),
        saveContactIntent: async (intent) => { intents.push(intent); },
        notifyTo: 'owner@example.com',
        notifyFrom: 'quotes@example.com',
        rateLimitMax: 1000,
    });
    await new Promise((resolve) => {
        server = app.listen(0, resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

const reset = () => {
    sent.length = 0;
    saved.length = 0;
    saveImpl = async (lead) => { saved.push(lead); return 'id1'; };
    emailImpl = async (msg) => { sent.push(msg); return { id: 'e1' }; };
};

const post = (body, path = '/send-quote') =>
    fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

test('lead list endpoint is not exposed', async () => {
    const res = await fetch(`${baseUrl}/quote-requests`);
    assert.equal(res.status, 404);
});

test('valid lead is saved and emailed', async () => {
    reset();
    const res = await post(validLead);
    assert.equal(res.status, 200);
    assert.equal(saved.length, 1);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].to, 'owner@example.com');
    assert.equal(sent[0].reply_to, 'jane@example.com');
});

test('the lead keeps the full address, source and tracking', async () => {
    reset();
    const res = await post({
        ...validLead,
        howDidYouHear: 'referral',
        sourceDetail: 'Pat from church',
        attribution: { clickId: 'google', utmSource: 'google', utmMedium: 'cpc', landingPage: '/', evil: 'x', firstSeenAt: '2026-10-01T12:00:00Z' },
    });
    assert.equal(res.status, 200);
    const lead = saved[0];
    assert.equal(lead.address, '123 Main St, Fleming Island, FL 32003');
    assert.equal(lead.howDidYouHear, 'Referral');
    assert.equal(lead.sourceDetail, 'Pat from church');
    assert.deepEqual(Object.keys(lead.attribution).sort(), ['clickId', 'firstSeenAt', 'landingPage', 'utmMedium', 'utmSource']);
    assert.match(sent[0].text, /How They Heard About Us: Referral: Pat from church/);
    assert.match(sent[0].text, /Tracked Source: Google Ads click/);
});

test('ordinary street addresses are accepted', async () => {
    for (const street of ['1520 Oak Ln', '12-B N Main St', '4300 SW 12th Ave', '9 E Bay St Apt 4']) {
        reset();
        assert.equal((await post({ ...validLead, street })).status, 200, street);
    }
});

test('a ZIP alone or a street without a number is refused', async () => {
    reset();
    for (const street of ['32003', 'Main Street', '']) {
        const res = await post({ ...validLead, street });
        assert.equal(res.status, 400, street);
    }
    const badZip = await post({ ...validLead, zip: '3200' });
    assert.equal(badZip.status, 400);
    assert.equal(saved.length, 0);
});

test('how they heard is required and must be from the list', async () => {
    reset();
    assert.equal((await post({ ...validLead, howDidYouHear: '' })).status, 400);
    assert.equal((await post({ ...validLead, howDidYouHear: 'Billboard' })).status, 400);
    assert.equal((await post({ ...validLead, howDidYouHear: 'Other' })).status, 400);
    assert.equal((await post({ ...validLead, howDidYouHear: 'Other', sourceDetail: 'Home show' })).status, 200);
});

test('lead is still emailed when the database is down', async () => {
    reset();
    saveImpl = async () => { throw new Error('Database not connected'); };
    const res = await post(validLead);
    assert.equal(res.status, 200);
    assert.equal(sent.length, 1);
});

test('lead is still saved when email fails', async () => {
    reset();
    emailImpl = async () => { throw new Error('Resend down'); };
    const res = await post(validLead);
    assert.equal(res.status, 200);
    assert.equal(saved.length, 1);
});

test('visitor is told to call when both save and email fail', async () => {
    reset();
    saveImpl = async () => { throw new Error('db'); };
    emailImpl = async () => { throw new Error('email'); };
    const res = await post(validLead);
    const body = await res.json();
    assert.equal(res.status, 500);
    assert.match(body.message, /call/i);
    assert.doesNotMatch(JSON.stringify(body), /db|email/);
});

test('form input is escaped in the owner email', async () => {
    reset();
    await post({
        ...validLead,
        name: '<a href="https://evil.example">Click</a>',
        message: '<script>alert(1)</script>\nsecond line',
    });
    const { html, subject } = sent[0];
    assert.doesNotMatch(html, /<a href="https:\/\/evil/);
    assert.doesNotMatch(html, /<script>/);
    assert.match(html, /&lt;script&gt;/);
    assert.doesNotMatch(subject, /[\r\n]/);
});

test('phone link keeps only dialable characters', async () => {
    reset();
    await post({ ...validLead, phone: '904" onclick="x' });
    assert.match(sent[0].html, /href="tel:904"/);
});

test('missing required fields are rejected', async () => {
    reset();
    const res = await post({ ...validLead, phone: '' });
    assert.equal(res.status, 400);
    assert.equal(saved.length + sent.length, 0);
});

test('oversized fields are rejected', async () => {
    reset();
    const res = await post({ ...validLead, name: 'x'.repeat(301) });
    assert.equal(res.status, 400);
});

test('honeypot submissions are dropped silently', async () => {
    reset();
    const res = await post({ ...validLead, website: 'http://spam.example' });
    assert.equal(res.status, 200);
    assert.equal(saved.length + sent.length, 0);
});

test('short form without property type or timeline is accepted', async () => {
    reset();
    const { propertyType, timeline, ...shortLead } = validLead;
    const res = await post(shortLead);
    assert.equal(res.status, 200);
    assert.equal(saved.length, 1);
    assert.doesNotMatch(sent[0].text, /undefined/);
});

test('organic Google credit comes from tracking first, then the form answer', () => {
    assert.deepEqual(classifyOrganic({ attribution: { referrer: 'www.google.com' }, howDidYouHear: 'Facebook' }),
        { organic: 'search', reason: 'Came from a Google search' });
    assert.equal(classifyOrganic({ attribution: { utmSource: 'google', utmMedium: 'organic', utmCampaign: 'gbp' } }).organic, 'gbp');
    assert.equal(classifyOrganic({ attribution: { referrer: 'maps.google.com' } }).organic, 'gbp');
    assert.equal(classifyOrganic({ attribution: { referrer: 'www.google.com', clickId: 'google' }, howDidYouHear: 'Google Search' }).organic, 'none');
    assert.equal(classifyOrganic({ attribution: { utmSource: 'google', utmMedium: 'cpc' }, howDidYouHear: 'Google Search' }).organic, 'none');
    assert.equal(classifyOrganic({ attribution: { utmSource: 'nextdoor' }, howDidYouHear: 'Google Search' }).organic, 'none');
    assert.equal(classifyOrganic({ howDidYouHear: 'Google Search' }).organic, 'search');
    assert.equal(classifyOrganic({ howDidYouHear: 'google maps' }).organic, 'gbp');
    assert.equal(classifyOrganic({ howDidYouHear: 'Referral' }).organic, 'none');
    assert.equal(classifyOrganic({ attribution: { referrer: 'notgoogle.com.evil.io' } }).organic, 'none');
});

test('ref codes', () => {
    assert.equal(normalizeRefCode(' ref k7f3 '), 'K7F3');
    assert.equal(normalizeRefCode('<script>'), null);
});

test('form leads are tagged with channel, organic credit and ref code', async () => {
    reset();
    const res = await post({ ...validLead, refCode: 'k7f3', attribution: { referrer: 'www.google.com' } });
    assert.equal(res.status, 200);
    assert.equal(saved[0].channel, 'form');
    assert.equal(saved[0].organic, 'search');
    assert.equal(saved[0].organicReason, 'Came from a Google search');
    assert.equal(saved[0].refCode, 'K7F3');
});

test('a ZIP outside the usual area gets the same reply and email as any other', async () => {
    reset();
    const res = await post({ ...validLead, city: 'Ponte Vedra Beach', zip: '32082' });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, { success: true, message: 'Quote request received.' });
    assert.equal(saved[0].outOfArea, undefined);
    assert.match(sent[0].subject, /^Quote Request from Jane Doe/);
    assert.doesNotMatch(`${sent[0].text}${sent[0].html}`, /out of area|service area/i);
});

test('the old callback route is gone', async () => {
    const res = await post({ name: 'Sam Lee', phone: '904-555-0199' }, '/api/callback');
    assert.equal(res.status, 404);
});

test('call and text taps are recorded without personal details', async () => {
    intents.length = 0;
    const res = await post({
        kind: 'text', refCode: 'AB12', page: '/services/', name: 'Jane', phone: '9045550100',
        attribution: { utmSource: 'google', utmMedium: 'organic', utmCampaign: 'gbp' },
    }, '/api/contact-intent');
    assert.equal(res.status, 204);
    assert.equal(intents.length, 1);
    assert.deepEqual(Object.keys(intents[0]).sort(), ['attribution', 'kind', 'organic', 'organicReason', 'page', 'refCode']);
    assert.equal(intents[0].organic, 'gbp');
    const bad = await post({ kind: 'email' }, '/api/contact-intent');
    assert.equal(bad.status, 400);
});
