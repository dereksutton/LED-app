"use client";
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi, pdfUrl } from '../../../../../src/admin/api';
import DocHistory from '../../../../../src/admin/DocHistory';
import { centsToInput, dateInput, dateTime, fromDateInput, money, toCents, totals } from '../../../../../src/admin/format';
import LineItems, { cleanItems } from '../../../../../src/admin/LineItems';
import SendDialog from '../../../../../src/admin/SendDialog';
import { Button, Card, ErrorNote, Field, Input, Notice, PageHeader, Spinner, StatusBadge, Textarea, useAction, useLoad } from '../../../../../src/admin/ui';

const toForm = (q) => ({
  title: q.title || '',
  items: q.items.length ? q.items : [{ description: '', quantity: 1, unitPriceCents: 0 }],
  discountText: centsToInput(q.discountCents),
  taxRate: String(q.taxRate ?? 0),
  depositPercent: String(q.depositPercent ?? 0),
  validUntil: dateInput(q.validUntil),
  notes: q.notes || '',
  terms: q.terms || '',
});

function Quote() {
  const id = useSearchParams().get('id');
  const [data, error, reload, , version] = useLoad(() => adminApi.get(`/quotes/${id}`), [id]);
  const [notice, setNotice] = useState('');
  if (error) return <ErrorNote error={error} />;
  if (!data) return <Spinner />;
  return <QuoteEditor key={version} id={id} data={data} reload={reload} notice={notice} setNotice={setNotice} />;
}

function QuoteEditor({ id, data, reload, notice, setNotice }) {
  const router = useRouter();
  const [form, setForm] = useState(() => toForm(data.quote));
  const [dirty, setDirty] = useState(false);
  const [sending, setSending] = useState(false);
  const { busy, error: actionError, run } = useAction();
  const { quote, customer, invoices, contracts, link } = data;
  const locked = ['accepted', 'declined'].includes(quote.status);
  const payload = () => ({
    title: form.title,
    items: cleanItems(form.items),
    discountCents: toCents(form.discountText),
    taxRate: Number(form.taxRate) || 0,
    depositPercent: Number(form.depositPercent) || 0,
    validUntil: fromDateInput(form.validUntil),
    notes: form.notes,
    terms: form.terms,
  });
  const live = totals({ ...payload(), items: form.items });
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setDirty(true); };

  const save = async () => {
    await adminApi.patch(`/quotes/${id}`, payload());
    setDirty(false);
  };
  const onSave = () => run(async () => { await save(); setNotice('Saved.'); reload(); });
  const action = (fn, message) => run(async () => { await fn(); if (message) setNotice(message); reload(); });
  const go = (fn) => run(async () => { const path = await fn(); router.push(path); });

  return (
    <>
      <PageHeader
        back={{ href: '/admin/quotes/', label: 'Quotes' }}
        title={`Quote ${quote.number}`}
        subtitle={customer ? <>For <Link href={`/admin/customers/view/?id=${customer.id}`}>{customer.name}</Link></> : null}
        actions={(
          <>
            <StatusBadge status={quote.status} />
            <Button variant="secondary" href={pdfUrl('quote', quote.id)} target="_blank" rel="noopener">PDF</Button>
            {!locked && <Button variant="secondary" onClick={onSave} disabled={busy || !dirty}>{dirty ? 'Save' : 'Saved'}</Button>}
            {!locked && <Button onClick={() => setSending(true)} disabled={busy}>{quote.status === 'draft' ? 'Send' : 'Send again'}</Button>}
          </>
        )}
      />
      {sending && (
        <SendDialog
          kind="quote" doc={quote} customer={customer}
          beforeSend={dirty ? save : undefined}
          onClose={() => setSending(false)}
          onDone={(res, message, keepOpen) => { setNotice(message); if (!keepOpen) setSending(false); reload(); }}
        />
      )}
      <div className="space-y-3">
        <ErrorNote error={actionError} />
        <Notice>{notice}</Notice>
        {locked && (
          <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
            {quote.status === 'accepted' ? `Accepted by ${quote.acceptedName} on ${dateTime(quote.acceptedAt)}.` : 'The customer declined this quote.'} To change it, make a copy.
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title="Work and price">
            <div className="space-y-4">
              <Field label="Title"><Input value={form.title} onChange={set('title')} disabled={locked} placeholder="e.g. Exterior repaint" /></Field>
              <LineItems items={form.items} disabled={locked} onChange={(items) => { setForm({ ...form, items }); setDirty(true); }} />
              <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
                <Field label="Discount ($)"><Input inputMode="decimal" value={form.discountText} onChange={set('discountText')} disabled={locked} placeholder="0.00" /></Field>
                <Field label="Tax (%)" hint="Painting labor is usually not taxed in Florida."><Input inputMode="decimal" value={form.taxRate} onChange={set('taxRate')} disabled={locked} /></Field>
                <Field label="Deposit (%)"><Input inputMode="decimal" value={form.depositPercent} onChange={set('depositPercent')} disabled={locked} /></Field>
              </div>
              <dl className="ml-auto max-w-xs space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd>{money(live.subtotalCents)}</dd></div>
                {live.discountCents > 0 && <div className="flex justify-between"><dt className="text-slate-500">Discount</dt><dd>-{money(live.discountCents)}</dd></div>}
                {live.taxCents > 0 && <div className="flex justify-between"><dt className="text-slate-500">Tax</dt><dd>{money(live.taxCents)}</dd></div>}
                <div className="flex justify-between border-t border-slate-200 pt-1 text-base font-bold"><dt>Total</dt><dd>{money(live.totalCents)}</dd></div>
                {live.depositCents > 0 && <div className="flex justify-between"><dt className="text-slate-500">Deposit</dt><dd>{money(live.depositCents)}</dd></div>}
              </dl>
            </div>
          </Card>
          <Card title="Notes and terms">
            <div className="space-y-3">
              <Field label="Valid until"><Input type="date" value={form.validUntil} onChange={set('validUntil')} disabled={locked} className="sm:max-w-xs" /></Field>
              <Field label="Notes for the customer"><Textarea rows={3} value={form.notes} onChange={set('notes')} disabled={locked} placeholder="Colors, products, what's included…" /></Field>
              <Field label="Terms"><Textarea rows={5} value={form.terms} onChange={set('terms')} disabled={locked} /></Field>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Next steps">
            <div className="flex flex-col gap-2">
              {quote.status === 'accepted' ? (
                <>
                  <Button onClick={() => go(async () => `/admin/contracts/edit/?id=${(await adminApi.post(`/quotes/${id}/contract`)).contract.id}`)} disabled={busy}>Create contract</Button>
                  {quote.depositCents > 0 && (
                    <Button variant="secondary" onClick={() => go(async () => `/admin/invoices/edit/?id=${(await adminApi.post(`/quotes/${id}/invoice`, { kind: 'deposit' })).invoice.id}`)} disabled={busy}>
                      Deposit invoice ({money(quote.depositCents)})
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => go(async () => `/admin/invoices/edit/?id=${(await adminApi.post(`/quotes/${id}/invoice`, { kind: invoices.length ? 'balance' : 'full' })).invoice.id}`)} disabled={busy}>
                    {invoices.length ? 'Final invoice (less what was billed)' : 'Invoice the full amount'}
                  </Button>
                </>
              ) : (
                <>
                  {quote.status !== 'declined' && <Button variant="secondary" onClick={() => action(() => adminApi.post(`/quotes/${id}/status`, { status: 'accepted' }), 'Marked accepted.')} disabled={busy}>Customer said yes</Button>}
                  {quote.status !== 'declined' && <Button variant="secondary" onClick={() => action(() => adminApi.post(`/quotes/${id}/status`, { status: 'declined' }), 'Marked declined.')} disabled={busy}>Customer said no</Button>}
                </>
              )}
              <Button variant="ghost" onClick={() => go(async () => `/admin/quotes/edit/?id=${(await adminApi.post(`/quotes/${id}/duplicate`)).quote.id}`)} disabled={busy}>Make a copy</Button>
              {quote.status === 'draft' && (
                <Button variant="danger" onClick={() => window.confirm('Delete this draft quote?') && go(async () => { await adminApi.del(`/quotes/${id}`); return '/admin/quotes/'; })} disabled={busy}>Delete draft</Button>
              )}
            </div>
            {link && <p className="mt-3 break-all text-xs text-slate-500">Customer link: <a href={link} target="_blank" rel="noopener noreferrer">{link}</a></p>}
          </Card>
          {(invoices.length > 0 || contracts.length > 0) && (
            <Card title="From this quote">
              <ul className="space-y-2 text-sm">
                {contracts.map((c) => <li key={c.id} className="flex justify-between"><Link href={`/admin/contracts/edit/?id=${c.id}`}>Contract {c.number}</Link><StatusBadge status={c.status} /></li>)}
                {invoices.map((i) => <li key={i.id} className="flex justify-between"><Link href={`/admin/invoices/edit/?id=${i.id}`}>Invoice {i.number} · {money(i.totalCents)}</Link><StatusBadge status={i.displayStatus} /></li>)}
              </ul>
            </Card>
          )}
          <Card title="History"><DocHistory history={quote.history} /></Card>
        </div>
      </div>
    </>
  );
}

export default function QuotePage() {
  return <Suspense fallback={<Spinner />}><Quote /></Suspense>;
}
