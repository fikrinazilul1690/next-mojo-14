import { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchOrdersPage, fetchProductsPage } from '@/app/lib/data';
import { getOffset } from '@/app/lib/utils';
import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import ProductsTable from '@/app/ui/dashboard/products-table';
import { CreateProduct } from '@/app/ui/dashboard/product-button';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { RedirectType, redirect } from 'next/navigation';
import OrderStatusFilter from '@/app/ui/order/order-filter';
import OrdersTable from '@/app/ui/dashboard/orders-table';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    status?: string;
  };
}) {
  const limit = 6;
  const currentPage = Number(searchParams?.page) || 1;
  const status = searchParams?.status;
  const offset = getOffset(currentPage, limit);
  const { data } = await fetchOrdersPage({
    status,
    limit,
    offset,
  });
  if (currentPage > data.page) {
    redirect('/dashboard/orders', RedirectType.replace);
  }

  return (
    <div className='w-full'>
      <div className='flex w-full items-start justify-between'>
        <Breadcrumbs
          breadcrumbs={[
            {
              label: 'Orders',
              href: `/dashboard/orders`,
              active: true,
            },
          ]}
        />
        <OrderStatusFilter status={status} />
      </div>
      <Suspense key={status ?? '' + currentPage} fallback={<div>Loading</div>}>
        <OrdersTable limit={limit} offset={offset} status={status} />
      </Suspense>
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={data.page} showControls />
      </div>
    </div>
  );
}
