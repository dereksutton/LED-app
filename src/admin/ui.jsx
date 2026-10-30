"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATUS } from './format';

const cx = (...c) => c.filter(Boolean).join(' ');

const BUTTON = {
  primary: 'bg-slate-900 text-white hover:bg-slate-700 disabled:bg-slate-400',
  secondary: 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 disabled:text-slate-400',
  danger: 'bg-white text-red-700 border border-red-300 hover:bg-red-50 disabled:text-red-300',
  ghost: 'text-slate-700 hover:bg-slate-100',
};

export function Button({ variant = 'primary', className, href, children, ...props }) {
  const classes = cx('inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed no-underline', BUTTON[variant], className);
  // Page links go through Next; PDFs, phone and email links are plain anchors
  // so Next doesn't try to prefetch them.
  if (href && href.startsWith('/') && !href.startsWith('/api') && !props.target) {
    return <Link href={href} className={classes} {...props}>{children}</Link>;
  }
  if (href) return <a href={href} className={classes} {...props}>{children}</a>;
  return <button type="button" className={classes} {...props}>{children}</button>;
}

export function Card({ title, actions, children, className }) {
  return (
    <section className={cx('rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm', className)}>
      {(title || actions) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ title, subtitle, back, actions }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {back && <Link href={back.href} className="text-sm text-slate-500 hover:text-slate-800 no-underline">← {back.label}</Link>}
        <h1 className="mt-1 truncate text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const TONES = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  purple: 'bg-purple-50 text-purple-700 ring-purple-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  gray: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export function StatusBadge({ status }) {
  const s = STATUS[status] || { label: status, tone: 'gray' };
  return <span className={cx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap', TONES[s.tone])}>{s.label}</span>;
}

export function Field({ label, hint, children, className }) {
  return (
    <label className={cx('block', className)}>
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

const INPUT = 'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50';

export function Input({ className, ...props }) {
  return <input className={cx(INPUT, className)} {...props} />;
}

export function Textarea({ className, rows = 4, ...props }) {
  return <textarea rows={rows} className={cx(INPUT, className)} {...props} />;
}

export function Select({ className, children, ...props }) {
  return <select className={cx(INPUT, className)} {...props}>{children}</select>;
}

// Status filters for a list. Phones get one dropdown; wider screens get a
// row of chips that wraps instead of scrolling sideways. tabs holds
// [value, label, count?].
export function FilterTabs({ tabs, value, hrefFor, label = 'Show', className }) {
  const router = useRouter();
  return (
    <div className={className}>
      <Select value={value} onChange={(e) => router.push(hrefFor(e.target.value))} aria-label={label} className="sm:hidden">
        {tabs.map(([v, l, count]) => <option key={v} value={v}>{count ? `${l} (${count})` : l}</option>)}
      </Select>
      <div className="hidden flex-wrap gap-1 sm:flex">
        {tabs.map(([v, l, count]) => (
          <Link
            key={v}
            href={hrefFor(v)}
            aria-current={value === v ? 'page' : undefined}
            className={cx('rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap no-underline', value === v ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}
          >
            {l}
            {count > 0 && <span className="ml-1 text-xs opacity-70">{count}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ErrorNote({ error }) {
  if (!error) return null;
  return <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error.message || String(error)}</p>;
}

export function Notice({ children }) {
  if (!children) return null;
  return <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{children}</p>;
}

export function Spinner({ label = 'Loading…' }) {
  return <p className="py-10 text-center text-sm text-slate-500">{label}</p>;
}

export function Empty({ children }) {
  return <p className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">{children}</p>;
}

// Loads data on mount and whenever deps change; returns
// [data, error, reload, setData, version]. version goes up on every load, so
// an editor keyed on it starts fresh from the saved data.
export function useLoad(load, deps = []) {
  const [state, setState] = useState({ data: null, error: null, version: 0 });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true;
    load().then(
      (data) => live && setState((s) => ({ data, error: null, version: s.version + 1 })),
      (error) => live && setState((s) => ({ data: null, error, version: s.version })),
    );
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);
  return [state.data, state.error, () => setTick((t) => t + 1), (data) => setState((s) => ({ data, error: null, version: s.version + 1 })), state.version];
}

// Runs an action with a busy flag and an error to show.
export function useAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const run = async (fn) => {
    setBusy(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError(err);
      return undefined;
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, run, setError };
}

export function Table({ head, children }) {
  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead>
          <tr>{head.map((h, i) => <th key={i} className={cx('px-4 py-2 text-left font-medium text-slate-500 whitespace-nowrap', h.className)}>{h.label ?? h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-lg sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
