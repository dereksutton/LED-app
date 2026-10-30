"use client";
import { Suspense } from 'react';
import DocList from '../../../../src/admin/DocList';
import { Spinner } from '../../../../src/admin/ui';

const TABS = [['', 'All'], ['draft', 'Drafts'], ['sent', 'Sent'], ['viewed', 'Opened'], ['accepted', 'Accepted'], ['declined', 'Declined']];

export default function QuotesPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <DocList kind="quote" title="Quotes" subtitle="Estimates customers can accept online." tabs={TABS} newLabel="New quote" dateColumn={{ label: 'Sent', value: (d) => d.sentAt || d.createdAt }} />
    </Suspense>
  );
}
