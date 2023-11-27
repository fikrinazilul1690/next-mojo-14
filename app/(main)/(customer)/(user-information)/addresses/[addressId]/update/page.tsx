import { fetchDetailAddress } from '@/app/lib/data';
import UpdateAddressForm from '@/app/ui/addresses/update-form';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function Page({
  params,
}: {
  params: { addressId: string };
}) {
  const address = await fetchDetailAddress(params.addressId);
  if (!address) notFound();
  return (
    <div className='flex flex-col gap-3 items-center justify-center'>
      <h3 className='text-xl font-semibold'>Update Address</h3>
      <UpdateAddressForm
        address={address}
        className='flex flex-col w-full gap-3 items-center'
      />
    </div>
  );
}
