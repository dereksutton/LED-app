"use client";
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../../src/admin/api';
import { Button, ErrorNote, Field, Input } from '../../../src/admin/ui';

function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('password'); // password | code | enroll
  const [enroll, setEnroll] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // Only ever go back to a dashboard page after signing in.
  const next = () => {
    const n = params.get('next') || '';
    return n.startsWith('/admin/') && !n.startsWith('//') ? n : '/admin/';
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await api('/admin/login', { method: 'POST', body: { email, password, code: step === 'password' ? undefined : code } });
      if (data.user) {
        window.location.assign(next());
        return;
      }
      if (data.step === 'enroll') setEnroll({ qr: data.qr, secret: data.secret });
      setStep(data.step);
      setCode('');
    } catch (err) {
      if (err.data && err.data.step) setStep(err.data.step);
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {step === 'password' && (
        <>
          <Field label="Email">
            <Input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password">
            <Input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
        </>
      )}

      {step === 'enroll' && enroll && (
        <div className="space-y-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Set up your sign-in code</p>
          <p>For extra security, each sign-in also asks for a 6-digit code from your phone. Install an authenticator app (Google Authenticator, Microsoft Authenticator or 1Password), tap add, and scan this:</p>
          <img src={enroll.qr} alt="QR code to add this account to your authenticator app" width={200} height={200} className="mx-auto rounded-lg border border-slate-200" />
          <p>Can&apos;t scan? Enter this key in the app instead:</p>
          <code className="block break-all rounded bg-slate-100 px-3 py-2 text-center font-mono text-sm tracking-wider">{enroll.secret.match(/.{1,4}/g).join(' ')}</code>
        </div>
      )}

      {step !== 'password' && (
        <Field label="6-digit code from your authenticator app">
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
      )}

      <ErrorNote error={error} />
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? 'Checking…' : step === 'password' ? 'Sign in' : step === 'enroll' ? 'Finish setup' : 'Verify'}
      </Button>
      {step !== 'password' && (
        <button type="button" onClick={() => { setStep('password'); setError(null); }} className="w-full text-sm text-slate-500 hover:text-slate-800">
          Use a different account
        </button>
      )}
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">LED Business Dashboard</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500">Sign in to manage leads, quotes and invoices.</p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
