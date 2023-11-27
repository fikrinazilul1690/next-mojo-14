import { getOffset } from '@/app/lib/utils';
import CategoryFilter from '@/app/ui/category-filter';
import { fetchCategoreis, fetchProductsPage } from '@/app/lib/data';
import Pagination from '@/app/ui/pagination';
import ProductsList from '@/app/ui/products/product-card';
import LimitController from '@/app/ui/products/limit-controller';
import { Suspense } from 'react';
import { ProductsListSkeleton } from '@/app/ui/skeleton';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    category?: string;
    page?: string;
    limit?: string;
    search?: string;
    custom?: string;
  };
}) {
  const limit = Number(searchParams?.limit ?? 10);
  const search = searchParams?.search ?? '';
  const category = searchParams?.category ?? '';
  const customizable = searchParams?.custom
    ? Boolean(searchParams?.custom)
    : undefined;
  const page = Number(searchParams?.page ?? 1);
  const offset = getOffset(page, limit);
  const { data } = await fetchProductsPage({ limit, offset, category, search });
  const { data: categories } = await fetchCategoreis();
  return (
    <main className='flex flex-col gap-3 justify-center items-center w-3/5 m-auto my-4'>
      <h1 className='text-3xl font-bold'>Products</h1>
      <div className='flex justify-between items-end w-full'>
        <LimitController limit={limit} />
        <CategoryFilter
          categories={categories}
          category={category}
          defaultValue=''
          defaultValueLabel='all'
          className='max-sm:w-24'
        />
      </div>
      <Suspense
        key={category + limit + page + customizable + search}
        fallback={<ProductsListSkeleton limit={limit} />}
      >
        <ProductsList
          category={category}
          limit={limit}
          offset={offset}
          search={search}
          customizable={customizable}
        />
      </Suspense>
      <Pagination showControls totalPages={data.page} />
    </main>
  );
}
