// Everything under /admin: kept out of search engines, and links out carry
// no referrer.
export const metadata = {
  title: 'LED Business Dashboard',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
  alternates: { canonical: null },
};

export default function AdminLayout({ children }) {
  return <div className="text-left font-sans-luxury text-slate-900">{children}</div>;
}
