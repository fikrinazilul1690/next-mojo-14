import { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchProductsPage } from '@/app/lib/data';
import { getOffset } from '@/app/lib/utils';
import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import ProductsTable from '@/app/ui/dashboard/products-table';
import { CreateProduct } from '@/app/ui/dashboard/product-button';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { RedirectType, redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    page?: string;
  };
}) {
  const limit = 6;
  const search = searchParams?.search || '';
  const currentPage = Number(searchParams?.page) || 1;
  const offset = getOffset(currentPage, limit);
  const { data } = await fetchProductsPage({
    search,
    limit,
    offset,
  });
  if (currentPage > data.page) {
    redirect('/dashboard/products', RedirectType.replace);
  }

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <Breadcrumbs
          breadcrumbs={[
            {
              label: 'Products',
              href: `/dashboard/products`,
              active: true,
            },
          ]}
        />
      </div>
      <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
        <Search placeholder='Search products...' />
        <CreateProduct />
      </div>
      <Suspense key={search + currentPage} fallback={<div>Loading</div>}>
        <ProductsTable search={search} limit={limit} offset={offset} />
      </Suspense>
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={data.page} showControls />
      </div>
    </div>
  );
}
