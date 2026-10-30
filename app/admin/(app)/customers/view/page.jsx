"use client";
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi } from '../../../../../src/admin/api';
import { money, shortDate } from '../../../../../src/admin/format';
import { Button, Card, ErrorNote, Field, Input, Notice, PageHeader, Spinner, StatusBadge, Textarea, useAction, useLoad } from '../../../../../src/admin/ui';

function DocLinks({ kind, docs, amount }) {
  if (!docs.length) return <p className="text-sm text-slate-500">None yet.</p>;
  return (
    <ul className="divide-y divide-slate-100">
      {docs.map((d) => (
        <li key={d.id}>
          <Link href={`/admin/${kind}s/edit/?id=${d.id}`} className="flex items-center justify-between gap-2 py-2 no-underline">
            <span className="min-w-0 text-sm">
              <span className="font-medium text-slate-900">{d.number}</span>
              <span className="text-slate-500"> · {shortDate(d.createdAt)}{amount ? ` · ${amount(d)}` : ''}</span>
            </span>
            <StatusBadge status={d.displayStatus || d.status} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Customer() {
  const id = useSearchParams().get('id');
  const [data, error, reload, , version] = useLoad(() => adminApi.get(`/customers/${id}`), [id]);
  const [saved, setSaved] = useState('');
  if (error) return <ErrorNote error={error} />;
  if (!data) return <Spinner />;
  return <CustomerView key={version} id={id} data={data} reload={reload} saved={saved} setSaved={setSaved} />;
}

function CustomerView({ id, data, reload, saved, setSaved }) {
  const router = useRouter();
  const [form, setForm] = useState(() => ({ name: data.customer.name || '', email: data.customer.email || '', phone: data.customer.phone || '', address: data.customer.address || '', notes: data.customer.notes || '' }));
  const { busy, error: actionError, run } = useAction();
  const { customer } = data;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = (e) => {
    e.preventDefault();
    setSaved('');
    run(async () => {
      await adminApi.patch(`/customers/${id}`, form);
      setSaved('Saved.');
      reload();
    });
  };
  const create = (kind) => run(async () => {
    const res = await adminApi.post(`/${kind}s`, { customerId: id });
    router.push(`/admin/${kind}s/edit/?id=${res[kind].id}`);
  });
  const remove = () => {
    if (!window.confirm(`Delete ${customer.name}?`)) return;
    run(async () => {
      await adminApi.del(`/customers/${id}`);
      router.push('/admin/customers/');
    });
  };
  const owed = data.invoices.filter((i) => !['draft', 'void'].includes(i.status)).reduce((s, i) => s + i.balanceCents, 0);

  return (
    <>
      <PageHeader
        back={{ href: '/admin/customers/', label: 'Customers' }}
        title={customer.name}
        subtitle={owed ? `${money(owed)} owed` : undefined}
        actions={(
          <>
            <Button variant="secondary" onClick={() => create('invoice')} disabled={busy}>New invoice</Button>
            <Button variant="secondary" onClick={() => create('contract')} disabled={busy}>New contract</Button>
            <Button onClick={() => create('quote')} disabled={busy}>New quote</Button>
          </>
        )}
      />
      <ErrorNote error={actionError} />
      <div className="mt-4 grid gap-5 lg:grid-cols-3">
        <Card title="Details" className="lg:col-span-1">
          <form onSubmit={save} className="space-y-3">
            <Field label="Name"><Input required value={form.name} onChange={set('name')} /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={set('email')} /></Field>
            <Field label="Phone"><Input type="tel" value={form.phone} onChange={set('phone')} /></Field>
            <Field label="Job address"><Input value={form.address} onChange={set('address')} /></Field>
            <Field label="Notes"><Textarea rows={3} value={form.notes} onChange={set('notes')} /></Field>
            <Notice>{saved}</Notice>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={busy}>Save</Button>
              {customer.phone && <Button variant="secondary" href={`tel:${customer.phone.replace(/[^\d+]/g, '')}`}>Call</Button>}
              {customer.email && <Button variant="secondary" href={`mailto:${customer.email}`}>Email</Button>}
            </div>
          </form>
        </Card>
        <div className="space-y-5 lg:col-span-2">
          <Card title="Quotes"><DocLinks kind="quote" docs={data.quotes} amount={(d) => money(d.totalCents)} /></Card>
          <Card title="Invoices"><DocLinks kind="invoice" docs={data.invoices} amount={(d) => money(d.totalCents)} /></Card>
          <Card title="Contracts"><DocLinks kind="contract" docs={data.contracts} /></Card>
          {data.leads.length > 0 && (
            <Card title="Leads">
              <ul className="divide-y divide-slate-100">
                {data.leads.map((l) => (
                  <li key={l.id}>
                    <Link href={`/admin/leads/view/?id=${l.id}`} className="flex items-center justify-between py-2 text-sm no-underline">
                      <span className="text-slate-900">{l.projectType || 'Lead'} · {shortDate(l.createdAt)}</span>
                      <StatusBadge status={l.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {!data.quotes.length && !data.invoices.length && !data.contracts.length && (
            <Button variant="danger" onClick={remove} disabled={busy}>Delete customer</Button>
          )}
        </div>
      </div>
    </>
  );
}

export default function CustomerPage() {
  return <Suspense fallback={<Spinner />}><Customer /></Suspense>;
}
