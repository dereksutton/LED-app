"use client";
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi } from '../../../../src/admin/api';
import { ago } from '../../../../src/admin/format';
import { Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, Spinner, StatusBadge, Table, Textarea, useAction, useLoad } from '../../../../src/admin/ui';

const TABS = [['open', 'Open'], ['new', 'New'], ['contacted', 'Contacted'], ['quoted', 'Quoted'], ['won', 'Won'], ['lost', 'Lost'], ['', 'All']];

function NewLead({ onClose }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', projectType: '', message: '' });
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
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(params.get('new') === '1');

  useEffect(() => {
    const t = setTimeout(() => setQuery(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  const [data, error] = useLoad(
    () => adminApi.get(`/leads?status=${encodeURIComponent(status)}&q=${encodeURIComponent(query)}`),
    [status, query],
  );

  return (
    <>
      <PageHeader title="Leads" subtitle="Quote requests from the website, plus any you add." actions={<Button onClick={() => setAdding(true)}>Add a lead</Button>} />
      {adding && <NewLead onClose={() => { setAdding(false); router.replace(`/admin/leads/?status=${status}`); }} />}
      <Card>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-1 flex gap-1 overflow-x-auto">
            {TABS.map(([value, label]) => (
              <Link
                key={value}
                href={`/admin/leads/?status=${value}`}
                className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap no-underline ${status === value ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {label}
              </Link>
            ))}
          </div>
          <Input type="search" placeholder="Search name, phone, address…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" aria-label="Search leads" />
        </div>
        <ErrorNote error={error} />
        {!data && !error && <Spinner />}
        {data && (data.leads.length ? (
          <Table head={['Name', { label: 'Project', className: 'hidden sm:table-cell' }, { label: 'Area', className: 'hidden md:table-cell' }, 'Received', 'Status']}>
            {data.leads.map((l) => (
              <tr key={l.id} className="cursor-pointer hover:bg-slate-50" onClick={() => router.push(`/admin/leads/view/?id=${l.id}`)}>
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/view/?id=${l.id}`} className="font-medium text-slate-900 no-underline" onClick={(e) => e.stopPropagation()}>{l.name}</Link>
                  <span className="block text-xs text-slate-500">{l.phone}</span>
                </td>
                <td className="hidden px-4 py-3 text-slate-700 sm:table-cell">{l.projectType}</td>
                <td className="hidden px-4 py-3 text-slate-700 md:table-cell">{l.address}</td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{ago(l.createdAt)}</td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
              </tr>
            ))}
          </Table>
        ) : <Empty>No leads here.</Empty>)}
      </Card>
    </>
  );
}

export default function LeadsPage() {
  return <Suspense fallback={<Spinner />}><Leads /></Suspense>;
}
