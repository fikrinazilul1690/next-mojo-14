import { fetchOrdersPage } from '@/app/lib/data';
import { getOffset } from '@/app/lib/utils';
import ListOrder from '@/app/ui/order/list-order';
import OrderStatusFilter from '@/app/ui/order/order-filter';
import Pagination from '@/app/ui/pagination';
import { RedirectType, redirect } from 'next/navigation';
import React, { Suspense } from 'react';

export default async function Page({
  searchParams,
}: {
  searchParams: {
    status?: string;
    page?: string;
  };
}) {
  const status = searchParams.status;
  const limit = 5;
  const page = Number(searchParams?.page ?? 1);
  const offset = getOffset(page, limit);
  const { data } = await fetchOrdersPage({ limit, offset, status });
  if (page > data.page) {
    redirect('/orders', RedirectType.replace);
  }
  return (
    <div className='flex flex-col gap-3 items-center justify-center w-full'>
      <div className='flex justify-between items-center w-full'>
        <h3 className='text-xl font-semibold'>List Orders</h3>
        <OrderStatusFilter status={status} />
      </div>
      {/* order linst */}
      <Suspense key={status} fallback={<div>Loading...</div>}>
        <ListOrder status={searchParams.status} limit={limit} offset={offset} />
      </Suspense>
      <Pagination showControls totalPages={data.page} />
    </div>
  );
}
