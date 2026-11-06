// Monthly commission statement for organic Google leads. Read-only: it only
// reads the database, writes three files on this computer and prints a
// summary. It never changes a record and never sends anything.
//
//   npm run commission-report -- --month 2026-11
//   npm run commission-report -- --month 2026-11 --base collected --rate 10 --out ./reports --from "Derek"
//
//   --month  YYYY-MM, Florida time. Defaults to last month.
//   --base   job (default): the job amount of jobs won that month.
//            collected: money received that month on credited jobs.
//   --rate   percent, default 10.
//   --window days from first lead to win that still count, default 365.
//   --out    folder for the files, default ./commission-reports/<month>.
//   --from, --to, --number: names and number on the invoice draft.
//
// Needs MONGO_URI (from server/.env or the environment), like the API.
require('dotenv').config({ path: `${__dirname}/../.env`, override: true });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const {
    buildCommissionReport, previousMonth, toCsv, toMarkdown, toInvoice,
} = require('../lib/commissionReport');
const { formatMoney } = require('../admin/money');

const args = process.argv.slice(2);
const flag = (name) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : undefined;
};

const main = async () => {
    const month = flag('month') || previousMonth();
    const base = flag('base') || 'job';
    const ratePercent = Number(flag('rate') || 10);
    const windowDays = Number(flag('window') || 365);
    if (!Number.isFinite(ratePercent) || ratePercent <= 0 || ratePercent > 100) throw new Error('--rate must be a percent, like 10.');
    if (!Number.isFinite(windowDays) || windowDays <= 0) throw new Error('--window must be a number of days.');
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set.');

    // No index or collection is ever created from here.
    await mongoose.connect(process.env.MONGO_URI, { autoIndex: false, autoCreate: false, serverSelectionTimeoutMS: 10000 });
    const db = mongoose.connection.db;
    const leads = await db.collection('quoterequests')
        .find({ status: { $in: ['won', 'completed'] }, isSpam: { $ne: true } }, { projection: { notes: 0, history: 0 } })
        .toArray();
    const leadIds = leads.map((l) => l._id);
    const customerIds = leads.map((l) => l.customerId).filter(Boolean);
    const quotes = await db.collection('quotes').find({ leadId: { $in: leadIds } }, { projection: { leadId: 1 } }).toArray();
    const invoices = await db.collection('invoices').find({
        status: { $ne: 'void' },
        $or: [{ quoteId: { $in: quotes.map((q) => q._id) } }, { customerId: { $in: customerIds } }],
    }, { projection: { quoteId: 1, customerId: 1, payments: 1 } }).toArray();
    await mongoose.disconnect();

    // Payments on each lead's invoices: through its quotes, or its customer.
    const leadByQuote = Object.fromEntries(quotes.map((q) => [String(q._id), String(q.leadId)]));
    const leadByCustomer = Object.fromEntries(leads.filter((l) => l.customerId).map((l) => [String(l.customerId), String(l._id)]));
    const payments = {};
    for (const inv of invoices) {
        const leadId = (inv.quoteId && leadByQuote[String(inv.quoteId)]) || leadByCustomer[String(inv.customerId)];
        if (!leadId) continue;
        (payments[leadId] = payments[leadId] || []).push(...(inv.payments || []));
    }
    const report = buildCommissionReport({
        leads: leads.map((l) => ({ ...l, payments: payments[String(l._id)] || [] })),
        month, ratePercent, base, windowDays,
    });

    const out = path.resolve(flag('out') || path.join('commission-reports', month));
    fs.mkdirSync(out, { recursive: true });
    const files = {
        [`statement-${month}.md`]: toMarkdown(report),
        [`jobs-${month}.csv`]: toCsv(report),
        [`invoice-${month}.md`]: toInvoice(report, { from: flag('from'), to: flag('to'), number: flag('number') }),
    };
    for (const [name, body] of Object.entries(files)) fs.writeFileSync(path.join(out, name), body);

    console.log(`${report.label}: ${report.lines.length} credited job${report.lines.length === 1 ? '' : 's'}, base ${formatMoney(report.baseCents)}, commission ${formatMoney(report.commissionCents)} at ${ratePercent}%.`);
    if (report.excluded.length) console.log(`${report.excluded.length} left out; see the statement.`);
    console.log(`Files in ${out}:\n${Object.keys(files).map((f) => `  ${f}`).join('\n')}`);
    console.log('Nothing was sent. Review the files, then send the invoice yourself.');
};

main().catch(async (err) => {
    console.error(err.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
