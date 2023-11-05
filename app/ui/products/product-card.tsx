import Image from 'next/image';
import { Card, CardBody } from '@nextui-org/card';
import { Link } from '@nextui-org/link';
import { formatIDR, getOffset } from '@/app/lib/utils';
import { Product } from '@/app/lib/definitions';
import { fetchProducts } from '@/app/lib/data';
import ProductCustomLabel from '../product-custom-label';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const image = product.images.find((image) => image.order === 0);
  return (
    <Card
      as={Link}
      href={`/products/${product.id}`}
      isPressable
      isBlurred
      className='border-none bg-background/60 dark:bg-default-100/50'
      shadow='sm'
    >
      <CardBody>
        <div className='flex gap-6 md:gap-4 items-center justify-start'>
          <div>
            <div className='h-[200px] w-[200px] relative'>
              <Image
                alt={image?.name ?? 'undefined'}
                fill
                className='object-cover rounded-md'
                src={image?.url ?? ''}
              />
              {product.customizable && (
                <ProductCustomLabel className='absolute top-2 left-2' />
              )}
            </div>
          </div>

          <div className='flex-col flex justify-between items-start'>
            <div className='flex flex-col gap-0'>
              <h1 className='font-semibold text-large text-foreground/90'>
                {product.name}
              </h1>
              <p className='text-small text-foreground/80'>
                {product.category}
              </p>
              <h1 className='text-medium font-medium mt-2'>
                {formatIDR(product.min_price || 0)}
              </h1>
            </div>
            <p className='overflow-hidden'>
              {product.description || 'Product Description'}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default async function ProductsList({
  offset,
  limit,
  search,
  customizable,
  category,
}: {
  limit?: number;
  offset?: number;
  search?: string;
  customizable?: boolean;
  category?: string;
}) {
  const { data: products } = await fetchProducts({
    search,
    limit,
    offset,
    category,
    customizable,
  });
  return (
    <div className='w-full flex flex-col gap-2'>
      {products.length !== 0 ? (
        products.map((val) => <ProductCard key={val.id} product={val} />)
      ) : (
        <div className='font-bold flex flex-col gap-2 justify-center items-center text-xl m-3'>
          <Image src='/out-of-stock.png' width={150} height={150} alt='' />
          <span>No Product Found</span>
        </div>
      )}
    </div>
  );
}
