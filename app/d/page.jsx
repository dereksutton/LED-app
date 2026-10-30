"use client";
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { API_BASE, api } from '../../src/admin/api';
import { money, shortDate, dateTime, lineTotal } from '../../src/admin/format';
import SignaturePad from '../../src/admin/SignaturePad';
import { Button, ErrorNote, Field, Input, Spinner, Textarea } from '../../src/admin/ui';

const TITLES = { quote: 'Estimate', invoice: 'Invoice', contract: 'Contract' };

function Items({ doc }) {
  return (
    <div className="mt-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2 font-medium">Description</th>
            <th className="hidden py-2 text-right font-medium sm:table-cell">Qty</th>
            <th className="hidden py-2 text-right font-medium sm:table-cell">Price</th>
            <th className="py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {doc.items.map((item, i) => (
            <tr key={i}>
              <td className="whitespace-pre-wrap py-3 pr-3 text-slate-900">
                {item.description}
                {item.quantity !== 1 && <span className="block text-xs text-slate-500 sm:hidden">{item.quantity} × {money(item.unitPriceCents)}</span>}
              </td>
              <td className="hidden py-3 text-right text-slate-700 sm:table-cell">{item.quantity}</td>
              <td className="hidden py-3 text-right text-slate-700 sm:table-cell">{money(item.unitPriceCents)}</td>
              <td className="py-3 text-right font-medium text-slate-900">{money(lineTotal(item))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="ml-auto mt-4 max-w-xs space-y-1 text-sm">
        <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd>{money(doc.subtotalCents)}</dd></div>
        {doc.discountCents > 0 && <div className="flex justify-between"><dt className="text-slate-500">Discount</dt><dd>-{money(doc.discountCents)}</dd></div>}
        {doc.taxCents > 0 && <div className="flex justify-between"><dt className="text-slate-500">Tax ({doc.taxRate}%)</dt><dd>{money(doc.taxCents)}</dd></div>}
        <div className="flex justify-between border-t border-slate-200 pt-1 text-base font-bold"><dt>Total</dt><dd>{money(doc.totalCents)}</dd></div>
        {doc.kind === 'quote' && doc.depositCents > 0 && <div className="flex justify-between"><dt className="text-slate-500">Deposit to schedule ({doc.depositPercent}%)</dt><dd>{money(doc.depositCents)}</dd></div>}
        {doc.kind === 'invoice' && doc.paidCents > 0 && <div className="flex justify-between"><dt className="text-slate-500">Paid</dt><dd>-{money(doc.paidCents)}</dd></div>}
        {doc.kind === 'invoice' && <div className="flex justify-between text-base font-bold"><dt>Balance due</dt><dd>{money(doc.balanceCents)}</dd></div>}
      </dl>
    </div>
  );
}

function Text({ title, children }) {
  if (!children) return null;
  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{children}</p>
    </div>
  );
}

function AcceptQuote({ token, doc, onDone }) {
  const [name, setName] = useState('');
  const [agree, setAgree] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const post = async (path, body) => {
    setBusy(true);
    setError(null);
    try {
      await api(`/public/doc/${token}/${path}`, { method: 'POST', body });
      onDone();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  if (declining) {
    return (
      <div className="space-y-3">
        <Field label="Anything we should know? (optional)"><Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
        <ErrorNote error={error} />
        <div className="flex gap-2">
          <Button variant="danger" onClick={() => post('decline', { reason })} disabled={busy}>Decline estimate</Button>
          <Button variant="ghost" onClick={() => setDeclining(false)}>Back</Button>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); post('accept', { name, agree }); }} className="space-y-3">
      <Field label="Your full name"><Input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4" required />
        <span>I accept this estimate of {money(doc.totalCents)} and its terms.</span>
      </label>
      <ErrorNote error={error} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" disabled={busy || !agree || !name.trim()}>{busy ? 'Sending…' : 'Accept estimate'}</Button>
        <Button variant="ghost" onClick={() => setDeclining(true)}>No thanks</Button>
      </div>
    </form>
  );
}

function SignContract({ token, doc, onDone }) {
  const [name, setName] = useState('');
  const [signature, setSignature] = useState(null);
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api(`/public/doc/${token}/sign`, { method: 'POST', body: { name, signature, agree, bodyHash: doc.bodyHash } });
      onDone();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Your full name"><Input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <div>
        <span className="mb-1 block text-sm font-medium text-slate-700">Your signature</span>
        <SignaturePad onChange={setSignature} />
      </div>
      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4" required />
        <span>I have read this contract and agree to its terms. I agree that signing electronically is the same as signing on paper.</span>
      </label>
      <ErrorNote error={error} />
      <Button type="submit" disabled={busy || !agree || !name.trim() || !signature}>{busy ? 'Signing…' : 'Sign contract'}</Button>
    </form>
  );
}

function PayOnline({ token }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const pay = async () => {
    setBusy(true);
    setError(null);
    try {
      const { url } = await api(`/public/doc/${token}/checkout`, { method: 'POST', body: {} });
      if (/^https:\/\/checkout\.stripe\.com\//.test(url)) window.location.assign(url);
      else throw new Error('Online payment isn\'t available right now.');
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };
  return (
    <div className="space-y-2">
      <Button onClick={pay} disabled={busy}>{busy ? 'Opening secure checkout…' : 'Pay by card'}</Button>
      <ErrorNote error={error} />
    </div>
  );
}

function Document() {
  const params = useSearchParams();
  const token = params.get('t') || '';
  const justPaid = params.get('paid') === '1';
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (token) api(`/public/doc/${encodeURIComponent(token)}`).then(setDoc, setError);
  }, [token, tick]);

  const problem = token ? error : new Error('This link is missing its code. Open it again from your email.');
  if (problem) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">We couldn&apos;t open this</h1>
        <p className="mt-2 text-slate-600">{problem.message}</p>
      </div>
    );
  }
  if (!doc) return <Spinner />;

  const b = doc.business;
  const reload = () => setTick((t) => t + 1);
  const answerable = ['sent', 'viewed'].includes(doc.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:justify-between">
          <div>
            <p className="text-lg font-bold text-slate-900">{b.businessName}</p>
            <p className="text-sm text-slate-500">{[b.address, b.phone, b.license && `License ${b.license}`].filter(Boolean).join(' · ')}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-2xl font-bold text-slate-900">{TITLES[doc.kind]}</p>
            <p className="text-sm text-slate-500">{doc.number}{doc.sentAt ? ` · ${shortDate(doc.sentAt)}` : ''}</p>
            {doc.kind === 'quote' && doc.validUntil && <p className="text-sm text-slate-500">Valid until {shortDate(doc.validUntil)}</p>}
            {doc.kind === 'invoice' && doc.dueDate && <p className="text-sm text-slate-500">Due {shortDate(doc.dueDate)}</p>}
          </div>
        </header>
        <div className="mt-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">For</p>
          <p className="font-medium text-slate-900">{doc.customer.name}</p>
          {doc.customer.address && <p className="text-sm text-slate-600">{doc.customer.address}</p>}
        </div>
        {doc.title && <h1 className="mt-5 text-lg font-semibold text-slate-900">{doc.title}</h1>}

        {doc.kind === 'contract'
          ? <div className="mt-5 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">{doc.body}</div>
          : <Items doc={doc} />}

        <Text title="Notes">{doc.notes}</Text>
        <Text title="How to pay">{doc.kind === 'invoice' && doc.balanceCents > 0 ? doc.paymentInstructions : ''}</Text>
        <Text title="Terms">{doc.terms}</Text>

        <section className="mt-8 border-t border-slate-200 pt-6">
          {doc.status === 'void' && <p className="font-medium text-slate-700">This {TITLES[doc.kind].toLowerCase()} has been cancelled. Call {b.phone} with any questions.</p>}

          {doc.kind === 'quote' && answerable && <AcceptQuote token={token} doc={doc} onDone={reload} />}
          {doc.kind === 'quote' && doc.status === 'accepted' && (
            <p className="rounded-lg bg-emerald-50 px-4 py-3 text-emerald-800">Accepted by {doc.acceptedName} on {dateTime(doc.acceptedAt)}. Thank you! We&apos;ll be in touch to schedule.</p>
          )}
          {doc.kind === 'quote' && doc.status === 'declined' && <p className="text-slate-700">You declined this estimate. If you change your mind, call {b.phone}.</p>}

          {doc.kind === 'contract' && answerable && <SignContract token={token} doc={doc} onDone={reload} />}
          {doc.kind === 'contract' && doc.status === 'signed' && (
            <p className="rounded-lg bg-emerald-50 px-4 py-3 text-emerald-800">Signed by {doc.signedName} on {dateTime(doc.signedAt)}. A copy is below.</p>
          )}

          {doc.kind === 'invoice' && doc.status === 'paid' && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-emerald-800">Paid in full. Thank you!</p>}
          {doc.kind === 'invoice' && justPaid && doc.status !== 'paid' && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-emerald-800">Thanks! Your card payment is going through and will show here shortly.</p>}
          {doc.kind === 'invoice' && doc.canPayOnline && !justPaid && <PayOnline token={token} />}

          <p className="mt-6 text-sm">
            <a href={`${API_BASE}/api/public/doc/${encodeURIComponent(token)}/pdf`} target="_blank" rel="noopener noreferrer">Download PDF</a>
            <span className="text-slate-400"> · </span>
            Questions? Call or text <a href={`tel:${b.phone.replace(/[^\d+]/g, '')}`}>{b.phone}</a>
          </p>
        </section>
      </article>
    </div>
  );
}

export default function DocumentPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Suspense fallback={<Spinner />}><Document /></Suspense>
    </main>
  );
}
