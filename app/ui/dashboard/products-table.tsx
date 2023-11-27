import React from 'react';
import ProductsTableClient from './products-table-client';
import { fetchProducts } from '@/app/lib/data';

export default async function ProductTable({
  search,
  limit,
  offset,
}: {
  search: string;
  limit: number;
  offset: number;
}) {
  const { data: products } = await fetchProducts({ search, limit, offset });
  return (
    <div className='mt-6 flow-root'>
      <ProductsTableClient products={products} />
    </div>
  );
}
