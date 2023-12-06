import { fetchProductDetail } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import UpdateProductForm from '@/app/ui/dashboard/update-product-form';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: { productId: string };
}) {
  const productId = Number(params.productId);
  if (!productId) notFound();
  const product = await fetchProductDetail(productId);
  if (!product) notFound();
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          {
            label: 'Update Product',
            href: `/dashboard/products/${productId}/update`,
            active: true,
          },
        ]}
      />
      <UpdateProductForm product={product} />
    </>
  );
}
