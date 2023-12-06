import ListOrder from '@/app/ui/order/list-order';
import OrderStatusFilter from '@/app/ui/order/order-filter';
import { OrderInfoCard } from '@/app/ui/order/order-info-card';
import React, { Suspense } from 'react';

export default function Page({
  searchParams,
}: {
  searchParams: {
    status?: string;
  };
}) {
  const status = searchParams.status ?? 'all';
  return (
    <div className='flex flex-col gap-3 items-center justify-center w-full'>
      <div className='flex justify-between items-center w-full'>
        <h3 className='text-xl font-semibold'>List Orders</h3>
        <OrderStatusFilter status={status} />
      </div>
      {/* order linst */}
      <Suspense key={status} fallback={<div>Loading...</div>}>
        <ListOrder status={searchParams.status} />
      </Suspense>
    </div>
  );
}
