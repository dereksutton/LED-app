"use client";
import { useState } from 'react';
import { adminApi } from './api';
import { Button, ErrorNote, Field, Input, Modal, Spinner, useAction, useLoad } from './ui';

// Pick a customer for a new quote, invoice or contract, or add one.
export default function CustomerPicker({ title, onPick, onClose }) {
  const [q, setQ] = useState('');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [data, error] = useLoad(() => adminApi.get(`/customers?q=${encodeURIComponent(q.trim())}`), [q]);
  const { busy, error: saveError, run } = useAction();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const add = (e) => {
    e.preventDefault();
    run(async () => {
      const { customer } = await adminApi.post('/customers', form);
      await onPick(customer);
    });
  };

  return (
    <Modal title={title} onClose={onClose}>
      {adding ? (
        <form onSubmit={add} className="space-y-3">
          <Field label="Name"><Input required value={form.name} onChange={set('name')} /></Field>
          <Field label="Email" hint="Needed to email quotes, invoices and contracts."><Input type="email" value={form.email} onChange={set('email')} /></Field>
          <Field label="Phone"><Input type="tel" value={form.phone} onChange={set('phone')} /></Field>
          <Field label="Job address"><Input value={form.address} onChange={set('address')} /></Field>
          <ErrorNote error={saveError} />
          <div className="flex gap-2">
            <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Add and continue'}</Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>Back</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <Input type="search" autoFocus placeholder="Search customers" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search customers" />
          <ErrorNote error={error || saveError} />
          {!data && !error && <Spinner />}
          {data && (
            <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
              {data.customers.map((c) => (
                <li key={c.id}>
                  <button type="button" disabled={busy} onClick={() => run(() => onPick(c))} className="w-full px-1 py-2.5 text-left hover:bg-slate-50">
                    <span className="block font-medium text-slate-900">{c.name}</span>
                    <span className="block text-xs text-slate-500">{[c.email, c.phone].filter(Boolean).join(' · ')}</span>
                  </button>
                </li>
              ))}
              {!data.customers.length && <li className="py-3 text-sm text-slate-500">No customers found.</li>}
            </ul>
          )}
          <Button variant="secondary" onClick={() => setAdding(true)} className="w-full">+ New customer</Button>
        </div>
      )}
    </Modal>
  );
}
