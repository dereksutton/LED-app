"use client";
import { useState } from 'react';
import { adminApi } from './api';
import { NO_LEAD_REASONS, ORGANIC, ago } from './format';
import { Badge, Button, ErrorNote, Field, Input, Modal, Select, Spinner, useAction, useLoad } from './ui';

// Which lead a quote is for, or why it has none. onPick gets { leadId } or
// { noLeadReason, noLeadNote }.
export default function LeadPicker({ title = 'Which lead is this quote for?', customer, onPick, onClose }) {
  const [q, setQ] = useState(() => (customer && (customer.phone || customer.name)) || '');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [data, error] = useLoad(() => adminApi.get(`/leads?status=&q=${encodeURIComponent(q.trim())}`), [q]);
  const { busy, error: pickError, run } = useAction();

  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-sm text-slate-500">Every quote names the lead it came from, so you can see which leads turn into jobs.</p>
        <Input type="search" autoFocus placeholder="Search leads by name or phone" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search leads" />
        <ErrorNote error={error || pickError} />
        {!data && !error && <Spinner />}
        {data && (
          <ul className="max-h-60 divide-y divide-slate-100 overflow-y-auto">
            {data.leads.slice(0, 20).map((l) => (
              <li key={l.id}>
                <button type="button" disabled={busy} onClick={() => run(() => onPick({ leadId: l.id }))} className="w-full px-1 py-2.5 text-left hover:bg-slate-50">
                  <span className="flex items-center gap-2 font-medium text-slate-900">
                    {l.name}
                    {ORGANIC[l.organic] && ORGANIC[l.organic].short && <Badge tone="green">{ORGANIC[l.organic].short}</Badge>}
                  </span>
                  <span className="block text-xs text-slate-500">{[l.phone, l.projectType, ago(l.createdAt)].filter(Boolean).join(' · ')}</span>
                </button>
              </li>
            ))}
            {!data.leads.length && <li className="py-3 text-sm text-slate-500">No leads found.</li>}
          </ul>
        )}
        <form
          className="space-y-3 border-t border-slate-100 pt-3"
          onSubmit={(e) => { e.preventDefault(); run(() => onPick({ noLeadReason: reason, noLeadNote: note })); }}
        >
          <Field label="No lead? Say why">
            <Select required value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">Choose one</option>
              {NO_LEAD_REASONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </Select>
          </Field>
          {reason && <Field label="Note (optional)"><Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. referred by the Smiths" /></Field>}
          <Button type="submit" variant="secondary" disabled={busy || !reason} className="w-full">Continue without a lead</Button>
        </form>
      </div>
    </Modal>
  );
}
