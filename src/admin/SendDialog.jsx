"use client";
import { useState } from 'react';
import { adminApi } from './api';
import { Button, ErrorNote, Field, Modal, Textarea, useAction } from './ui';

const NOUN = { quote: 'estimate', invoice: 'invoice', contract: 'contract' };

// Emails the document to the customer, or marks it sent and copies the
// link so the owner can text it.
export default function SendDialog({ kind, doc, customer, onDone, onClose, beforeSend }) {
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState('');
  const { busy, error, run } = useAction();

  const send = () => run(async () => {
    if (beforeSend) await beforeSend();
    const res = await adminApi.post(`/${kind}s/${doc.id}/send`, { message });
    onDone(res, `Emailed to ${customer.email}.`);
  });

  const copy = () => run(async () => {
    if (beforeSend) await beforeSend();
    const res = await adminApi.post(`/${kind}s/${doc.id}/mark-sent`, {});
    try {
      await navigator.clipboard.writeText(res.link);
      setCopied(res.link);
    } catch {
      setCopied(res.link);
    }
    onDone(res, 'Link copied. Paste it into a text to the customer.', true);
  });

  return (
    <Modal title={`Send ${NOUN[kind]} ${doc.number}`} onClose={onClose}>
      <div className="space-y-4">
        {customer.email ? (
          <p className="text-sm text-slate-700">
            This emails <strong>{customer.name}</strong> at <strong>{customer.email}</strong> with a link to view
            {kind === 'quote' ? ' and accept' : kind === 'contract' ? ' and sign' : ''} it, plus a PDF copy.
          </p>
        ) : (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">This customer has no email address. Add one on their page, or copy the link and text it.</p>
        )}
        {kind === 'contract' && <p className="text-sm text-slate-500">Once sent, the contract text is locked so the customer signs exactly what you sent.</p>}
        {customer.email && (
          <Field label="Message (optional)" hint="Leave blank for a short standard note.">
            <Textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Hi ${customer.name.split(' ')[0]}, thanks for having us out…`} />
          </Field>
        )}
        <ErrorNote error={error} />
        {copied && <p className="break-all rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Copied: {copied}</p>}
        <div className="flex flex-col gap-2 sm:flex-row">
          {customer.email && <Button onClick={send} disabled={busy} className="flex-1">{busy ? 'Sending…' : `Email to ${customer.name.split(' ')[0]}`}</Button>}
          <Button variant="secondary" onClick={copy} disabled={busy} className="flex-1">Copy link instead</Button>
        </div>
      </div>
    </Modal>
  );
}
