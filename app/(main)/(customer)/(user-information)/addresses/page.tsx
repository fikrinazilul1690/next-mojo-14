import AddressesList from '@/app/ui/addresses/list-address';
import { AddressesListSkeleton } from '@/app/ui/skeleton';
import { Button } from '@nextui-org/button';
import { AiOutlinePlus } from 'react-icons/ai';
import Link from 'next/link';
import { Suspense } from 'react';
import AddressProvider from '@/app/context/address-provider';

export default function Page() {
  return (
    <AddressProvider>
      <div className='flex flex-col gap-3 items-center justify-center w-full'>
        <div className='flex justify-between items-center w-full'>
          <h3 className='text-xl font-semibold'>List Address</h3>
          <Button
            as={Link}
            color='primary'
            href='/addresses/create'
            endContent={<AiOutlinePlus size={16} />}
          >
            Create Address
          </Button>
        </div>
        <Suspense fallback={<AddressesListSkeleton />}>
          <AddressesList />
        </Suspense>
      </div>
    </AddressProvider>
  );
}
