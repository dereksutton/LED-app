"use client";
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi, pdfUrl } from '../../../../../src/admin/api';
import DocHistory from '../../../../../src/admin/DocHistory';
import { centsToInput, dateInput, fromDateInput, money, shortDate, toCents, totals } from '../../../../../src/admin/format';
import LineItems, { cleanItems } from '../../../../../src/admin/LineItems';
import SendDialog from '../../../../../src/admin/SendDialog';
import { Button, Card, ErrorNote, Field, Input, Notice, PageHeader, Select, Spinner, StatusBadge, Textarea, useAction, useLoad } from '../../../../../src/admin/ui';

const METHODS = { cash: 'Cash', check: 'Check', zelle: 'Zelle', card: 'Card (in person)', stripe: 'Card (online)', other: 'Other' };

const toForm = (inv) => ({
  title: inv.title || '',
  items: inv.items.length ? inv.items : [{ description: '', quantity: 1, unitPriceCents: 0 }],
  discountText: centsToInput(inv.discountCents),
  taxRate: String(inv.taxRate ?? 0),
  dueDate: dateInput(inv.dueDate),
  notes: inv.notes || '',
  terms: inv.terms || '',
});

function RecordPayment({ invoice, onSaved }) {
  const [amount, setAmount] = useState(centsToInput(invoice.balanceCents));
  const [method, setMethod] = useState('zelle');
  const [receivedAt, setReceivedAt] = useState(dateInput(new Date()));
  const [note, setNote] = useState('');
  const { busy, error, run } = useAction();
  const save = (e) => {
    e.preventDefault();
    run(async () => {
      await adminApi.post(`/invoices/${invoice.id}/payments`, { amountCents: toCents(amount), method, receivedAt: fromDateInput(receivedAt), note });
      onSaved();
    });
  };
  return (
    <form onSubmit={save} className="space-y-3 border-t border-slate-100 pt-3">
      <p className="text-sm font-semibold text-slate-900">Record a payment</p>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Amount ($)"><Input inputMode="decimal" required value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
        <Field label="Method">
          <Select value={method} onChange={(e) => setMethod(e.target.value)}>
            {['zelle', 'check', 'cash', 'card', 'other'].map((m) => <option key={m} value={m}>{METHODS[m]}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Date received"><Input type="date" value={receivedAt} onChange={(e) => setReceivedAt(e.target.value)} /></Field>
      <Field label="Note"><Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Check #1042" /></Field>
      <ErrorNote error={error} />
      <Button type="submit" disabled={busy} className="w-full">Save payment</Button>
    </form>
  );
}

function Invoice() {
  const id = useSearchParams().get('id');
  const [data, error, reload, , version] = useLoad(() => adminApi.get(`/invoices/${id}`), [id]);
  const [notice, setNotice] = useState('');
  if (error) return <ErrorNote error={error} />;
  if (!data) return <Spinner />;
  return <InvoiceEditor key={version} id={id} data={data} reload={reload} notice={notice} setNotice={setNotice} />;
}

function InvoiceEditor({ id, data, reload, notice, setNotice }) {
  const router = useRouter();
  const [form, setForm] = useState(() => toForm(data.invoice));
  const [dirty, setDirty] = useState(false);
  const [sending, setSending] = useState(false);
  const { busy, error: actionError, run } = useAction();
  const { invoice, customer, quote, link } = data;
  const locked = invoice.status === 'void';
  const payload = () => ({
    title: form.title,
    items: cleanItems(form.items),
    discountCents: toCents(form.discountText),
    taxRate: Number(form.taxRate) || 0,
    dueDate: fromDateInput(form.dueDate),
    notes: form.notes,
    terms: form.terms,
  });
  const live = totals({ ...payload(), items: form.items });
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setDirty(true); };
  const save = async () => { await adminApi.patch(`/invoices/${id}`, payload()); setDirty(false); };
  const action = (fn, message) => run(async () => { await fn(); if (message) setNotice(message); reload(); });

  return (
    <>
      <PageHeader
        back={{ href: '/admin/invoices/', label: 'Invoices' }}
        title={`Invoice ${invoice.number}`}
        subtitle={customer ? <>For <Link href={`/admin/customers/view/?id=${customer.id}`}>{customer.name}</Link>{quote && <> · from <Link href={`/admin/quotes/edit/?id=${quote.id}`}>quote {quote.number}</Link></>}</> : null}
        actions={(
          <>
            <StatusBadge status={invoice.displayStatus} />
            <Button variant="secondary" href={pdfUrl('invoice', invoice.id)} target="_blank" rel="noopener">PDF</Button>
            {!locked && <Button variant="secondary" onClick={() => run(async () => { await save(); setNotice('Saved.'); reload(); })} disabled={busy || !dirty}>{dirty ? 'Save' : 'Saved'}</Button>}
            {!locked && invoice.displayStatus !== 'paid' && <Button onClick={() => setSending(true)} disabled={busy}>{invoice.status === 'draft' ? 'Send' : 'Send reminder'}</Button>}
          </>
        )}
      />
      {sending && (
        <SendDialog
          kind="invoice" doc={invoice} customer={customer}
          beforeSend={dirty ? save : undefined}
          onClose={() => setSending(false)}
          onDone={(res, message, keepOpen) => { setNotice(message); if (!keepOpen) setSending(false); reload(); }}
        />
      )}
      <div className="space-y-3">
        <ErrorNote error={actionError} />
        <Notice>{notice}</Notice>
        {invoice.paidCents > 0 && !locked && <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">This invoice has payments. Changing the lines changes what&apos;s owed.</p>}
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title="What's being billed">
            <div className="space-y-4">
              <Field label="Title"><Input value={form.title} onChange={set('title')} disabled={locked} /></Field>
              <LineItems items={form.items} disabled={locked} onChange={(items) => { setForm({ ...form, items }); setDirty(true); }} />
              <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
                <Field label="Discount ($)"><Input inputMode="decimal" value={form.discountText} onChange={set('discountText')} disabled={locked} placeholder="0.00" /></Field>
                <Field label="Tax (%)"><Input inputMode="decimal" value={form.taxRate} onChange={set('taxRate')} disabled={locked} /></Field>
                <Field label="Due date"><Input type="date" value={form.dueDate} onChange={set('dueDate')} disabled={locked} /></Field>
              </div>
              <dl className="ml-auto max-w-xs space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd>{money(live.subtotalCents)}</dd></div>
                {live.discountCents > 0 && <div className="flex justify-between"><dt className="text-slate-500">Discount</dt><dd>-{money(live.discountCents)}</dd></div>}
                {live.taxCents > 0 && <div className="flex justify-between"><dt className="text-slate-500">Tax</dt><dd>{money(live.taxCents)}</dd></div>}
                <div className="flex justify-between border-t border-slate-200 pt-1 text-base font-bold"><dt>Total</dt><dd>{money(live.totalCents)}</dd></div>
                {invoice.paidCents > 0 && <div className="flex justify-between"><dt className="text-slate-500">Paid</dt><dd>-{money(invoice.paidCents)}</dd></div>}
                <div className="flex justify-between font-semibold"><dt>Balance due</dt><dd>{money(Math.max(0, live.totalCents - invoice.paidCents))}</dd></div>
              </dl>
            </div>
          </Card>
          <Card title="Notes and terms">
            <div className="space-y-3">
              <Field label="Notes for the customer"><Textarea rows={3} value={form.notes} onChange={set('notes')} disabled={locked} /></Field>
              <Field label="Terms"><Textarea rows={3} value={form.terms} onChange={set('terms')} disabled={locked} /></Field>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Payments">
            <p className="mb-3 text-2xl font-bold text-slate-900">{money(invoice.balanceCents)} <span className="text-sm font-normal text-slate-500">due</span></p>
            {invoice.payments.length > 0 && (
              <ul className="mb-3 divide-y divide-slate-100 text-sm">
                {invoice.payments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2 py-2">
                    <span>
                      <span className="font-medium text-slate-900">{money(p.amountCents)}</span>
                      <span className="text-slate-500"> · {METHODS[p.method] || p.method} · {shortDate(p.receivedAt)}</span>
                      {p.note && <span className="block text-xs text-slate-500">{p.note}</span>}
                    </span>
                    {p.method !== 'stripe' && (
                      <button type="button" className="text-xs text-slate-500 hover:text-red-600" onClick={() => window.confirm('Remove this payment?') && action(() => adminApi.del(`/invoices/${id}/payments/${p.id}`), 'Payment removed.')}>Remove</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {!locked && invoice.balanceCents > 0 && <RecordPayment key={invoice.balanceCents} invoice={invoice} onSaved={() => { setNotice('Payment saved.'); reload(); }} />}
            {link && <p className="mt-3 break-all text-xs text-slate-500">Customer link: <a href={link} target="_blank" rel="noopener noreferrer">{link}</a></p>}
          </Card>
          <Card title="More">
            <div className="flex flex-col gap-2">
              {invoice.status === 'draft' && invoice.paidCents === 0 && (
                <Button variant="danger" onClick={() => window.confirm('Delete this draft invoice?') && run(async () => { await adminApi.del(`/invoices/${id}`); router.push('/admin/invoices/'); })} disabled={busy}>Delete draft</Button>
              )}
              {invoice.status !== 'draft' && !locked && invoice.paidCents === 0 && (
                <Button variant="danger" onClick={() => window.confirm('Void this invoice? The customer link will show it as void.') && action(() => adminApi.post(`/invoices/${id}/void`), 'Invoice voided.')} disabled={busy}>Void invoice</Button>
              )}
            </div>
          </Card>
          <Card title="History"><DocHistory history={invoice.history} /></Card>
        </div>
      </div>
    </>
  );
}

export default function InvoicePage() {
  return <Suspense fallback={<Spinner />}><Invoice /></Suspense>;
}
