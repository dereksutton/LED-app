// Customer pages opened from an emailed link. The link is the key, so the
// page is never indexed and sends no referrer anywhere.
export const metadata = {
  title: 'Your document | LED Custom Painting & More',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
  alternates: { canonical: null },
};

export default function DocumentLayout({ children }) {
  return <div className="text-left font-sans-luxury text-slate-900">{children}</div>;
}
