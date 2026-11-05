const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
    buildCommissionReport, monthRange, previousMonth, toCsv, toMarkdown, toInvoice,
} = require('./lib/commissionReport');

const lead = (over) => ({
    _id: over.name, status: 'won', createdAt: new Date('2026-10-20T15:00:00Z'), city: 'Orange Park',
    projectType: 'Interior Painting', channel: 'form', organic: 'search', organicReason: 'Came from a Google search', ...over,
});

const leads = [
    lead({ name: 'Search job', wonAt: new Date('2026-11-03T15:00:00Z'), jobAmountCents: 500000, payments: [{ amountCents: 150000, receivedAt: new Date('2026-11-04T15:00:00Z') }] }),
    lead({ name: 'GBP call', organic: 'gbp', channel: 'call', wonAt: new Date('2026-11-20T15:00:00Z'), jobAmountCents: 120000, payments: [] }),
    lead({ name: 'No amount', wonAt: new Date('2026-11-21T15:00:00Z'), payments: [] }),
    lead({ name: 'Referral', organic: 'none', wonAt: new Date('2026-11-05T15:00:00Z'), jobAmountCents: 900000 }),
    lead({ name: 'Last month', wonAt: new Date('2026-10-30T15:00:00Z'), jobAmountCents: 300000, payments: [{ amountCents: 300000, receivedAt: new Date('2026-11-02T15:00:00Z') }] }),
    // 11:30 PM Nov 30 in Florida is Dec 1 in UTC: still November.
    lead({ name: 'Late night', wonAt: new Date('2026-12-01T04:30:00Z'), jobAmountCents: 10000 }),
    lead({ name: 'Too old', createdAt: new Date('2025-06-01T15:00:00Z'), wonAt: new Date('2026-11-10T15:00:00Z'), jobAmountCents: 700000 }),
    lead({ name: 'Spam', isSpam: true, wonAt: new Date('2026-11-10T15:00:00Z'), jobAmountCents: 700000 }),
    lead({ name: 'Old won', organic: undefined, organicReason: undefined, howDidYouHear: 'Google Search', wonAt: undefined, updatedAt: new Date('2026-11-12T15:00:00Z'), jobAmountCents: 400000 }),
    lead({ name: 'Still open', status: 'quoted', jobAmountCents: 400000 }),
];

test('month ranges are in Florida time', () => {
    const { start, end, label } = monthRange('2026-11');
    assert.equal(start.toISOString(), '2026-11-01T04:00:00.000Z');
    assert.equal(end.toISOString(), '2026-12-01T05:00:00.000Z');
    assert.equal(label, 'November 2026');
    assert.equal(monthRange('2026-12').end.toISOString(), '2027-01-01T05:00:00.000Z');
    assert.throws(() => monthRange('2026-13'));
    assert.equal(previousMonth(new Date('2027-01-15T12:00:00Z')), '2026-12');
    assert.equal(previousMonth(new Date('2026-12-01T03:00:00Z')), '2026-10');
});

test('job base counts organic Google jobs won that month', () => {
    const r = buildCommissionReport({ leads, month: '2026-11' });
    assert.deepEqual(r.lines.map((l) => l.name), ['Search job', 'GBP call', 'No amount', 'Late night']);
    assert.equal(r.baseCents, 500000 + 120000 + 0 + 10000);
    assert.equal(r.commissionCents, 63000);
    assert.deepEqual(r.lines.find((l) => l.name === 'No amount').flags, ['no job amount recorded']);
    assert.equal(r.lines.find((l) => l.name === 'GBP call').credit, 'Google Business Profile');
    assert.equal(r.lines.find((l) => l.name === 'GBP call').channel, 'Phone call');
    assert.deepEqual(r.excluded.map((l) => l.name).sort(), ['Old won', 'Too old']);
});

test('collected base counts money received that month', () => {
    const r = buildCommissionReport({ leads, month: '2026-11', base: 'collected' });
    assert.deepEqual(r.lines.map((l) => l.name), ['Last month', 'Search job']);
    assert.equal(r.baseCents, 450000);
    assert.equal(r.commissionCents, 45000);
});

test('the files read cleanly and keep spreadsheets safe', () => {
    const r = buildCommissionReport({ leads: [lead({ name: '=HYPERLINK("x")', wonAt: new Date('2026-11-03T15:00:00Z'), jobAmountCents: 100 })], month: '2026-11' });
    const csv = toCsv(r);
    assert.match(csv, /^Lead ID,Customer,/);
    assert.match(csv, /"'=HYPERLINK\(""x""\)"/);
    assert.match(toMarkdown(r), /Commission at 10%: \$0\.10/);
    const invoice = toInvoice(r, { from: 'Derek', date: new Date('2026-12-01T15:00:00Z') });
    assert.match(invoice, /Invoice: LED-2026-11/);
    assert.match(invoice, /Amount due: \$0\.10/);
    assert.match(invoice, /send it yourself/);
    assert.match(toMarkdown(buildCommissionReport({ leads: [], month: '2026-11' })), /No credited jobs this month/);
});
