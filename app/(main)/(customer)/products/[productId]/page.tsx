import { fetchProductDetail, fetchProducts } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Card } from '@nextui-org/card';
import React, { Suspense } from 'react';
import ProductImages from '@/app/ui/products/product-image';
import ProductDetail from '@/app/ui/products/product-detail';
import ProductAction from '@/app/ui/products/product-action';
import { WishlistButtonSkeleton } from '@/app/ui/products/wishlist-button';
import WishlistAction from '@/app/ui/products/wishlist-action';

export default async function Page({
  params,
  searchParams,
}: {
  params: { productId: string };
  searchParams: {
    sku?: string;
  };
}) {
  const productId = Number(params.productId);
  const product = await fetchProductDetail(productId);
  if (!product) notFound();
  const variant =
    product.variant.find((variant) => variant.sku === searchParams?.sku) ??
    product.variant[0];
  return (
    <Card className='p-7 max-sm:p-3 rounded-lg my-24 lg:mx-auto mx-8 flex flex-row flex-wrap lg:max-w-7xl max-lg:gap-4 justify-start lg:justify-evenly bg-content1'>
      <section className='max-lg:mx-auto'>
        <ProductImages product={product} />
      </section>
      <section>
        <ProductDetail product={product} selectedVariant={variant}>
          <Suspense key={variant.sku} fallback={<WishlistButtonSkeleton />}>
            <WishlistAction sku={variant.sku} productId={product.id} />
          </Suspense>
        </ProductDetail>
      </section>
      <section className='max-lg:w-full'>
        <ProductAction product={product} selectedVariant={variant} />
      </section>
    </Card>
  );
}

export async function generateStaticParams() {
  const { data } = await fetchProducts();

  return data.map((product) => ({
    productId: product.id.toString(),
  }));
}
