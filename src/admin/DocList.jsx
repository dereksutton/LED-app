"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi } from './api';
import CustomerPicker from './CustomerPicker';
import { money, shortDate } from './format';
import { Button, Card, Empty, ErrorNote, FilterTabs, PageHeader, Spinner, StatusBadge, Table, useLoad } from './ui';

// The list page shared by quotes, invoices and contracts.
export default function DocList({ kind, title, subtitle, tabs, newLabel, dateColumn }) {
  const params = useSearchParams();
  const router = useRouter();
  const status = params.get('status') || '';
  const [picking, setPicking] = useState(params.get('new') === '1');
  const [data, error] = useLoad(() => adminApi.get(`/${kind}s?status=${encodeURIComponent(status)}`), [status]);
  const list = data ? data[`${kind}s`] : null;

  const create = async (customer) => {
    const res = await adminApi.post(`/${kind}s`, { customerId: customer.id });
    router.push(`/admin/${kind}s/edit/?id=${res[kind].id}`);
  };

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} actions={<Button onClick={() => setPicking(true)}>{newLabel}</Button>} />
      {picking && <CustomerPicker title={`${newLabel}: choose the customer`} onPick={create} onClose={() => setPicking(false)} />}
      <Card>
        <FilterTabs tabs={tabs} value={status} hrefFor={(v) => `/admin/${kind}s/${v ? `?status=${v}` : ''}`} className="mb-3" />
        <ErrorNote error={error} />
        {!list && !error && <Spinner />}
        {list && (list.length ? (
          <Table head={['Number', { label: 'Customer', className: 'hidden sm:table-cell' }, { label: 'Title', className: 'hidden md:table-cell' }, { label: dateColumn.label, className: 'hidden sm:table-cell' }, { label: 'Amount', className: 'text-right' }, { label: 'Status', className: 'hidden sm:table-cell' }]}>
            {list.map((d) => (
              <tr key={d.id} className="cursor-pointer hover:bg-slate-50" onClick={() => router.push(`/admin/${kind}s/edit/?id=${d.id}`)}>
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  <Link href={`/admin/${kind}s/edit/?id=${d.id}`} className="text-slate-900 no-underline" onClick={(e) => e.stopPropagation()}>{d.number}</Link>
                  {/* Phones fold the customer under the number. */}
                  <span className="block max-w-[11rem] truncate text-xs font-normal text-slate-500 sm:hidden">{d.customerName}</span>
                </td>
                <td className="hidden px-4 py-3 text-slate-700 sm:table-cell">{d.customerName}</td>
                <td className="hidden px-4 py-3 text-slate-700 md:table-cell">{d.title}</td>
                <td className="hidden px-4 py-3 text-slate-500 whitespace-nowrap sm:table-cell">{shortDate(dateColumn.value(d))}</td>
                <td className="px-4 py-3 text-right font-medium text-slate-900 whitespace-nowrap">
                  {kind === 'invoice' ? money(d.balanceCents ? d.balanceCents : d.totalCents) : money(d.totalCents)}
                  {kind === 'invoice' && d.balanceCents > 0 && d.paidCents > 0 && <span className="block text-xs font-normal text-slate-500">due</span>}
                  {/* And the status under the amount. */}
                  <span className="mt-1 block sm:hidden"><StatusBadge status={d.displayStatus || d.status} /></span>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell"><StatusBadge status={d.displayStatus || d.status} /></td>
              </tr>
            ))}
          </Table>
        ) : <Empty>Nothing here yet.</Empty>)}
      </Card>
    </>
  );
}
