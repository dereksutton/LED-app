"use client";
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi, pdfUrl } from '../../../../../src/admin/api';
import DocHistory from '../../../../../src/admin/DocHistory';
import { dateTime } from '../../../../../src/admin/format';
import SendDialog from '../../../../../src/admin/SendDialog';
import { Button, Card, ErrorNote, Field, Input, Notice, PageHeader, Spinner, StatusBadge, Textarea, useAction, useLoad } from '../../../../../src/admin/ui';

function Contract() {
  const id = useSearchParams().get('id');
  const [data, error, reload, , version] = useLoad(() => adminApi.get(`/contracts/${id}`), [id]);
  const [notice, setNotice] = useState('');
  if (error) return <ErrorNote error={error} />;
  if (!data) return <Spinner />;
  return <ContractEditor key={version} id={id} data={data} reload={reload} notice={notice} setNotice={setNotice} />;
}

function ContractEditor({ id, data, reload, notice, setNotice }) {
  const router = useRouter();
  const [form, setForm] = useState(() => ({ title: data.contract.title || '', body: data.contract.body || '' }));
  const [dirty, setDirty] = useState(false);
  const [sending, setSending] = useState(false);
  const { busy, error: actionError, run } = useAction();
  const { contract, customer, quote, link } = data;
  const editable = contract.status === 'draft';
  const sig = contract.signature || {};
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setDirty(true); };
  const save = async () => { await adminApi.patch(`/contracts/${id}`, form); setDirty(false); };
  const go = (fn) => run(async () => router.push(await fn()));

  return (
    <>
      <PageHeader
        back={{ href: '/admin/contracts/', label: 'Contracts' }}
        title={`Contract ${contract.number}`}
        subtitle={customer ? <>For <Link href={`/admin/customers/view/?id=${customer.id}`}>{customer.name}</Link>{quote && <> · from <Link href={`/admin/quotes/edit/?id=${quote.id}`}>quote {quote.number}</Link></>}</> : null}
        actions={(
          <>
            <StatusBadge status={contract.status} />
            <Button variant="secondary" href={pdfUrl('contract', contract.id)} target="_blank" rel="noopener">{contract.status === 'signed' ? 'Signed PDF' : 'PDF'}</Button>
            {editable && <Button variant="secondary" onClick={() => run(async () => { await save(); setNotice('Saved.'); reload(); })} disabled={busy || !dirty}>{dirty ? 'Save' : 'Saved'}</Button>}
            {['draft', 'sent', 'viewed'].includes(contract.status) && <Button onClick={() => setSending(true)} disabled={busy}>{editable ? 'Send for signature' : 'Send again'}</Button>}
          </>
        )}
      />
      {sending && (
        <SendDialog
          kind="contract" doc={contract} customer={customer}
          beforeSend={dirty ? save : undefined}
          onClose={() => setSending(false)}
          onDone={(res, message, keepOpen) => { setNotice(message); if (!keepOpen) setSending(false); reload(); }}
        />
      )}
      <div className="space-y-3">
        <ErrorNote error={actionError} />
        <Notice>{notice}</Notice>
        {contract.status === 'signed' && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Signed by {sig.name} on {dateTime(sig.signedAt)}.</p>
        )}
        {!editable && contract.status !== 'signed' && contract.status !== 'void' && (
          <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">Sent contracts are locked so the customer signs exactly what you sent. To change it, void it and make a new copy.</p>
        )}
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title="Contract">
            <div className="space-y-3">
              <Field label="Title"><Input value={form.title} onChange={set('title')} disabled={!editable} /></Field>
              <Field label="Text" hint={editable ? 'Filled in from your template in Settings. Edit anything before sending.' : undefined}>
                <Textarea rows={24} value={form.body} onChange={set('body')} disabled={!editable} className="font-mono text-sm leading-relaxed" />
              </Field>
            </div>
          </Card>
        </div>
        <div className="space-y-5">
          {contract.status === 'signed' && (
            <Card title="Signature">
              {sig.imageDataUrl && <img src={sig.imageDataUrl} alt={`Signature of ${sig.name}`} className="mb-2 max-h-24 rounded border border-slate-200 bg-white" />}
              <dl className="space-y-1 text-xs text-slate-600">
                <div><dt className="inline font-medium">Name: </dt><dd className="inline">{sig.name}</dd></div>
                <div><dt className="inline font-medium">Signed: </dt><dd className="inline">{dateTime(sig.signedAt)}</dd></div>
                <div><dt className="inline font-medium">IP: </dt><dd className="inline">{sig.ip}</dd></div>
                <div className="break-all"><dt className="inline font-medium">Fingerprint: </dt><dd className="inline font-mono">{sig.bodyHash}</dd></div>
              </dl>
            </Card>
          )}
          <Card title="More">
            <div className="flex flex-col gap-2">
              <Button variant="ghost" onClick={() => go(async () => `/admin/contracts/edit/?id=${(await adminApi.post(`/contracts/${id}/duplicate`)).contract.id}`)} disabled={busy}>Make a copy</Button>
              {editable && <Button variant="danger" onClick={() => window.confirm('Delete this draft contract?') && go(async () => { await adminApi.del(`/contracts/${id}`); return '/admin/contracts/'; })} disabled={busy}>Delete draft</Button>}
              {['sent', 'viewed'].includes(contract.status) && (
                <Button variant="danger" onClick={() => window.confirm('Void this contract? Its link will stop accepting signatures.') && run(async () => { await adminApi.post(`/contracts/${id}/void`); setNotice('Contract voided.'); reload(); })} disabled={busy}>Void contract</Button>
              )}
            </div>
            {link && <p className="mt-3 break-all text-xs text-slate-500">Customer link: <a href={link} target="_blank" rel="noopener noreferrer">{link}</a></p>}
          </Card>
          <Card title="History"><DocHistory history={contract.history} /></Card>
        </div>
      </div>
    </>
  );
}

export default function ContractPage() {
  return <Suspense fallback={<Spinner />}><Contract /></Suspense>;
}
