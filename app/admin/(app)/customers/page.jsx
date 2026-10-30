"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '../../../../src/admin/api';
import CustomerPicker from '../../../../src/admin/CustomerPicker';
import { Button, Card, Empty, ErrorNote, Input, PageHeader, Spinner, Table, useLoad } from '../../../../src/admin/ui';

export default function CustomersPage() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [adding, setAdding] = useState(false);
  const [data, error] = useLoad(() => adminApi.get(`/customers?q=${encodeURIComponent(q.trim())}`), [q]);

  return (
    <>
      <PageHeader title="Customers" actions={<Button onClick={() => setAdding(true)}>Add customer</Button>} />
      {adding && <CustomerPicker title="Find or add a customer" onPick={(c) => router.push(`/admin/customers/view/?id=${c.id}`)} onClose={() => setAdding(false)} />}
      <Card>
        <Input type="search" placeholder="Search name, email, phone, address" value={q} onChange={(e) => setQ(e.target.value)} className="mb-3 sm:max-w-sm" aria-label="Search customers" />
        <ErrorNote error={error} />
        {!data && !error && <Spinner />}
        {data && (data.customers.length ? (
          <Table head={['Name', { label: 'Phone', className: 'hidden sm:table-cell' }, { label: 'Email', className: 'hidden md:table-cell' }, { label: 'Address', className: 'hidden lg:table-cell' }]}>
            {data.customers.map((c) => (
              <tr key={c.id} className="cursor-pointer hover:bg-slate-50" onClick={() => router.push(`/admin/customers/view/?id=${c.id}`)}>
                <td className="px-4 py-3"><Link href={`/admin/customers/view/?id=${c.id}`} className="font-medium text-slate-900 no-underline" onClick={(e) => e.stopPropagation()}>{c.name}</Link></td>
                <td className="hidden px-4 py-3 text-slate-700 sm:table-cell">{c.phone}</td>
                <td className="hidden px-4 py-3 text-slate-700 md:table-cell">{c.email}</td>
                <td className="hidden px-4 py-3 text-slate-700 lg:table-cell">{c.address}</td>
              </tr>
            ))}
          </Table>
        ) : <Empty>No customers yet. Turn a lead into a customer, or add one.</Empty>)}
      </Card>
    </>
  );
}
