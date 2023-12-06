import Breadcrumbs from '@/app/ui/breadcrumbs';
import CreateProductForm from '@/app/ui/dashboard/create-product-form';

export default async function Page() {
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          {
            label: 'Create Product',
            href: '/dashboard/products/create',
            active: true,
          },
        ]}
      />
      <CreateProductForm />
    </>
  );
}
