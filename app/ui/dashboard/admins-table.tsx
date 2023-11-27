import { fetchAdminList } from '@/app/lib/data';
import React from 'react';
import AdminsTableClient from './admins-table-client';

export default async function AdminsTable({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) {
  const admins = await fetchAdminList({ limit, offset });
  return (
    <div className='mt-6 flow-root'>
      <AdminsTableClient admins={admins ?? []} />
    </div>
  );
}
