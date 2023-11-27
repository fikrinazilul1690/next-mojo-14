'use client';
import { ListAddresses } from '@/app/lib/definitions';
import React, { useOptimistic } from 'react';
import ModalAddressConfirm from './modal-confirm';
import { useDisclosure } from '@nextui-org/react';
import dynamic from 'next/dynamic';

const AddressCard = dynamic(() => import('./address-card'), {
  ssr: false,
});

export default function ListAddressClient({
  listAddress: initialAddresses,
}: {
  listAddress: ListAddresses;
}) {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [listAddress, updateListAddressOptimistic] = useOptimistic(
    initialAddresses.sort((a, b) => {
      return a.id - b.id;
    })
  );
  return (
    <>
      {listAddress.length !== 0 ? (
        listAddress.map((address) => (
          <AddressCard onOpen={onOpen} address={address} key={address.id} />
        ))
      ) : (
        <div className='my-10 text-center'>
          <span className='text-lg font-bold'>
            Please add your address first
          </span>
        </div>
      )}
      <ModalAddressConfirm
        updateOptimistic={updateListAddressOptimistic}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
