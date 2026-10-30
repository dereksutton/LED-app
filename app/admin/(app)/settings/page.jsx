"use client";
import { useState } from 'react';
import { adminApi } from '../../../../src/admin/api';
import { Button, Card, ErrorNote, Field, Input, Notice, PageHeader, Spinner, Textarea, useAction, useLoad } from '../../../../src/admin/ui';

const PLACEHOLDERS = ['{{customerName}}', '{{customerAddress}}', '{{businessName}}', '{{date}}', '{{quoteNumber}}', '{{scope}}', '{{total}}', '{{deposit}}'];

function PasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [done, setDone] = useState('');
  const { busy, error, run } = useAction();
  const save = (e) => {
    e.preventDefault();
    setDone('');
    run(async () => {
      await adminApi.post('/account/password', { currentPassword: current, newPassword: next });
      setCurrent('');
      setNext('');
      setDone('Password changed. Other devices were signed out.');
    });
  };
  return (
    <form onSubmit={save} className="space-y-3">
      <Field label="Current password"><Input type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} /></Field>
      <Field label="New password" hint="At least 12 characters. A short phrase works well."><Input type="password" autoComplete="new-password" required minLength={12} value={next} onChange={(e) => setNext(e.target.value)} /></Field>
      <ErrorNote error={error} />
      <Notice>{done}</Notice>
      <Button type="submit" variant="secondary" disabled={busy}>Change password</Button>
    </form>
  );
}

export default function SettingsPage() {
  const [data, error] = useLoad(() => adminApi.get('/settings'));
  if (error) return <ErrorNote error={error} />;
  if (!data) return <Spinner />;
  return <SettingsForm data={data} />;
}

function SettingsForm({ data }) {
  const [form, setForm] = useState(() => {
    const s = data.settings;
    return {
      ...s,
      defaultTaxRate: String(s.defaultTaxRate ?? 0),
      defaultDepositPercent: String(s.defaultDepositPercent ?? 0),
      quoteValidDays: String(s.quoteValidDays ?? 30),
      invoiceDueDays: String(s.invoiceDueDays ?? 14),
    };
  });
  const [saved, setSaved] = useState('');
  const { busy, error: saveError, run } = useAction();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const save = (e) => {
    e.preventDefault();
    setSaved('');
    run(async () => {
      await adminApi.put('/settings', {
        businessName: form.businessName, phone: form.phone, email: form.email, address: form.address, license: form.license,
        defaultTaxRate: Number(form.defaultTaxRate) || 0,
        defaultDepositPercent: Number(form.defaultDepositPercent) || 0,
        quoteValidDays: Number(form.quoteValidDays) || 30,
        invoiceDueDays: Number(form.invoiceDueDays) || 0,
        quoteTerms: form.quoteTerms || '', invoiceTerms: form.invoiceTerms || '',
        paymentInstructions: form.paymentInstructions || '', contractTemplate: form.contractTemplate || '',
      });
      setSaved('Settings saved. New quotes, invoices and contracts will use them.');
    });
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="What shows on your quotes, invoices and contracts." />
      <form onSubmit={save} className="space-y-5">
        <Card title="Business details">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Business name"><Input required value={form.businessName || ''} onChange={set('businessName')} /></Field>
            <Field label="Phone"><Input value={form.phone || ''} onChange={set('phone')} /></Field>
            <Field label="Email shown on documents"><Input type="email" value={form.email || ''} onChange={set('email')} /></Field>
            <Field label="License number"><Input value={form.license || ''} onChange={set('license')} /></Field>
            <Field label="Address" className="sm:col-span-2"><Input value={form.address || ''} onChange={set('address')} /></Field>
          </div>
        </Card>
        <Card title="Defaults">
          <div className="grid gap-3 sm:grid-cols-4">
            <Field label="Tax (%)"><Input inputMode="decimal" value={form.defaultTaxRate} onChange={set('defaultTaxRate')} /></Field>
            <Field label="Deposit (%)"><Input inputMode="decimal" value={form.defaultDepositPercent} onChange={set('defaultDepositPercent')} /></Field>
            <Field label="Quotes valid for (days)"><Input inputMode="numeric" value={form.quoteValidDays} onChange={set('quoteValidDays')} /></Field>
            <Field label="Invoices due in (days)"><Input inputMode="numeric" value={form.invoiceDueDays} onChange={set('invoiceDueDays')} /></Field>
          </div>
        </Card>
        <Card title="Standard wording">
          <div className="space-y-3">
            <Field label="Quote terms"><Textarea rows={4} value={form.quoteTerms || ''} onChange={set('quoteTerms')} /></Field>
            <Field label="Invoice terms"><Textarea rows={2} value={form.invoiceTerms || ''} onChange={set('invoiceTerms')} /></Field>
            <Field label="How to pay" hint="Shown on every invoice."><Textarea rows={2} value={form.paymentInstructions || ''} onChange={set('paymentInstructions')} /></Field>
          </div>
        </Card>
        <Card title="Contract template">
          <p className="mb-3 text-sm text-slate-600">
            New contracts start from this text. These words fill in automatically: {PLACEHOLDERS.join(', ')}.
            This is a starting point, not legal advice. Have a Florida attorney review it before you rely on it.
          </p>
          <Textarea rows={22} value={form.contractTemplate || ''} onChange={set('contractTemplate')} className="font-mono text-sm leading-relaxed" aria-label="Contract template" />
        </Card>
        <div className="sticky bottom-0 -mx-4 flex flex-col gap-2 border-t border-slate-200 bg-slate-50/95 px-4 py-3 sm:flex-row sm:items-center">
          <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</Button>
          <ErrorNote error={saveError} />
          <Notice>{saved}</Notice>
        </div>
      </form>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card title="Your password"><PasswordForm /></Card>
        <Card title="Online card payments">
          {data.stripeEnabled
            ? <p className="text-sm text-slate-700">On. Customers see a Pay by card button on their invoices, and payments are recorded here automatically.</p>
            : <p className="text-sm text-slate-700">Off. Once you have a Stripe account, your web person adds its keys to the server and a Pay by card button appears on invoices. Until then, record cash, check and Zelle payments on each invoice.</p>}
        </Card>
      </div>
    </>
  );
}
