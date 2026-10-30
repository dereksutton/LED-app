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

// Every signed-in page sits inside this. It checks the session first and
// sends anyone without one to the sign-in page.
export default function AdminShell({ children }) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const [user, setUser] = useState(null);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        {/* The logo's lettering is white, so it sits on the site's navy. */}
        <div className="bg-slate-900">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
            <Link href="/admin/" className="flex items-center gap-2 no-underline" aria-label="LED Custom Painting dashboard home">
              <img src="/images/LED-logo-trim-96.webp" srcSet="/images/LED-logo-trim-96.webp 1x, /images/LED-logo-trim-192.webp 2x" alt="LED Custom Painting & More" width="79" height="48" className="h-12 w-auto" />
              <span className="text-sm font-medium text-slate-300">Business</span>
            </Link>
            <div className="flex items-center gap-3 text-sm">
              {user && <span className="hidden text-slate-300 sm:inline">{user.name}</span>}
              <button type="button" onClick={signOut} className="rounded-lg px-3 py-1.5 font-medium text-white hover:bg-white/10">Sign out</button>
            </div>
          </div>
        </div>
        <nav aria-label="Dashboard" className="mx-auto max-w-6xl overflow-x-auto px-2">
          <ul className="flex gap-1 whitespace-nowrap">
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
      <main className="mx-auto max-w-6xl px-4 py-6 pb-24">
        {user ? <UserContext.Provider value={user}>{children}</UserContext.Provider> : <Spinner label="Checking your sign-in…" />}
      </main>
    </div>
  );
}
