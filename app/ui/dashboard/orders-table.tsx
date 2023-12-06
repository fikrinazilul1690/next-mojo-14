import { fetchListOrder } from '@/app/lib/data';
import React from 'react';
import OrdersTableClient from './orders-table-client';

export default async function OrdersTable({
  limit,
  offset,
  status,
}: {
  limit: number;
  offset: number;
  status?: string;
}) {
  const orders = await fetchListOrder({ limit, offset, status });
  return (
    <div className='mt-6 flow-root'>
      <OrdersTableClient orders={orders} />
    </div>
  );
}
