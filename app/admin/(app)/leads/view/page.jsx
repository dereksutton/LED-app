"use client";
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi } from '../../../../../src/admin/api';
import { LEAD_SOURCES, dateTime, money } from '../../../../../src/admin/format';
import { Button, Card, ErrorNote, Field, Input, PageHeader, Select, Spinner, StatusBadge, Textarea, useAction, useLoad } from '../../../../../src/admin/ui';

const DETAILS = [
  ['Phone', 'phone'], ['Email', 'email'], ['Address', 'address'], ['Project', 'projectType'], ['Property', 'propertyType'],
  ['Timeline', 'timeline'], ['Budget', 'budgetRange'], ['Area to paint', 'paintingArea'],
];

// How the lead found LED: what they picked on the form (editable for calls
// and corrections) and what the site tracked on its own.
function SourceCard({ lead, onSaved }) {
  const [source, setSource] = useState(lead.howDidYouHear || '');
  const [detail, setDetail] = useState(lead.sourceDetail || '');
  const { busy, error, run } = useAction();
  const changed = source !== (lead.howDidYouHear || '') || detail !== (lead.sourceDetail || '');
  const save = (e) => {
    e.preventDefault();
    run(async () => onSaved((await adminApi.patch(`/leads/${lead.id}`, { howDidYouHear: source, sourceDetail: detail })).lead));
  };
  return (
    <Card title="Lead source">
      <form onSubmit={save} className="space-y-3">
        <Field label="How they heard about you">
          <Select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">Not recorded</option>
            {LEAD_SOURCES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        </Field>
        <Field label="Referred by, or where"><Input value={detail} onChange={(e) => setDetail(e.target.value)} /></Field>
        {lead.trackedSource && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Tracked by the website</p>
            <p className="mt-0.5 text-sm text-slate-900">{lead.trackedSource}</p>
          </div>
        )}
        <ErrorNote error={error} />
        {changed && <Button type="submit" variant="secondary" disabled={busy}>Save source</Button>}
      </form>
    </Card>
  );
}

function Lead() {
  const id = useSearchParams().get('id');
  const router = useRouter();
  const [data, error, , setData] = useLoad(() => adminApi.get(`/leads/${id}`), [id]);
  const [note, setNote] = useState('');
  const { busy, error: actionError, run } = useAction();

  if (error) return <ErrorNote error={error} />;
  if (!data) return <Spinner />;
  const { lead, quotes } = data;

  const setStatus = (status) => run(async () => {
    const res = await adminApi.patch(`/leads/${id}`, { status });
    setData({ ...data, lead: res.lead });
  });
  const addNote = (e) => {
    e.preventDefault();
    run(async () => {
      const res = await adminApi.post(`/leads/${id}/notes`, { text: note });
      setData({ ...data, lead: res.lead });
      setNote('');
    });
  };
  const removeNote = (noteId) => run(async () => {
    const res = await adminApi.del(`/leads/${id}/notes/${noteId}`);
    setData({ ...data, lead: res.lead });
  });
  const makeQuote = () => run(async () => {
    const res = await adminApi.post(`/leads/${id}/convert`, { createQuote: true });
    if (lead.status === 'new' || lead.status === 'contacted') await adminApi.patch(`/leads/${id}`, { status: 'quoted' });
    router.push(`/admin/quotes/edit/?id=${res.quote.id}`);
  });
  const makeCustomer = () => run(async () => {
    const res = await adminApi.post(`/leads/${id}/convert`, {});
    router.push(`/admin/customers/view/?id=${res.customer.id}`);
  });
  const remove = () => {
    if (!window.confirm(`Delete the lead from ${lead.name}? This can't be undone.`)) return;
    run(async () => {
      await adminApi.del(`/leads/${id}`);
      router.push('/admin/leads/');
    });
  };

  return (
    <>
      <PageHeader
        back={{ href: '/admin/leads/', label: 'Leads' }}
        title={lead.name}
        subtitle={`Received ${dateTime(lead.createdAt)}${lead.source === 'manual' ? ' · added by hand' : ' · website form'}`}
        actions={(
          <>
            {lead.customerId
              ? <Button variant="secondary" href={`/admin/customers/view/?id=${lead.customerId}`}>View customer</Button>
              : <Button variant="secondary" onClick={makeCustomer} disabled={busy}>Save as customer</Button>}
            <Button onClick={makeQuote} disabled={busy}>Create quote</Button>
          </>
        )}
      />
      <ErrorNote error={actionError} />
      <div className="mt-4 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title="Request">
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {DETAILS.filter(([, k]) => lead[k]).map(([label, k]) => (
                <div key={k}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
                  <dd className="mt-0.5 text-slate-900 break-words">
                    {k === 'phone' ? <a href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}>{lead.phone}</a>
                      : k === 'email' ? <a href={`mailto:${lead.email}`}>{lead.email}</a>
                        : lead[k]}
                  </dd>
                </div>
              ))}
            </dl>
            {lead.message && (
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Details</p>
                <p className="mt-1 whitespace-pre-wrap text-slate-900">{lead.message}</p>
              </div>
            )}
          </Card>

          <Card title="Notes">
            <form onSubmit={addNote} className="space-y-2">
              <Textarea rows={2} placeholder="Called, left voicemail…" value={note} onChange={(e) => setNote(e.target.value)} aria-label="New note" />
              <Button type="submit" variant="secondary" disabled={busy || !note.trim()}>Add note</Button>
            </form>
            <ul className="mt-4 space-y-3">
              {[...lead.notes].reverse().map((n) => (
                <li key={n.id} className="rounded-lg bg-slate-50 p-3">
                  <p className="whitespace-pre-wrap text-sm text-slate-900">{n.text}</p>
                  <p className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>{n.by} · {dateTime(n.at)}</span>
                    <button type="button" onClick={() => removeNote(n.id)} className="hover:text-red-600">Delete</button>
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          <SourceCard key={`${lead.howDidYouHear}|${lead.sourceDetail}`} lead={lead} onSaved={(saved) => setData({ ...data, lead: saved })} />
          <Card title="Status">
            <Select value={lead.status} onChange={(e) => setStatus(e.target.value)} disabled={busy} aria-label="Lead status">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="quoted">Quoted</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </Select>
            <div className="mt-3 flex flex-wrap gap-2">
              {lead.phone && <Button variant="secondary" href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}>Call</Button>}
              {lead.phone && <Button variant="secondary" href={`sms:${lead.phone.replace(/[^\d+]/g, '')}`}>Text</Button>}
              {lead.email && <Button variant="secondary" href={`mailto:${lead.email}`}>Email</Button>}
            </div>
          </Card>
          <Card title="Quotes">
            {quotes.length ? (
              <ul className="divide-y divide-slate-100">
                {quotes.map((q) => (
                  <li key={q.id}>
                    <Link href={`/admin/quotes/edit/?id=${q.id}`} className="flex items-center justify-between py-2 no-underline">
                      <span className="text-sm font-medium text-slate-900">{q.number} · {money(q.totalCents)}</span>
                      <StatusBadge status={q.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-slate-500">No quotes yet.</p>}
          </Card>
          <Button variant="danger" onClick={remove} disabled={busy} className="w-full">Delete lead</Button>
        </div>
      </div>
    </>
  );
}

export default function LeadPage() {
  return <Suspense fallback={<Spinner />}><Lead /></Suspense>;
}
