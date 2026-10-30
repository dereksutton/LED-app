// PDFs for quotes, invoices and contracts.
const PDFDocument = require('pdfkit');
const { computeTotals, invoiceState, lineTotal, formatMoney } = require('./money');

const INK = '#1a1a1a';
const MUTED = '#666666';
const RULE = '#dddddd';

const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: 'long', day: 'numeric',
}) : '');

const formatDateTime = (d) => (d ? new Date(d).toLocaleString('en-US', {
    timeZone: 'America/New_York', dateStyle: 'long', timeStyle: 'short',
}) + ' ET' : '');

const toBuffer = (build) => new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'LETTER', margin: 54, info: { Producer: 'LED Custom Painting' } });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    try {
        build(doc);
        doc.end();
    } catch (err) {
        reject(err);
    }
});

const header = (doc, settings, title, number, lines) => {
    doc.fillColor(INK).font('Helvetica-Bold').fontSize(18).text(settings.businessName || 'LED Custom Painting & More', 54, 54);
    doc.font('Helvetica').fontSize(9).fillColor(MUTED);
    [settings.address, settings.phone, settings.email, settings.license ? `License ${settings.license}` : '']
        .filter(Boolean).forEach((l) => doc.text(l));
    doc.font('Helvetica-Bold').fontSize(20).fillColor(INK).text(title, 300, 54, { width: 258, align: 'right' });
    doc.font('Helvetica').fontSize(10).fillColor(MUTED).text(number, 300, doc.y, { width: 258, align: 'right' });
    lines.filter(([, v]) => v).forEach(([label, value]) => {
        doc.text(`${label}: ${value}`, 300, doc.y, { width: 258, align: 'right' });
    });
    doc.moveDown(2);
    const y = Math.max(doc.y, 140);
    doc.moveTo(54, y).lineTo(558, y).strokeColor(RULE).stroke();
    doc.y = y + 14;
};

const customerBlock = (doc, customer, label = 'Prepared for') => {
    doc.x = 54;
    doc.font('Helvetica').fontSize(9).fillColor(MUTED).text(label.toUpperCase());
    doc.font('Helvetica-Bold').fontSize(11).fillColor(INK).text(customer.name || '');
    doc.font('Helvetica').fontSize(10).fillColor(INK);
    [customer.address, customer.phone, customer.email].filter(Boolean).forEach((l) => doc.text(l));
    doc.moveDown(1.2);
};

const itemsTable = (doc, items) => {
    const cols = { desc: 54, qty: 360, price: 420, total: 490 };
    const headerRow = () => {
        doc.font('Helvetica-Bold').fontSize(9).fillColor(MUTED);
        const y = doc.y;
        doc.text('DESCRIPTION', cols.desc, y);
        doc.text('QTY', cols.qty, y, { width: 50, align: 'right' });
        doc.text('PRICE', cols.price, y, { width: 60, align: 'right' });
        doc.text('AMOUNT', cols.total, y, { width: 68, align: 'right' });
        doc.moveDown(0.4);
        doc.moveTo(54, doc.y).lineTo(558, doc.y).strokeColor(RULE).stroke();
        doc.moveDown(0.4);
    };
    headerRow();
    items.forEach((item) => {
        const height = doc.font('Helvetica').fontSize(10).heightOfString(item.description, { width: 296 });
        if (doc.y + height > 700) {
            doc.addPage();
            headerRow();
        }
        const y = doc.y;
        doc.fillColor(INK).text(item.description, cols.desc, y, { width: 296 });
        const after = doc.y;
        doc.text(String(item.quantity), cols.qty, y, { width: 50, align: 'right' });
        doc.text(formatMoney(item.unitPriceCents), cols.price, y, { width: 60, align: 'right' });
        doc.text(formatMoney(lineTotal(item)), cols.total, y, { width: 68, align: 'right' });
        doc.y = after + 6;
    });
    doc.moveTo(54, doc.y).lineTo(558, doc.y).strokeColor(RULE).stroke();
    doc.moveDown(0.6);
};

const totalsBlock = (doc, rows) => {
    rows.filter(Boolean).forEach(([label, value, bold]) => {
        const y = doc.y;
        doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(bold ? 12 : 10).fillColor(INK);
        doc.text(label, 340, y, { width: 140, align: 'right' });
        doc.text(value, 490, y, { width: 68, align: 'right' });
        doc.moveDown(0.3);
    });
    doc.moveDown(1);
};

const textSection = (doc, title, body) => {
    if (!body) return;
    if (doc.y > 660) doc.addPage();
    doc.x = 54;
    doc.font('Helvetica-Bold').fontSize(10).fillColor(INK).text(title);
    doc.font('Helvetica').fontSize(9.5).fillColor(INK).text(body, { width: 504 });
    doc.moveDown(1);
};

const quotePdf = ({ quote, customer, settings }) => toBuffer((doc) => {
    const t = computeTotals(quote);
    header(doc, settings, 'Estimate', quote.number, [
        ['Date', formatDate(quote.sentAt || quote.createdAt)],
        ['Valid until', formatDate(quote.validUntil)],
    ]);
    customerBlock(doc, customer);
    if (quote.title) doc.font('Helvetica-Bold').fontSize(12).fillColor(INK).text(quote.title, 54).moveDown(0.6);
    itemsTable(doc, quote.items || []);
    totalsBlock(doc, [
        ['Subtotal', formatMoney(t.subtotalCents)],
        t.discountCents ? ['Discount', `-${formatMoney(t.discountCents)}`] : null,
        quote.taxRate ? [`Tax (${quote.taxRate}%)`, formatMoney(t.taxCents)] : null,
        ['Total', formatMoney(t.totalCents), true],
        t.depositCents ? [`Deposit (${quote.depositPercent}%)`, formatMoney(t.depositCents)] : null,
    ]);
    textSection(doc, 'Notes', quote.notes);
    textSection(doc, 'Terms', quote.terms);
    if (quote.status === 'accepted') {
        textSection(doc, 'Accepted', `Accepted online by ${quote.acceptedName} on ${formatDateTime(quote.acceptedAt)}.`);
    }
});

const invoicePdf = ({ invoice, customer, settings }) => toBuffer((doc) => {
    const t = computeTotals(invoice);
    const state = invoiceState(invoice);
    header(doc, settings, 'Invoice', invoice.number, [
        ['Date', formatDate(invoice.sentAt || invoice.createdAt)],
        ['Due', formatDate(invoice.dueDate)],
        state.status === 'paid' ? ['Status', 'PAID'] : null,
    ].filter(Boolean));
    customerBlock(doc, customer, 'Bill to');
    if (invoice.title) doc.font('Helvetica-Bold').fontSize(12).fillColor(INK).text(invoice.title, 54).moveDown(0.6);
    itemsTable(doc, invoice.items || []);
    totalsBlock(doc, [
        ['Subtotal', formatMoney(t.subtotalCents)],
        t.discountCents ? ['Discount', `-${formatMoney(t.discountCents)}`] : null,
        invoice.taxRate ? [`Tax (${invoice.taxRate}%)`, formatMoney(t.taxCents)] : null,
        ['Total', formatMoney(t.totalCents), true],
        state.paidCents ? ['Paid', `-${formatMoney(state.paidCents)}`] : null,
        ['Balance due', formatMoney(state.balanceCents), true],
    ]);
    textSection(doc, 'How to pay', settings.paymentInstructions);
    textSection(doc, 'Notes', invoice.notes);
    textSection(doc, 'Terms', invoice.terms);
});

const contractPdf = ({ contract, customer, settings }) => toBuffer((doc) => {
    header(doc, settings, 'Contract', contract.number, [
        ['Date', formatDate(contract.sentAt || contract.createdAt)],
    ]);
    customerBlock(doc, customer, 'Customer');
    doc.x = 54;
    doc.font('Helvetica').fontSize(10).fillColor(INK).text(contract.body || '', { width: 504, lineGap: 2 });
    doc.moveDown(2);
    if (doc.y > 560) doc.addPage();
    doc.x = 54;
    const sig = contract.signature || {};
    if (contract.status === 'signed' && sig.signedAt) {
        doc.font('Helvetica-Bold').fontSize(10).text('Customer signature');
        if (sig.imageDataUrl && /^data:image\/png;base64,/.test(sig.imageDataUrl)) {
            try {
                doc.image(Buffer.from(sig.imageDataUrl.split(',')[1], 'base64'), { fit: [240, 80] });
            } catch {
                // unreadable image: the typed name and audit trail still stand
            }
        }
        doc.font('Helvetica').fontSize(10).text(sig.name);
        doc.fontSize(8).fillColor(MUTED)
            .text(`Signed electronically on ${formatDateTime(sig.signedAt)} from IP ${sig.ip || 'unknown'}.`)
            .text(`Document fingerprint (SHA-256): ${sig.bodyHash || contract.bodyHash || ''}`);
    } else {
        doc.font('Helvetica').fontSize(10).fillColor(INK)
            .text('Customer signature: ______________________________    Date: ____________');
    }
});

module.exports = { quotePdf, invoicePdf, contractPdf, formatDate, formatDateTime };
