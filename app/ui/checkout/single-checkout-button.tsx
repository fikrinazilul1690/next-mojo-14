'use client';
import React from 'react';
import { singleCheckout } from '@/app/lib/actions';
import { useShipping } from '@/app/context/shipping-provider';
import { CheckoutItem, Item } from '@/app/lib/definitions';
import { SubmitButton } from '../submit-button';

export default function SingleCheckoutButton({
  items,
}: {
  items: CheckoutItem[];
}) {
  const shipping = useShipping();
  const courierService = shipping((state) => state.courierService);
  const addressId = shipping((state) => state.addressId);
  const bank = shipping((state) => state.bank);
  console.log('build button checkout');
  return (
    <div className='flex justify-center items-center'>
      <form
        action={singleCheckout.bind(
          null,
          courierService ?? '',
          addressId ?? 0,
          bank ?? '',
          items.map<Item>((item) => ({
            sku: item.sku,
            quantity: item.quantity,
          }))
        )}
      >
        <SubmitButton
          isDisabled={!!!addressId || !!!bank || !!!courierService}
          color='primary'
          variant='solid'
        >
          Checkout
        </SubmitButton>
      </form>
    </div>
  );
}
