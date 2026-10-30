"use client";
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi } from '../../../../src/admin/api';
import { LEAD_SOURCES, ago, sourceLabel } from '../../../../src/admin/format';
import { Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, Select, Spinner, StatusBadge, Table, Textarea, useAction, useLoad } from '../../../../src/admin/ui';

const TABS = [['open', 'Open'], ['new', 'New'], ['contacted', 'Contacted'], ['quoted', 'Quoted'], ['won', 'Won'], ['lost', 'Lost'], ['', 'All'], ['spam', 'Spam']];

function NewLead({ onClose }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', projectType: '', howDidYouHear: '', sourceDetail: '', message: '' });
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
        <Field label="Name"><Input required value={form.name} onChange={set('name')} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Phone"><Input type="tel" value={form.phone} onChange={set('phone')} /></Field>
          <Field label="Email"><Input type="email" value={form.email} onChange={set('email')} /></Field>
        </div>
        <Field label="Address"><Input value={form.address} onChange={set('address')} /></Field>
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
        <Field label="Details"><Textarea rows={3} value={form.message} onChange={set('message')} /></Field>
        <ErrorNote error={error} />
        <Button type="submit" disabled={busy} className="w-full">{busy ? 'Saving…' : 'Save lead'}</Button>
      </form>
    </Modal>
  );
}

function Leads() {
  const params = useSearchParams();
  const router = useRouter();
  const status = params.get('status') ?? 'open';
  const source = params.get('source') || '';
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(params.get('new') === '1');

  useEffect(() => {
    const t = setTimeout(() => setQuery(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  const [data, error] = useLoad(
    () => adminApi.get(`/leads?status=${encodeURIComponent(status)}&source=${encodeURIComponent(source)}&q=${encodeURIComponent(query)}`),
    [status, source, query],
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
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-1 flex gap-1 overflow-x-auto">
            {TABS.map(([value, label]) => (
              <Link
                key={value}
                href={`/admin/leads/?status=${value}${source ? `&source=${encodeURIComponent(source)}` : ''}`}
                className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap no-underline ${status === value ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {label}
                {value === 'spam' && data && data.spamCount > 0 && <span className="ml-1 text-xs opacity-70">{data.spamCount}</span>}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={source} onChange={(e) => router.replace(`/admin/leads/?status=${status}${e.target.value ? `&source=${encodeURIComponent(e.target.value)}` : ''}`)} aria-label="Filter by source" className="sm:w-44">
              <option value="">Every source</option>
              {LEAD_SOURCES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              <option value="none">Not recorded</option>
            </Select>
            <Input type="search" placeholder="Search name, phone, address…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" aria-label="Search leads" />
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
                </td>
                <td className="hidden px-4 py-3 text-slate-700 sm:table-cell">{l.projectType}</td>
                <td className="hidden px-4 py-3 text-slate-700 md:table-cell">
                  {sourceLabel(l.howDidYouHear)}
                  {l.sourceDetail && <span className="block text-xs text-slate-500">{l.sourceDetail}</span>}
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
