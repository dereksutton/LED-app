// Totals for quotes and invoices, in whole cents.

const lineTotal = (item) => Math.round(Number(item.quantity || 0) * Number(item.unitPriceCents || 0));

const computeTotals = ({ items = [], taxRate = 0, discountCents = 0, depositPercent = 0 } = {}) => {
    const subtotalCents = items.reduce((sum, item) => sum + lineTotal(item), 0);
    const discount = Math.min(Math.max(0, Math.round(discountCents || 0)), Math.max(0, subtotalCents));
    const taxable = subtotalCents - discount;
    const taxCents = Math.round((taxable * Number(taxRate || 0)) / 100);
    const totalCents = taxable + taxCents;
    const depositCents = Math.round((totalCents * Number(depositPercent || 0)) / 100);
    return { subtotalCents, discountCents: discount, taxCents, totalCents, depositCents };
};

const paidCents = (invoice) => (invoice.payments || []).reduce((sum, p) => sum + (p.amountCents || 0), 0);

const DAY = 24 * 60 * 60 * 1000;

// What the owner and customer see: draft, sent, viewed, partial, paid,
// overdue or void.
const invoiceState = (invoice, now = new Date()) => {
    const { totalCents } = computeTotals(invoice);
    const paid = paidCents(invoice);
    const balanceCents = Math.max(0, totalCents - paid);
    let status = invoice.status;
    if (status !== 'void') {
        if (totalCents > 0 && balanceCents === 0) status = 'paid';
        else if (paid > 0) status = 'partial';
    }
    const overdue = ['sent', 'viewed', 'partial'].includes(status)
        && invoice.dueDate && new Date(invoice.dueDate).getTime() + DAY <= now.getTime();
    return { totalCents, paidCents: paid, balanceCents, status: overdue ? 'overdue' : status, overdue: Boolean(overdue) };
};

const formatMoney = (cents) =>
    `${cents < 0 ? '-' : ''}$${(Math.abs(cents) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

module.exports = { lineTotal, computeTotals, paidCents, invoiceState, formatMoney, DAY };
