"use client";
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi } from '../../../../../src/admin/api';
import { LEAD_SOURCES, ORGANIC, STATUS, centsToInput, channelLabel, dateTime, money, shortDate, toCents } from '../../../../../src/admin/format';
import { Badge, Button, Card, ErrorNote, Field, Input, Modal, PageHeader, Select, Spinner, StatusBadge, Textarea, useAction, useLoad } from '../../../../../src/admin/ui';

const DETAILS = [
  ['Phone', 'phone'], ['Email', 'email'], ['Address', 'address'], ['ZIP', 'zip'], ['Project', 'projectType'], ['Property', 'propertyType'],
  ['Timeline', 'timeline'], ['Budget', 'budgetRange'], ['Area to paint', 'paintingArea'], ['Best time to call', 'bestTime'],
];

const digits = (phone) => phone.replace(/[^\d+]/g, '');

// History values: statuses by their dashboard names, blanks as "none".
const show = (h, v) => (h.field === 'Status' && STATUS[v] ? STATUS[v].label : v || 'none');

// A text from the owner's own phone, ready to send.
const textHref = (lead) => {
  const first = (lead.name || '').trim().split(/\s+/)[0];
  const project = lead.projectType ? ` about ${lead.projectType.toLowerCase()}` : '';
  const body = `Hi${first ? ` ${first}` : ''}, this is LED Custom Painting. Thanks for reaching out${project}! When's a good time to talk, or to come take a look?`;
  // "?&body=" works on both iPhone and Android.
  return `sms:${digits(lead.phone)}?&body=${encodeURIComponent(body)}`;
};

// Asks for the job amount when a lead is marked won, filled in from the
// accepted quote.
function MarkWon({ lead, quotes, onClose, onSaved }) {
  const accepted = quotes.find((q) => q.status === 'accepted');
  const start = typeof lead.jobAmountCents === 'number' ? lead.jobAmountCents : accepted ? accepted.totalCents : 0;
  const [amount, setAmount] = useState(centsToInput(start));
  const { busy, error, run } = useAction();
  const save = (e) => {
    e.preventDefault();
    run(async () => {
      const res = await adminApi.patch(`/leads/${lead.id}`, { status: 'won', jobAmountCents: amount.trim() ? toCents(amount) : null });
      onSaved(res.lead);
    });
  };
  return (
    <Modal title="Mark won" onClose={onClose}>
      <form onSubmit={save} className="space-y-3">
        <Field label="Job amount" hint={accepted ? `Filled in from ${accepted.number}. Change it if the final price was different.` : 'What the customer agreed to pay for the job.'}>
          <Input inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
        </Field>
        <ErrorNote error={error} />
        <Button type="submit" disabled={busy} className="w-full">{busy ? 'Saving…' : 'Mark won'}</Button>
      </form>
    </Modal>
  );
}

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
  const setOrganic = (organic) => run(async () => onSaved((await adminApi.patch(`/leads/${lead.id}`, { organic })).lead));
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
        <Field label="Found on Google" hint={lead.organicReason || 'Worked out from the website visit and how they said they heard.'}>
          <Select value={lead.organicManual ? lead.organic : 'auto'} onChange={(e) => setOrganic(e.target.value)} disabled={busy}>
            <option value="auto">{`Automatic: ${ORGANIC[lead.organic] ? ORGANIC[lead.organic].label : 'Not organic Google'}`}</option>
            <option value="search">Google Search</option>
            <option value="gbp">Google Business Profile (Maps)</option>
            <option value="none">Not from Google</option>
          </Select>
        </Field>
        {lead.refCode && (
          <div className="flex flex-wrap gap-1.5">
            <Badge>Ref {lead.refCode}</Badge>
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
  const [markingWon, setMarkingWon] = useState(false);
  const { busy, error: actionError, run } = useAction();

  if (error) return <ErrorNote error={error} />;
  if (!data) return <Spinner />;
  const { lead, quotes } = data;

  const setStatus = (status) => {
    if (status === 'won') return setMarkingWon(true);
    return run(async () => {
      const res = await adminApi.patch(`/leads/${id}`, { status });
      setData({ ...data, lead: res.lead });
    });
  };
  const setOutOfArea = (outOfArea) => run(async () => {
    const res = await adminApi.patch(`/leads/${id}`, { outOfArea });
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
  const setSpam = (spam) => run(async () => {
    const res = await adminApi.post(`/leads/${id}/spam`, { spam });
    setData({ ...data, lead: res.lead });
  });

  return (
    <>
      <PageHeader
        back={{ href: '/admin/leads/', label: 'Leads' }}
        title={lead.name}
        subtitle={`Received ${dateTime(lead.createdAt)} · ${channelLabel(lead.channel) || (lead.source === 'manual' ? 'Added by hand' : 'Quote form')}`}
        actions={lead.isSpam ? (
          <Button onClick={() => setSpam(false)} disabled={busy}>Not spam</Button>
        ) : (
          <>
            {lead.customerId
              ? <Button variant="secondary" href={`/admin/customers/view/?id=${lead.customerId}`}>View customer</Button>
              : <Button variant="secondary" onClick={makeCustomer} disabled={busy}>Save as customer</Button>}
            <Button onClick={makeQuote} disabled={busy}>Create quote</Button>
          </>
        )}
      />
      <ErrorNote error={actionError} />
      {markingWon && (
        <MarkWon
          lead={lead}
          quotes={quotes}
          onClose={() => setMarkingWon(false)}
          onSaved={(saved) => { setMarkingWon(false); setData({ ...data, lead: saved }); }}
        />
      )}
      {lead.outOfArea && !lead.isSpam && (
        <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Marked out of your service area. Nothing was sent to the customer.
        </div>
      )}
      {lead.isSpam && (
        <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-medium">In Spam{lead.spam && lead.spam.by !== 'auto' ? `, marked by ${lead.spam.by}` : ''}{lead.spam && lead.spam.markedAt ? ` on ${dateTime(lead.spam.markedAt)}` : ''}.</p>
          <p className="mt-0.5">
            {lead.spam && lead.spam.by === 'auto' ? `${lead.spam.reason}. ` : ''}
            It stays out of your leads, Home and source numbers. If this is a real customer, choose Not spam.
          </p>
        </div>
      )}
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
            {lead.status === 'won' && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                <span>
                  {typeof lead.jobAmountCents === 'number' ? `Job amount ${money(lead.jobAmountCents)}` : 'No job amount yet'}
                  {lead.wonAt && <span className="block text-xs text-emerald-800">Won {shortDate(lead.wonAt)}</span>}
                </span>
                <button type="button" className="text-sm font-medium underline" onClick={() => setMarkingWon(true)}>{typeof lead.jobAmountCents === 'number' ? 'Edit' : 'Add'}</button>
              </div>
            )}
            <label className="mt-3 flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-slate-300"
                checked={Boolean(lead.outOfArea)}
                disabled={busy}
                onChange={(e) => setOutOfArea(e.target.checked)}
              />
              <span>
                Out of service area
                <span className="block text-xs text-slate-500">Only marks the lead. Nothing is sent to the customer.</span>
              </span>
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {lead.phone && <Button variant="secondary" href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}>Call</Button>}
              {lead.phone && <Button variant="secondary" href={textHref(lead)}>Text</Button>}
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
          {lead.history.length > 0 && (
            <Card title="Change history">
              <ul className="space-y-2">
                {[...lead.history].reverse().map((h, i) => (
                  <li key={i} className="text-sm">
                    <p className="text-slate-900">
                      {h.field === 'Added' ? `Added as ${h.to.toLowerCase()}` : `${h.field}: ${show(h, h.from)} → ${show(h, h.to)}`}
                    </p>
                    <p className="text-xs text-slate-500">{h.by} · {dateTime(h.at)}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {!lead.isSpam && (
            <div className="text-center">
              <Button variant="ghost" onClick={() => setSpam(true)} disabled={busy}>Mark as spam</Button>
              <p className="mt-1 text-xs text-slate-500">For sales pitches and junk. It moves to the Spam folder, where you can bring it back.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function LeadPage() {
  return <Suspense fallback={<Spinner />}><Lead /></Suspense>;
}
