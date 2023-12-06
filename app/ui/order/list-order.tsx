import { fetchListOrder } from '@/app/lib/data';
import React from 'react';
import ListOrderInfo from './order-info-card';

export default async function ListOrder({
  status,
  limit,
  offset,
}: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const orders = await fetchListOrder({ status, limit, offset });
  console.log(orders);
  return (
    <div className='w-full flex flex-col gap-3'>
      <ListOrderInfo
        listOrderInfo={orders.sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        })}
      />
    </div>
  );
}
