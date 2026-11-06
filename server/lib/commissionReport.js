// Builds the monthly commission statement from leads already loaded from the
// database. Pure: no database, no email, nothing sent. The script in
// scripts/commission-report.js loads the data and writes the files.
const { formatMoney, DAY } = require('../admin/money');
const { leadOrganic, ORGANIC_LABELS, CHANNEL_LABELS } = require('./leadSources');

const MONTH_RE = /^(\d{4})-(\d{2})$/;

// Midnight on the 1st in Florida time, for 'YYYY-MM'.
const startOfMonthEastern = (year, month) => {
    const mm = String(month).padStart(2, '0');
    for (const offset of ['-05:00', '-04:00']) {
        const candidate = new Date(`${year}-${mm}-01T00:00:00${offset}`);
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York', day: '2-digit', hour: '2-digit', hourCycle: 'h23',
        }).formatToParts(candidate).reduce((a, p) => ({ ...a, [p.type]: p.value }), {});
        if (parts.day === '01' && parts.hour === '00') return candidate;
    }
    return new Date(`${year}-${mm}-01T05:00:00Z`);
};

// 'YYYY-MM' -> { start, end, label: 'November 2026' }, in Florida time.
const monthRange = (month) => {
    const m = MONTH_RE.exec(String(month || ''));
    if (!m || Number(m[2]) < 1 || Number(m[2]) > 12) throw new Error('Give the month as YYYY-MM, like 2026-11.');
    const year = Number(m[1]);
    const mon = Number(m[2]);
    const start = startOfMonthEastern(year, mon);
    const end = mon === 12 ? startOfMonthEastern(year + 1, 1) : startOfMonthEastern(year, mon + 1);
    const label = start.toLocaleDateString('en-US', { timeZone: 'America/New_York', month: 'long', year: 'numeric' });
    return { start, end, label };
};

// The month before `now`, as 'YYYY-MM' in Florida time.
const previousMonth = (now = new Date()) => {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York', year: 'numeric', month: '2-digit',
    }).formatToParts(now).map((p) => [p.type, p.value]));
    const y = Number(parts.year);
    const m = Number(parts.month);
    return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`;
};

const day = (d) => (d ? new Date(d).toLocaleDateString('en-CA', { timeZone: 'America/New_York' }) : '');

const town = (lead) => {
    if (lead.city) return lead.city;
    const m = /,\s*([^,]+),\s*FL\b/i.exec(lead.address || '');
    return m ? m[1].trim() : '';
};

const isWon = (lead) => lead.status === 'won' || lead.status === 'completed';


/**
 * leads: won leads, each with `payments` ([{ amountCents, receivedAt }])
 *        from the invoices tied to it.
 * base:  'job' (the job amount of jobs won this month) or 'collected'
 *        (money received this month on credited jobs).
 */
const buildCommissionReport = ({
    leads, month, ratePercent = 10, base = 'job', windowDays = 365,
}) => {
    if (!['job', 'collected'].includes(base)) throw new Error('Base must be job or collected.');
    const { start, end, label } = monthRange(month);
    const inMonth = (d) => d && d >= start && d < end;

    const lines = [];
    const excluded = [];
    for (const lead of leads) {
        if (lead.isSpam || !isWon(lead)) continue;
        const { organic, reason } = leadOrganic(lead);
        if (organic !== 'search' && organic !== 'gbp') continue;
        const won = lead.wonAt ? new Date(lead.wonAt) : null;
        if (!won) {
            // Won before won dates were recorded: listed when touched this
            // month, never counted on a guess.
            if (inMonth(lead.updatedAt ? new Date(lead.updatedAt) : null)) {
                excluded.push({
                    leadId: String(lead._id || lead.id || ''), name: lead.name || '', wonDate: 'unknown',
                    why: 'won before won dates were recorded; open it in the dashboard and use Mark won to count it',
                });
            }
            continue;
        }
        const payments = lead.payments || [];
        const collectedToDate = payments.reduce((s, p) => s + p.amountCents, 0);
        const collectedInMonth = payments.filter((p) => inMonth(new Date(p.receivedAt))).reduce((s, p) => s + p.amountCents, 0);
        const counts = base === 'job' ? inMonth(won) : collectedInMonth !== 0;
        if (!counts) continue;

        const flags = [];
        const baseCents = base === 'job' ? (typeof lead.jobAmountCents === 'number' ? lead.jobAmountCents : 0) : collectedInMonth;
        if (base === 'job' && typeof lead.jobAmountCents !== 'number') flags.push('no job amount recorded');
        const line = {
            leadId: String(lead._id || lead.id || ''),
            name: lead.name || '',
            leadDate: day(lead.createdAt),
            wonDate: day(won),
            town: town(lead),
            service: lead.projectType || '',
            channel: CHANNEL_LABELS[lead.channel || (lead.source === 'manual' ? 'manual' : 'form')] || '',
            credit: ORGANIC_LABELS[organic],
            creditReason: reason,
            jobAmountCents: typeof lead.jobAmountCents === 'number' ? lead.jobAmountCents : null,
            collectedToDateCents: collectedToDate,
            collectedInMonthCents: collectedInMonth,
            baseCents,
            commissionCents: Math.round((baseCents * ratePercent) / 100),
            flags,
        };
        const age = lead.createdAt ? (won - new Date(lead.createdAt)) / DAY : 0;
        if (age > windowDays) {
            excluded.push({ ...line, why: `won ${Math.round(age)} days after the first lead, past the ${windowDays}-day window` });
        } else {
            lines.push(line);
        }
    }
    lines.sort((a, b) => a.wonDate.localeCompare(b.wonDate) || a.name.localeCompare(b.name));
    const baseCents = lines.reduce((s, l) => s + l.baseCents, 0);
    return {
        month, label, start, end, ratePercent, base, windowDays,
        lines, excluded,
        baseCents,
        commissionCents: lines.reduce((s, l) => s + l.commissionCents, 0),
    };
};

const BASE_TEXT = {
    job: 'the job amount of each job won this month',
    collected: 'money collected this month on credited jobs',
};

const csvCell = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    // Spreadsheet apps run cells that start with these as formulas.
    const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
    return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};
const dollars = (cents) => (cents === null || cents === undefined ? '' : (cents / 100).toFixed(2));

const toCsv = (report) => {
    const head = ['Lead ID', 'Customer', 'Lead date', 'Won date', 'Town', 'Service', 'Came in by', 'Google credit', 'How it was credited',
        'Job amount', 'Collected to date', 'Collected this month', 'Commission base', `Commission (${report.ratePercent}%)`, 'Notes'];
    const rows = report.lines.map((l) => [l.leadId, l.name, l.leadDate, l.wonDate, l.town, l.service, l.channel, l.credit, l.creditReason,
        dollars(l.jobAmountCents), dollars(l.collectedToDateCents), dollars(l.collectedInMonthCents), dollars(l.baseCents),
        dollars(l.commissionCents), l.flags.join('; ')]);
    return [head, ...rows].map((r) => r.map(csvCell).join(',')).join('\n') + '\n';
};

const toMarkdown = (report) => {
    const out = [];
    out.push(`# Organic Google leads: ${report.label}`, '');
    out.push(`Jobs from leads that came through organic Google Search or the Google Business Profile, credited on ${BASE_TEXT[report.base]}.`, '');
    out.push(`- Jobs: ${report.lines.length}`);
    out.push(`- Commission base: ${formatMoney(report.baseCents)}`);
    out.push(`- Commission at ${report.ratePercent}%: ${formatMoney(report.commissionCents)}`, '');
    if (report.lines.length) {
        out.push('| Won | Customer | Town | Service | Credit | How credited | Job amount | Collected to date | Base | Commission |');
        out.push('|---|---|---|---|---|---|---|---|---|---|');
        for (const l of report.lines) {
            const cell = (v) => String(v || '').replace(/\|/g, '/');
            out.push(`| ${l.wonDate} | ${cell(l.name)} | ${cell(l.town)} | ${cell(l.service)} | ${l.credit} | ${cell(l.creditReason)} | ${l.jobAmountCents === null ? 'not recorded' : formatMoney(l.jobAmountCents)} | ${formatMoney(l.collectedToDateCents)} | ${formatMoney(l.baseCents)} | ${formatMoney(l.commissionCents)} |`);
        }
        out.push('');
    } else {
        out.push('No credited jobs this month.', '');
    }
    const flagged = report.lines.filter((l) => l.flags.length);
    if (flagged.length) {
        out.push('## Check before sending', '');
        for (const l of flagged) out.push(`- ${l.name} (${l.wonDate}): ${l.flags.join('; ')}`);
        out.push('');
    }
    if (report.excluded.length) {
        out.push('## Left out', '');
        for (const l of report.excluded) out.push(`- ${l.name} (${l.wonDate}): ${l.why}`);
        out.push('');
    }
    out.push('Every line traces back to a lead in the dashboard, with its source and change history.', '');
    return out.join('\n');
};

const toInvoice = (report, { from = 'Derek', to = 'LED Custom Painting & More', number, date = new Date() } = {}) => {
    const out = [];
    out.push('# Invoice (draft)', '');
    out.push(`- Invoice: ${number || `LED-${report.month}`}`);
    out.push(`- Date: ${day(date)}`);
    out.push(`- From: ${from}`);
    out.push(`- To: ${to}`, '');
    out.push(`Lead generation commission for ${report.label}: ${report.ratePercent}% of ${BASE_TEXT[report.base]} on ${report.lines.length} job${report.lines.length === 1 ? '' : 's'} from organic Google leads, as listed in the attached statement.`, '');
    out.push(`- Commission base: ${formatMoney(report.baseCents)}`);
    out.push(`- Amount due: ${formatMoney(report.commissionCents)}`, '');
    out.push('This is a draft. Review it, then send it yourself.', '');
    return out.join('\n');
};

module.exports = {
    buildCommissionReport, monthRange, previousMonth, toCsv, toMarkdown, toInvoice,
};
