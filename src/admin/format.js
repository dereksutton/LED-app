export const money = (cents = 0) =>
  `${cents < 0 ? '-' : ''}$${(Math.abs(cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// "1,250.5" -> 125050
export const toCents = (value) => {
  const n = Number(String(value ?? '').replace(/[$,\s]/g, ''));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};

export const centsToInput = (cents) => (cents ? (cents / 100).toFixed(2) : '');

const TZ = 'America/New_York';

export const shortDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { timeZone: TZ, month: 'short', day: 'numeric', year: 'numeric' }) : '');

export const dateTime = (d) => (d ? new Date(d).toLocaleString('en-US', { timeZone: TZ, month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '');

// For <input type="date">: the calendar day in Florida time.
export const dateInput = (d) => {
  if (!d) return '';
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(d));
  return parts;
};

// Noon Florida time on that day, so it never slips a day either way.
export const fromDateInput = (value) => (value ? new Date(`${value}T12:00:00-05:00`).toISOString() : null);

export const ago = (d) => {
  if (!d) return '';
  const mins = Math.round((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return shortDate(d);
};

export const STATUS = {
  new: { label: 'New', tone: 'blue' },
  contacted: { label: 'Contacted', tone: 'amber' },
  quoted: { label: 'Quoted', tone: 'purple' },
  won: { label: 'Won', tone: 'green' },
  lost: { label: 'Lost', tone: 'gray' },
  draft: { label: 'Draft', tone: 'gray' },
  sent: { label: 'Sent', tone: 'blue' },
  viewed: { label: 'Opened', tone: 'purple' },
  accepted: { label: 'Accepted', tone: 'green' },
  declined: { label: 'Declined', tone: 'red' },
  partial: { label: 'Part paid', tone: 'amber' },
  paid: { label: 'Paid', tone: 'green' },
  overdue: { label: 'Overdue', tone: 'red' },
  void: { label: 'Void', tone: 'gray' },
  signed: { label: 'Signed', tone: 'green' },
};

export const lineTotal = (item) => Math.round(Number(item.quantity || 0) * Number(item.unitPriceCents || 0));

// Same maths as the server, for live totals while editing.
export const totals = ({ items = [], taxRate = 0, discountCents = 0, depositPercent = 0 }) => {
  const subtotalCents = items.reduce((s, i) => s + lineTotal(i), 0);
  const discount = Math.min(Math.max(0, discountCents || 0), Math.max(0, subtotalCents));
  const taxCents = Math.round(((subtotalCents - discount) * Number(taxRate || 0)) / 100);
  const totalCents = subtotalCents - discount + taxCents;
  return { subtotalCents, discountCents: discount, taxCents, totalCents, depositCents: Math.round((totalCents * Number(depositPercent || 0)) / 100) };
};
