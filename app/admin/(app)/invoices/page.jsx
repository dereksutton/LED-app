"use client";
import { Suspense } from 'react';
import DocList from '../../../../src/admin/DocList';
import { Spinner } from '../../../../src/admin/ui';

const TABS = [['', 'All'], ['draft', 'Drafts'], ['sent', 'Sent'], ['viewed', 'Opened'], ['partial', 'Part paid'], ['overdue', 'Overdue'], ['paid', 'Paid'], ['void', 'Void']];

export default function InvoicesPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <DocList kind="invoice" title="Invoices" subtitle="Bills, payments received and what's still owed." tabs={TABS} newLabel="New invoice" dateColumn={{ label: 'Due', value: (d) => d.dueDate }} />
    </Suspense>
  );
}
