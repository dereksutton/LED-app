"use client";
import Link from 'next/link';
import { adminApi } from '../../../src/admin/api';
import { useAdminUser } from '../../../src/admin/AdminShell';
import { ago, money, shortDate } from '../../../src/admin/format';
import { Button, Card, Empty, ErrorNote, Spinner, StatusBadge, useLoad } from '../../../src/admin/ui';

function Stat({ label, value, sub, href }) {
  return (
    <Link href={href} className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm no-underline hover:border-slate-400">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </Link>
  );
}

function DocRow({ href, number, name, amount, status, date }) {
  return (
    <li>
      <Link href={href} className="flex items-center justify-between gap-3 py-2.5 no-underline hover:bg-slate-50">
        <span className="min-w-0">
          <span className="block truncate font-medium text-slate-900">{name || 'No name'}</span>
          <span className="block text-xs text-slate-500">{number}{date ? ` · ${date}` : ''}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {amount && <span className="text-sm font-medium text-slate-700">{amount}</span>}
          <StatusBadge status={status} />
        </span>
      </Link>
    </li>
  );
}

export default function HomePage() {
  const user = useAdminUser();
  const [data, error] = useLoad(() => adminApi.get('/summary'));

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hi {user.name.split(' ')[0]}</h1>
          <p className="text-sm text-slate-500">Here&apos;s where the business stands.</p>
        </div>
        <div className="flex gap-2">
          <Button href="/admin/leads/?new=1" variant="secondary">Add a lead</Button>
          <Button href="/admin/quotes/?new=1">New quote</Button>
        </div>
      </div>
      <ErrorNote error={error} />
      {!data && !error && <Spinner />}
      {data && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="New leads" value={data.newLeads} sub={`${data.leadsThisMonth} this month`} href="/admin/leads/?status=new" />
            <Stat label="Open quotes" value={money(data.openQuotes.totalCents)} sub={`${data.openQuotes.count} waiting on customers`} href="/admin/quotes/" />
            <Stat
              label="Unpaid invoices"
              value={money(data.unpaidInvoices.balanceCents)}
              sub={data.unpaidInvoices.overdueCount ? `${data.unpaidInvoices.overdueCount} overdue` : `${data.unpaidInvoices.count} open`}
              href="/admin/invoices/"
            />
            <Stat label="Paid this month" value={money(data.revenueThisMonthCents)} sub="Payments recorded" href="/admin/invoices/?status=paid" />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card title="Latest leads" actions={<Button href="/admin/leads/" variant="ghost">All leads</Button>}>
              {data.recentLeads.length ? (
                <ul className="divide-y divide-slate-100">
                  {data.recentLeads.map((l) => (
                    <DocRow key={l.id} href={`/admin/leads/view/?id=${l.id}`} name={l.name} number={l.projectType || 'Lead'} date={ago(l.createdAt)} status={l.status} />
                  ))}
                </ul>
              ) : <Empty>No leads yet. Requests from the website form land here.</Empty>}
            </Card>

            <Card title="Waiting to be paid" actions={<Button href="/admin/invoices/" variant="ghost">All invoices</Button>}>
              {data.unpaidInvoices.items.length ? (
                <ul className="divide-y divide-slate-100">
                  {data.unpaidInvoices.items.map((i) => (
                    <DocRow key={i.id} href={`/admin/invoices/edit/?id=${i.id}`} name={i.customerName} number={i.number} date={i.dueDate ? `due ${shortDate(i.dueDate)}` : ''} amount={money(i.balanceCents)} status={i.displayStatus} />
                  ))}
                </ul>
              ) : <Empty>Nothing outstanding.</Empty>}
            </Card>

            <Card title="Quotes waiting on a yes" actions={<Button href="/admin/quotes/" variant="ghost">All quotes</Button>}>
              {data.openQuotes.items.length ? (
                <ul className="divide-y divide-slate-100">
                  {data.openQuotes.items.map((q) => (
                    <DocRow key={q.id} href={`/admin/quotes/edit/?id=${q.id}`} name={q.customerName} number={q.number} date={q.sentAt ? `sent ${ago(q.sentAt)}` : ''} amount={money(q.totalCents)} status={q.status} />
                  ))}
                </ul>
              ) : <Empty>No quotes out right now.</Empty>}
            </Card>

            <Card title="Contracts waiting to be signed" actions={<Button href="/admin/contracts/" variant="ghost">All contracts</Button>}>
              {data.awaitingSignature.items.length ? (
                <ul className="divide-y divide-slate-100">
                  {data.awaitingSignature.items.map((c) => (
                    <DocRow key={c.id} href={`/admin/contracts/edit/?id=${c.id}`} name={c.customerName} number={c.number} date={c.sentAt ? `sent ${ago(c.sentAt)}` : ''} status={c.status} />
                  ))}
                </ul>
              ) : <Empty>No contracts out for signature.</Empty>}
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
