"use client";
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../../src/admin/api';
import { Button, ErrorNote, Field, Input, Notice } from '../../../src/admin/ui';

function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(null); // { channel, to, canText } once a code is on its way
  const [note, setNote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // Only ever go back to a dashboard page after signing in.
  const next = () => {
    const n = params.get('next') || '';
    return n.startsWith('/admin/') && !n.startsWith('//') ? n : '/admin/';
  };

  const send = async (body) => {
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const data = await api('/admin/login', { method: 'POST', body: { email, password, ...body } });
      if (data.user) {
        window.location.assign(next());
        return;
      }
      if (data.step === 'code') {
        setSent({ channel: data.channel, to: data.to, canText: data.canText });
        if (body.resend) setNote(`New code sent to ${data.to}.`);
        setCode('');
      }
    } catch (err) {
      if (err.data && err.data.step === 'code') setSent({ channel: err.data.channel, to: err.data.to, canText: err.data.canText });
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    send(sent ? { code } : {});
  };

  const linkClass = 'text-sm font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline disabled:opacity-50';

  return (
    <form onSubmit={submit} className="space-y-4">
      {!sent && (
        <>
          <Field label="Email">
            <Input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password">
            <Input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
        </>
      )}

      {sent && (
        <>
          <p className="text-sm text-slate-700">
            We {sent.channel === 'sms' ? 'texted' : 'emailed'} a 6-digit code to <strong>{sent.to}</strong>. It works for 10 minutes.
          </p>
          <Field label="Sign-in code">
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9 ]{6,7}"
              maxLength={7}
              required
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center text-xl tracking-[0.4em]"
            />
          </Field>
        </>
      )}

      <Notice>{note}</Notice>
      <ErrorNote error={error} />
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? 'Checking…' : sent ? 'Sign in' : 'Continue'}
      </Button>

      {sent && (
        <div className="flex flex-col items-center gap-2 pt-1">
          <button type="button" disabled={busy} onClick={() => send({ resend: true, channel: sent.channel })} className={linkClass}>
            Send a new code
          </button>
          {sent.channel === 'email' && sent.canText && (
            <button type="button" disabled={busy} onClick={() => send({ resend: true, channel: 'sms' })} className={linkClass}>
              Text it to my phone instead
            </button>
          )}
          {sent.channel === 'sms' && (
            <button type="button" disabled={busy} onClick={() => send({ resend: true, channel: 'email' })} className={linkClass}>
              Email it instead
            </button>
          )}
          <button type="button" onClick={() => { setSent(null); setCode(''); setError(null); setNote(null); }} className="text-sm text-slate-500 hover:text-slate-800">
            Use a different account
          </button>
        </div>
      )}
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex justify-center bg-slate-900 py-6">
          <img src="/images/LED-logo-trim-192.webp" alt="LED Custom Painting & More" width="132" height="80" className="h-20 w-auto" />
        </div>
        <div className="p-6">
          <h1 className="text-xl font-bold text-slate-900">Business Dashboard</h1>
          <p className="mb-6 mt-1 text-sm text-slate-500">Sign in to manage leads, quotes and invoices.</p>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
