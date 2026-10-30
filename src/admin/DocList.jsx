"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi } from './api';
import CustomerPicker from './CustomerPicker';
import { money, shortDate } from './format';
import { Button, Card, Empty, ErrorNote, PageHeader, Spinner, StatusBadge, Table, useLoad } from './ui';

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
        <div className="-mx-1 mb-3 flex gap-1 overflow-x-auto">
          {tabs.map(([value, label]) => (
            <Link
              key={value}
              href={`/admin/${kind}s/${value ? `?status=${value}` : ''}`}
              className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap no-underline ${status === value ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {label}
            </Link>
          ))}
        </div>
        <ErrorNote error={error} />
        {!list && !error && <Spinner />}
        {list && (list.length ? (
          <Table head={['Number', 'Customer', { label: 'Title', className: 'hidden md:table-cell' }, { label: dateColumn.label, className: 'hidden sm:table-cell' }, { label: 'Amount', className: 'text-right' }, 'Status']}>
            {list.map((d) => (
              <tr key={d.id} className="cursor-pointer hover:bg-slate-50" onClick={() => router.push(`/admin/${kind}s/edit/?id=${d.id}`)}>
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  <Link href={`/admin/${kind}s/edit/?id=${d.id}`} className="text-slate-900 no-underline" onClick={(e) => e.stopPropagation()}>{d.number}</Link>
                </td>
                <td className="px-4 py-3 text-slate-700">{d.customerName}</td>
                <td className="hidden px-4 py-3 text-slate-700 md:table-cell">{d.title}</td>
                <td className="hidden px-4 py-3 text-slate-500 whitespace-nowrap sm:table-cell">{shortDate(dateColumn.value(d))}</td>
                <td className="px-4 py-3 text-right font-medium text-slate-900 whitespace-nowrap">
                  {kind === 'invoice' ? money(d.balanceCents ? d.balanceCents : d.totalCents) : money(d.totalCents)}
                  {kind === 'invoice' && d.balanceCents > 0 && d.paidCents > 0 && <span className="block text-xs font-normal text-slate-500">due</span>}
                </td>
                <td className="px-4 py-3"><StatusBadge status={d.displayStatus || d.status} /></td>
              </tr>
            ))}
          </Table>
        ) : <Empty>Nothing here yet.</Empty>)}
      </Card>
    </>
  );
}
