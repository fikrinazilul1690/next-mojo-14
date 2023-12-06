import Cards from '@/app/ui/dashboard/cards';
import ProductSoldChart from '@/app/ui/dashboard/product-sold-chart';
import { CardsSkeleton, ProductSoldChartSkeleton } from '@/app/ui/skeleton';
import React, { Suspense } from 'react';

export default function Page() {
  return (
    <main>
      <h1 className='mb-4 text-xl md:text-2xl'>Dashboard</h1>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <Suspense fallback={<CardsSkeleton />}>
          <Cards />
        </Suspense>
      </div>
      <div className='mt-6'>
        <Suspense fallback={<ProductSoldChartSkeleton />}>
          <ProductSoldChart />
        </Suspense>
      </div>
    </main>
  );
}
