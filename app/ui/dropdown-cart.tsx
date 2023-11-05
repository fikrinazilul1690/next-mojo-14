'use client';
import { Badge } from '@nextui-org/badge';
import { Button } from '@nextui-org/button';
import { Suspense, useState } from 'react';
import { LuShoppingCart } from 'react-icons/lu';
import { Listbox, ListboxItem } from '@nextui-org/listbox';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { fetchCart, fetchTotalCart } from '@/app/lib/client-data';
import { Card } from '@nextui-org/card';
import { Spinner } from '@nextui-org/spinner';
import Image from 'next/image';
import Link from 'next/link';

export default function DropdownCart() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const { data: session } = useSession();
  const { data: totalCart } = useQuery({
    queryKey: ['cart', session?.accessToken, { type: 'total' }],
    queryFn: () => fetchTotalCart(session),
    enabled: !!session?.accessToken,
  });
  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  return (
    <div
      className='relative p-1'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        radius='md'
        as={Link}
        href='/cart'
        isIconOnly
        className='bg-transparent'
        variant='light'
      >
        <Badge
          content={totalCart ?? ''}
          shape='circle'
          color='danger'
          size='md'
        >
          <LuShoppingCart size={24} />
        </Badge>
      </Button>
      {isDropdownVisible && (
        <Card radius='sm' className='absolute top-12 sm:-left-20 -left-28 z-10'>
          <Suspense
            fallback={
              <div className='w-[200px] h-[200px] flex justify-center items-center'>
                <Spinner size='lg' />
              </div>
            }
          >
            <CartContent />
          </Suspense>
        </Card>
      )}
    </div>
  );
}

function CartContent() {
  const { data: session } = useSession();
  const { data: cart } = useSuspenseQuery({
    queryKey: ['cart', session?.accessToken],
    queryFn: () => fetchCart(session),
  });
  return (
    <>
      {cart && (
        <Listbox
          classNames={{
            base: 'w-[200px]',
            list: 'max-h-[200px] overflow-y-auto',
          }}
          items={cart}
          label='Assigned to'
          selectionMode='none'
          variant='flat'
        >
          {(item) => (
            <ListboxItem key={item.sku} textValue={item.name}>
              <div className='flex gap-2 items-center'>
                <Image
                  src={item.image.url}
                  alt={item.image.name}
                  width={32}
                  height={32}
                />
                <div className='flex flex-col'>
                  <span className='text-small overflow-hidden'>
                    {item.name}
                  </span>
                  <span className='text-tiny text-default-400'>
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
            </ListboxItem>
          )}
        </Listbox>
      )}
    </>
  );
}
