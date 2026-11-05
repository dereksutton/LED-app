"use client";
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackFormStart, trackLead } from '../lib/analytics';
import { getRefCode, readAttribution } from '../lib/attribution';

const inputClass = 'w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2C3E50] focus:ring-2 focus:ring-[#2C3E50]/20';

// "Prefer a call back?": a name and number is all it takes.
export default function CallbackForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', zip: '', bestTime: '', website: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const started = useRef(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    trackFormStart({ form: 'callback' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, refCode: getRefCode(), attribution: readAttribution() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || 'Something went wrong. Please call us instead.');
        return;
      }
      trackLead({ form: 'callback' });
      router.push(`/thank-you/?type=callback${data.serviceArea === 'out' ? '&area=out' : ''}`);
    } catch {
      setError('We could not send your request. Please call us at (904) 385-0426.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} onFocus={onStart} className="space-y-3 text-left" aria-label="Request a call back">
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <label htmlFor="cb-website">Website</label>
        <input type="text" id="cb-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
      </div>
      <div>
        <label htmlFor="cb-name" className="sr-only">Name</label>
        <input id="cb-name" required autoComplete="name" placeholder="Your name" value={form.name} onChange={set('name')} className={inputClass} disabled={sending} />
      </div>
      <div>
        <label htmlFor="cb-phone" className="sr-only">Phone</label>
        <input id="cb-phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="Phone (904) 555-0123" value={form.phone} onChange={set('phone')} className={inputClass} disabled={sending} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="cb-zip" className="sr-only">ZIP code</label>
          <input id="cb-zip" inputMode="numeric" autoComplete="postal-code" maxLength={10} pattern="\s*\d{5}(-\d{4})?\s*" title="5-digit ZIP code" placeholder="ZIP" value={form.zip} onChange={set('zip')} className={inputClass} disabled={sending} />
        </div>
        <div>
          <label htmlFor="cb-time" className="sr-only">Best time to call</label>
          <select id="cb-time" value={form.bestTime} onChange={set('bestTime')} className={inputClass} disabled={sending}>
            <option value="">Best time</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Anytime">Anytime</option>
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className={`w-full inline-flex h-12 items-center justify-center rounded-full bg-[#2C3E50] px-6 font-sans-luxury font-bold text-[#F5E6D3] transition-colors hover:bg-[#1e293b] ${sending ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {sending ? 'Sending...' : 'Call me back'}
      </button>
    </form>
  );
}
