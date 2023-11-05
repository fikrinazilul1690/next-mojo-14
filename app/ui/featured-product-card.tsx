import Image from 'next/image';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Link } from '@nextui-org/link';
import { formatIDR } from '@/app/lib/utils';
import { Product } from '../lib/definitions';
import { fetchFeaturedProducts } from '@/app/lib/data';
import ProductCustomLabel from './product-custom-label';

type Props = {
  product: Product;
};

export default async function FeaturedProductsList({
  limit,
  offset,
  category,
}: {
  limit: number;
  offset: number;
  category: string;
}) {
  const { data: products } = await fetchFeaturedProducts(
    limit,
    offset,
    category
  );
  return (
    <div className='gap-2 grid w-full grid-cols-1 min-h-[320px] items-center sm:grid-cols-3 mx-3 sm:mx-auto'>
      {products.length !== 0 ? (
        products.map((product) => (
          <FeaturedProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className='text-center col-span-full text-xl font-bold flex flex-col justify-center items-center'>
          <Image src='/out-of-stock.png' width={150} height={150} alt='' />
          <span>No Product Found</span>
        </div>
      )}
    </div>
  );
}

export function FeaturedProductCard({ product }: Props) {
  const image = product.images.find((image) => image.order === 0);
  return (
    <Card
      shadow='sm'
      className='max-sm:w-4/5 max-sm:m-auto'
      isPressable
      as={Link}
      href={`/products/${product.id}`}
    >
      <CardBody className='h-[300px] w-full relative overflow-visible p-0'>
        <Image
          fill
          alt={image?.name ?? 'undefined'}
          className='w-full object-cover rounded-lg hover:scale-90 ease-in-out duration-300'
          src={image?.url ?? ''}
          priority
        />
        {product.customizable && (
          <ProductCustomLabel className='absolute left-3 top-3' />
        )}
      </CardBody>
      <CardFooter className='text-small justify-between'>
        <p>{product.name}</p>
        <p className='text-default-500'>{formatIDR(product.min_price || 0)}</p>
      </CardFooter>
    </Card>
  );
}
