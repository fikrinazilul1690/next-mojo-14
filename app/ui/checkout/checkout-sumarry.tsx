'use client';
import { useShipping } from '@/app/context/shipping-provider';
import { CheckoutItem } from '@/app/lib/definitions';
import { countSubTotal, formatIDR } from '@/app/lib/utils';
import React from 'react';

export default function CheckoutSummary({ items }: { items: CheckoutItem[] }) {
  const shippingCost = useShipping()((state) => state.shippingCost);
  const subTotal = countSubTotal(items);
  return (
    <div className='w-full flex flex-col gap-2 items-center'>
      <div className='w-full flex justify-between items-center'>
        <span className='font-bold'>Sub Total</span>
        <span>{formatIDR(subTotal, { maximumSignificantDigits: 3 })}</span>
      </div>
      <div className='w-full  flex justify-between items-center'>
        <span className='font-bold'>Shipping Cost</span>
        <span>{formatIDR(shippingCost, { maximumSignificantDigits: 3 })}</span>
      </div>
      <div className='w-full  flex justify-between items-center'>
        <span className='font-bold'>Grand Total</span>
        <span>
          {formatIDR(shippingCost + subTotal, { maximumSignificantDigits: 3 })}
        </span>
      </div>
    </div>
  );
}
