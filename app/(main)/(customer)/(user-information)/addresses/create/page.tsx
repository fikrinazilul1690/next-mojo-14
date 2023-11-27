import CreateAddressForm from '@/app/ui/addresses/create-form';
import React from 'react';

export default function Page() {
  return (
    <div className='flex flex-col gap-3 items-center justify-center'>
      <h3 className='text-xl font-semibold'>Create Address</h3>
      <CreateAddressForm className='flex flex-col w-full gap-3 items-center' />
    </div>
  );
}
