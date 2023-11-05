import ListSlogan from '@/app/ui/slogan';
import { fetchCategoreis, fetchProductsPage } from '@/app/lib/data';
import Image from 'next/image';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import Link from 'next/link';
import FeaturedProductsList from '@/app/ui/featured-product-card';
import CategoryFilter from '@/app/ui/category-filter';
import { Suspense } from 'react';
import { FeaturedProductsListSkeleton } from '@/app/ui/skeleton';
import { getOffset } from '@/app/lib/utils';
import Pagination from '@/app/ui/pagination';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    category?: string;
    page?: string;
  };
}) {
  const limit = 3;
  const category = searchParams?.category ?? '';
  const page = Number(searchParams?.page ?? 1);
  const offset = getOffset(page, limit);
  const { data } = await fetchProductsPage({ limit, offset, category });
  const { data: categories } = await fetchCategoreis();
  return (
    <main className='mx-auto relative'>
      <div className='sm:h-[60vh] h-[30vh] relative'>
        <Image
          className='object-contain'
          src='/cover.png'
          alt='bg'
          fill
          priority
        />
      </div>
      <div className='max-w-[980px] mx-auto'>
        <div className='mb-[43px] mt-[69px] flex justify-between items-center max-sm:gap-4 max-sm:mx-3'>
          <h3 className='text-xl font-bold'>Featured Products</h3>
          <CategoryFilter
            category={category}
            defaultValue=''
            defaultValueLabel='All'
            categories={categories}
            className='max-sm:w-40'
          />
        </div>
        <div className='flex flex-col gap-2 justify-center items-center'>
          <Suspense
            key={page + category}
            fallback={<FeaturedProductsListSkeleton limit={limit} />}
          >
            <FeaturedProductsList
              category={category}
              limit={limit}
              offset={offset}
            />
          </Suspense>
          <Pagination
            showControls
            totalPage={data.page}
            size='lg'
            variant='flat'
          />
        </div>
        <ListSlogan />
        <Card
          radius='lg'
          className='grid sm:grid-cols-4 max-sm:mx-2 sm:px-14 sm:grid-rows-3 items-center justify-center bg-gradient-to-r from-[#326373] from-0% to-[#11B1E3] to-100% hover:from-[#11B1E3] hover:from-0% hover:to-[#326373] hover:to-100%'
          isHoverable
          isPressable
          as={Link}
          href={'/products?custom=true'}
        >
          <CardHeader className='sm:col-span-full row-span-1 justify-center'>
            <h1 className='text-[28px] text-white font-bold text-center leading-10'>
              &quot;Your Imagination, Our Creation: Unlocking Custom
              Wonders!&quot;
            </h1>
          </CardHeader>
          <CardBody className='sm:row-span-2 h-full sm:col-span-3 justify-start gap-7'>
            <p className='text-white text-center text-xl'>
              Ekspresikan diri Anda dengan produk custom kami, menciptakan
              hadiah tak terlupakan dan pengalaman yang istimewa.
            </p>
            <p className='text-white text-center text-xl font-semibold'>
              Custom Produk
            </p>
          </CardBody>
          <CardFooter className='sm:col-start-4 sm:col-end-5 sm:row-start-2 sm:row-end-4 justify-center'>
            <Image
              src='/custom.png'
              width={298}
              height={240}
              alt='product'
              priority={false}
            />
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
