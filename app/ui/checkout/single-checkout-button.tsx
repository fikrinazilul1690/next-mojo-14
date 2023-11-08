'use client';
import React from 'react';
import CheckoutButton from './checkout-button';
import { singleCheckout } from '@/app/lib/actions';
import { useShipping } from '@/app/context/shipping-provider';
import { CheckoutItem, Item } from '@/app/lib/definitions';

export default function SingleCheckoutButton({
  items,
}: {
  items: CheckoutItem[];
}) {
  const shipping = useShipping();
  const courierService = shipping((state) => state.courierService);
  const addressId = shipping((state) => state.addressId);
  const bank = shipping((state) => state.bank);
  const handleSingleCheckout = singleCheckout.bind(
    null,
    courierService ?? '',
    addressId ?? 0,
    bank ?? '',
    items.map<Item>((item) => ({ sku: item.sku, quantity: item.quantity }))
  );
  return (
    <div className='flex justify-center items-center'>
      <CheckoutButton fromAction={handleSingleCheckout} />
    </div>
  );
}
