import { CheckoutItem } from '@/app/lib/definitions';
import { countSubTotal, formatIDR } from '@/app/lib/utils';
import { Card } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import Image from 'next/image';

export function ItemCard({ item }: { item: CheckoutItem }) {
  return (
    <Card className='flex justify-between shadow-none w-full p-1 m-1'>
      <div className='flex justify-between w-full items-center'>
        <div className='flex gap-3'>
          <div className='relative w-16 h-16'>
            <Image
              className='rounded-md object-cover'
              alt={item.name}
              src={item.image}
              fill
            />
          </div>
          <div className='flex flex-col'>
            <p className='text-md font-bold'>{item.name}</p>
            <Chip
              color='default'
              radius='sm'
              size='sm'
              className='text-xs'
              variant='flat'
            >
              {item.sku}
            </Chip>
            <p className='text-sm'>qty: {item.quantity}</p>
          </div>
        </div>
        <p className='font-semibold ml-auto'>
          {formatIDR(item.price, { maximumSignificantDigits: 3 })}
        </p>
      </div>
    </Card>
  );
}

export default function ListItems({
  items,
  className,
}: {
  items: Array<CheckoutItem>;
  className?: string;
}) {
  const subTotal = countSubTotal(items);
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className='flex gap-2 w-full'>
        {items.map((item) => (
          <ItemCard key={item.sku} item={item} />
        ))}
      </div>
      <div className='font-bold text-lg flex justify-between items-center'>
        <span>Sub Total</span>
        <span>{formatIDR(subTotal, { maximumSignificantDigits: 3 })}</span>
      </div>
    </div>
  );
}
