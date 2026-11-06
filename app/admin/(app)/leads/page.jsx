"use client";
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi } from '../../../../src/admin/api';
import { LEAD_SOURCES, ORGANIC, ago, channelLabel, sourceLabel } from '../../../../src/admin/format';
import { Badge, Button, Card, Empty, ErrorNote, Field, FilterTabs, Input, Modal, PageHeader, Select, Spinner, StatusBadge, Table, Textarea, useAction, useLoad } from '../../../../src/admin/ui';

const TABS = [['open', 'Open'], ['new', 'New'], ['contacted', 'Contacted'], ['quoted', 'Quoted'], ['won', 'Won'], ['lost', 'Lost'], ['', 'All'], ['spam', 'Spam']];

const time = (d) => new Date(d).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });

// Call and Text taps on the site in the last 15 minutes, so a call or text
// that just came in can be tied to the visit it came from.
function RecentTaps({ kind, value, onChange }) {
  const [data] = useLoad(() => adminApi.get(`/contact-intents?kind=${kind}&minutes=15`), [kind]);
  if (!data || !data.intents.length) return null;
  return (
    <fieldset className="rounded-lg border border-slate-200 p-3">
      <legend className="px-1 text-sm font-medium text-slate-700">{kind === 'call' ? 'Call' : 'Text'} taps on the website in the last 15 minutes</legend>
      <p className="mb-2 text-xs text-slate-500">If one of these is this person, pick it so the lead keeps where they found you.</p>
      <div className="space-y-1.5">
        {data.intents.map((i) => (
          <label key={i.id} className="flex items-center gap-2 text-sm text-slate-800">
            <input type="radio" name="intent" checked={value === i.id} onChange={() => onChange(i.id)} />
            <span>{time(i.createdAt)}{i.page ? ` on ${i.page}` : ''}{i.refCode ? ` · Ref ${i.refCode}` : ''}{i.organic !== 'none' ? ` · ${ORGANIC[i.organic].label}` : ''}</span>
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm text-slate-800">
          <input type="radio" name="intent" checked={!value} onChange={() => onChange('')} />
          <span>None of these</span>
        </label>
      </div>
    </fieldset>
  );
}

function NewLead({ onClose }) {
  const router = useRouter();
  const [form, setForm] = useState({ channel: 'call', name: '', phone: '', email: '', address: '', zip: '', projectType: '', howDidYouHear: '', sourceDetail: '', refCode: '', intentId: '', message: '' });
  const { busy, error, run } = useAction();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const save = (e) => {
    e.preventDefault();
    run(async () => {
      const { lead } = await adminApi.post('/leads', form);
      router.push(`/admin/leads/view/?id=${lead.id}`);
    });
  };
  return (
    <Modal title="Add a lead" onClose={onClose}>
      <form onSubmit={save} className="space-y-3">
        <p className="text-sm text-slate-500">For a call, text or referral that didn&apos;t come through the website.</p>
        <Field label="How did they reach you?">
          <Select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value, intentId: '' })}>
            <option value="call">Phone call</option>
            <option value="text">Text</option>
            <option value="manual">Other (in person, referral, email)</option>
          </Select>
        </Field>
        {form.channel !== 'manual' && <RecentTaps kind={form.channel} value={form.intentId} onChange={(intentId) => setForm({ ...form, intentId })} />}
        <Field label="Name"><Input required value={form.name} onChange={set('name')} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Phone"><Input type="tel" value={form.phone} onChange={set('phone')} /></Field>
          <Field label="Email"><Input type="email" value={form.email} onChange={set('email')} /></Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
          <Field label="Address"><Input value={form.address} onChange={set('address')} /></Field>
          <Field label="ZIP"><Input inputMode="numeric" maxLength={10} value={form.zip} onChange={set('zip')} /></Field>
        </div>
        <Field label="Project"><Input placeholder="e.g. Interior painting" value={form.projectType} onChange={set('projectType')} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="How they heard about you">
            <Select value={form.howDidYouHear} onChange={set('howDidYouHear')}>
              <option value="">Choose one</option>
              {LEAD_SOURCES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </Select>
          </Field>
          <Field label="Referred by, or where"><Input value={form.sourceDetail} onChange={set('sourceDetail')} /></Field>
        </div>
        {form.channel === 'text' && !form.intentId && (
          <Field label="Ref code" hint="Texts from the website's Text us button end with a code like “Ref K7F3”. Copy it here.">
            <Input value={form.refCode} onChange={set('refCode')} maxLength={12} autoCapitalize="characters" />
          </Field>
        )}
        <Field label="Details"><Textarea rows={3} value={form.message} onChange={set('message')} /></Field>
        <ErrorNote error={error} />
        <Button type="submit" disabled={busy} className="w-full">{busy ? 'Saving…' : 'Save lead'}</Button>
      </form>
    </Modal>
  );
}

// Small tags under the source: found on Google, how it came in (when not
// the quote form) and whether the owner marked it out of the service area.
function SourceTags({ lead }) {
  const o = ORGANIC[lead.organic];
  const tags = [
    o && o.short && <Badge key="o" tone={o.tone} title={lead.organicReason}>{o.short}</Badge>,
    lead.channel && lead.channel !== 'form' && <Badge key="c">{channelLabel(lead.channel)}</Badge>,
    lead.outOfArea && <Badge key="z" tone="amber">Out of area</Badge>,
  ].filter(Boolean);
  return tags.length ? <span className="mt-1 flex flex-wrap gap-1">{tags}</span> : null;
}

function Leads() {
  const params = useSearchParams();
  const router = useRouter();
  const status = params.get('status') ?? 'open';
  const source = params.get('source') || '';
  const organic = params.get('organic') || '';
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(params.get('new') === '1');

  useEffect(() => {
    const t = setTimeout(() => setQuery(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  const [data, error] = useLoad(
    () => adminApi.get(`/leads?status=${encodeURIComponent(status)}&source=${encodeURIComponent(source)}&organic=${encodeURIComponent(organic)}&q=${encodeURIComponent(query)}`),
    [status, source, organic, query],
  );

  return (
    <>
      <PageHeader
        title={status === 'spam' ? 'Spam' : 'Leads'}
        subtitle={status === 'spam'
          ? 'Sales pitches and junk from the quote form. They stay out of your leads and numbers. Open one and choose Not spam to move it back.'
          : 'Quote requests from the website, plus any you add.'}
        actions={<Button onClick={() => setAdding(true)}>Add a lead</Button>}
      />
      {adding && <NewLead onClose={() => { setAdding(false); router.replace(`/admin/leads/?status=${status}`); }} />}
      <Card>
        {/* Phones: status and source dropdowns side by side, search under them. */}
        <div className="mb-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
          <FilterTabs
            tabs={TABS.map(([value, label]) => [value, label, value === 'spam' && data ? data.spamCount : 0])}
            value={status}
            hrefFor={(value) => `/admin/leads/?status=${value}${source ? `&source=${encodeURIComponent(source)}` : ''}${organic ? `&organic=${organic}` : ''}`}
            label="Show leads"
            className="sm:-mx-1"
          />
          <div className="contents sm:flex sm:gap-2">
            <Select
              value={organic ? `organic:${organic}` : source}
              onChange={(e) => {
                const v = e.target.value;
                const filter = v.startsWith('organic:') ? `&organic=${v.slice(8)}` : v ? `&source=${encodeURIComponent(v)}` : '';
                router.replace(`/admin/leads/?status=${status}${filter}`);
              }}
              aria-label="Filter by source"
              className="sm:w-44"
            >
              <option value="">Every source</option>
              <optgroup label="How they said they heard">
                {LEAD_SOURCES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                <option value="none">Not recorded</option>
              </optgroup>
              <optgroup label="Tracked">
                <option value="organic:google">Found on Google (search or Maps)</option>
                <option value="organic:search">Google Search</option>
                <option value="organic:gbp">Google Business Profile</option>
              </optgroup>
            </Select>
            <Input type="search" placeholder="Search name, phone, address…" value={q} onChange={(e) => setQ(e.target.value)} className="col-span-2 sm:max-w-xs" aria-label="Search leads" />
          </div>
        </div>
        <ErrorNote error={error} />
        {!data && !error && <Spinner />}
        {data && (data.leads.length ? (
          <Table head={['Name', { label: 'Project', className: 'hidden sm:table-cell' }, { label: 'Source', className: 'hidden md:table-cell' }, 'Received', 'Status']}>
            {data.leads.map((l) => (
              <tr key={l.id} className="cursor-pointer hover:bg-slate-50" onClick={() => router.push(`/admin/leads/view/?id=${l.id}`)}>
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/view/?id=${l.id}`} className="font-medium text-slate-900 no-underline" onClick={(e) => e.stopPropagation()}>{l.name}</Link>
                  <span className="block text-xs text-slate-500">{status === 'spam' && l.spam ? (l.spam.by === 'auto' ? l.spam.reason : `Marked by ${l.spam.by}`) : l.phone}</span>
                  <span className="md:hidden"><SourceTags lead={l} /></span>
                </td>
                <td className="hidden px-4 py-3 text-slate-700 sm:table-cell">{l.projectType}</td>
                <td className="hidden px-4 py-3 text-slate-700 md:table-cell">
                  {sourceLabel(l.howDidYouHear)}
                  {l.sourceDetail && <span className="block text-xs text-slate-500">{l.sourceDetail}</span>}
                  <SourceTags lead={l} />
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{ago(l.createdAt)}</td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
              </tr>
            ))}
          </Table>
        ) : <Empty>{status === 'spam' ? 'No spam. Anything that looks like a sales pitch lands here.' : 'No leads here.'}</Empty>)}
      </Card>
    </>
  );
}

export default function LeadsPage() {
  return <Suspense fallback={<Spinner />}><Leads /></Suspense>;
}
