import { Button } from '@nextui-org/react';
import { IoBagOutline } from 'react-icons/io5';
import React, { useMemo } from 'react';
import { CartItem } from '@/app/lib/definitions';
import { formatIDR } from '@/app/lib/utils';

type Props = {
  cart: CartItem[];
};

export default function CartCheckout({ cart }: Props) {
  const subTotal = useMemo(
    () =>
      cart
        ?.map((item) => item.price * item.quantity)
        .reduce((prev, current) => prev + current, 0),
    [cart]
  );
  return (
    <div className='flex flex-col gap-5 items-end'>
      <div className='flex justify-between w-full px-4 font-semibold'>
        <span>Total:</span>
        <span>{formatIDR(subTotal ?? 0, { maximumSignificantDigits: 3 })}</span>
      </div>
      <Button
        color='primary'
        variant='solid'
        startContent={<IoBagOutline size={18} />}
      >
        Checkout
      </Button>
    </div>
  );
}
