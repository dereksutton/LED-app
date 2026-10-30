"use client";
import { Suspense } from 'react';
import DocList from '../../../../src/admin/DocList';
import { Spinner } from '../../../../src/admin/ui';

const TABS = [['', 'All'], ['draft', 'Drafts'], ['sent', 'Sent'], ['viewed', 'Opened'], ['signed', 'Signed'], ['void', 'Void']];

export default function ContractsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <DocList kind="contract" title="Contracts" subtitle="Agreements customers sign online." tabs={TABS} newLabel="New contract" dateColumn={{ label: 'Sent', value: (d) => d.sentAt || d.createdAt }} />
    </Suspense>
  );
}
