import Link from 'next/link';

const variantStyles = {
  light: {
    link: 'text-slate-500 hover:text-slate-900',
    current: 'text-slate-800 font-semibold',
    sep: 'text-slate-300',
  },
  dark: {
    link: 'text-slate-300 hover:text-[--luxury-champagne]',
    current: 'text-[--luxury-champagne] font-semibold',
    sep: 'text-slate-600',
  },
};

/**
 * Visible breadcrumb trail. Pair with a BreadcrumbList JSON-LD block on the page.
 * items: [{ name, href }] — the final item is the current page and should omit href.
 */
const Breadcrumbs = ({ items = [], variant = 'light', className = '' }) => {
  if (!items.length) return null;
  const styles = variantStyles[variant] || variantStyles.light;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-sans-luxury text-sm list-none p-0 m-0">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="flex items-center gap-x-2">
              {isLast || !item.href ? (
                <span className={styles.current} aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`${styles.link} no-underline transition-colors`}
                >
                  {item.name}
                </Link>
              )}
              {!isLast && (
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
