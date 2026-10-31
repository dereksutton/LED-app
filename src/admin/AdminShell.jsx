"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { adminApi } from './api';
import { Spinner } from './ui';

const UserContext = createContext(null);
export const useAdminUser = () => useContext(UserContext);

const NAV = [
  { href: '/admin/', label: 'Home' },
  { href: '/admin/leads/', label: 'Leads' },
  { href: '/admin/customers/', label: 'Customers' },
  { href: '/admin/quotes/', label: 'Quotes' },
  { href: '/admin/invoices/', label: 'Invoices' },
  { href: '/admin/contracts/', label: 'Contracts' },
  { href: '/admin/settings/', label: 'Settings' },
];

// Phones get a bar along the bottom with the four pages used most, and the
// rest behind More.
const PHONE_TABS = ['/admin/', '/admin/leads/', '/admin/quotes/', '/admin/invoices/'];
const MORE = NAV.filter((item) => !PHONE_TABS.includes(item.href));

const ICONS = {
  '/admin/': 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  '/admin/leads/': 'M4 4h16v12H7l-3 3zM8 9h8M8 12h5',
  '/admin/quotes/': 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  '/admin/invoices/': 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
};

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={name === 'more' ? 3.5 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

// Every signed-in page sits inside this. It checks the session first and
// sends anyone without one to the sign-in page.
export default function AdminShell({ children }) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const [user, setUser] = useState(null);
  // The More sheet belongs to the page it was opened on, so moving to
  // another page closes it.
  const [moreOn, setMoreOn] = useState(null);
  const moreOpen = moreOn === pathname;
  const closeMore = () => setMoreOn(null);

  useEffect(() => {
    adminApi.get('/me').then((d) => setUser(d.user)).catch(() => {});
  }, []);

  const signOut = async () => {
    try {
      await adminApi.post('/logout');
    } finally {
      router.replace('/admin/login/');
    }
  };

  const active = (href) => (href === '/admin/' ? pathname === '/admin' || pathname === '/admin/' : pathname.startsWith(href.slice(0, -1)));
  const inMore = MORE.some((item) => active(item.href));

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white sm:sticky sm:top-0 sm:z-40">
        {/* The logo's lettering is white, so it sits on the site's navy. */}
        <div className="bg-slate-900">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
            <Link href="/admin/" className="flex items-center gap-2 no-underline" aria-label="LED Custom Painting dashboard home">
              <img src="/images/LED-logo-trim-96.webp" srcSet="/images/LED-logo-trim-96.webp 1x, /images/LED-logo-trim-192.webp 2x" alt="LED Custom Painting & More" width="105" height="64" className="h-14 w-auto sm:h-16" />
              <span className="text-sm font-medium text-slate-300">Business</span>
            </Link>
            <div className="flex items-center gap-3 text-sm">
              {user && <span className="hidden text-slate-300 sm:inline">{user.name}</span>}
              <button type="button" onClick={signOut} className="rounded-lg px-3 py-1.5 font-medium text-white hover:bg-white/10">Sign out</button>
            </div>
          </div>
        </div>
        <nav aria-label="Dashboard" className="mx-auto hidden max-w-6xl px-2 sm:block">
          <ul className="flex flex-wrap gap-1 whitespace-nowrap">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active(item.href) ? 'page' : undefined}
                  className={`inline-block border-b-2 px-3 py-2 text-sm font-medium no-underline ${active(item.href) ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:pb-24">
        {user ? <UserContext.Provider value={user}>{children}</UserContext.Provider> : <Spinner label="Checking your sign-in…" />}
      </main>

      {moreOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 sm:hidden" onClick={closeMore}>
          <div
            id="more-menu"
            className="absolute inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] rounded-t-2xl bg-white p-2 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <ul>
              {MORE.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active(item.href) ? 'page' : undefined}
                    className={`block rounded-lg px-4 py-3 text-base font-medium no-underline ${active(item.href) ? 'bg-slate-100 text-slate-900' : 'text-slate-700'}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-1 border-t border-slate-100 pt-1">
                <button type="button" onClick={signOut} className="block w-full rounded-lg px-4 py-3 text-left text-base font-medium text-slate-700">
                  Sign out{user ? ` (${user.name})` : ''}
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
      {/* Navy like the header, with a gold bar over the current tab. */}
      <nav aria-label="Dashboard" className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-900 pb-[env(safe-area-inset-bottom)] sm:hidden">
        <ul className="grid h-16 grid-cols-5">
          {PHONE_TABS.map((href) => {
            const item = NAV.find((n) => n.href === href);
            const on = active(href) && !moreOpen;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={on ? 'page' : undefined}
                  className={`relative flex h-full flex-col items-center justify-center gap-0.5 text-xs font-medium no-underline ${on ? 'text-white' : 'text-slate-400'}`}
                >
                  {on && <span aria-hidden="true" className="absolute inset-x-4 top-0 h-0.5 rounded-b bg-amber-400" />}
                  <Icon name={href} />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setMoreOn(moreOpen ? null : pathname)}
              aria-expanded={moreOpen}
              aria-controls="more-menu"
              className={`relative flex h-full w-full flex-col items-center justify-center gap-0.5 text-xs font-medium ${moreOpen || inMore ? 'text-white' : 'text-slate-400'}`}
            >
              {(moreOpen || inMore) && <span aria-hidden="true" className="absolute inset-x-4 top-0 h-0.5 rounded-b bg-amber-400" />}
              <Icon name="more" />
              More
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
