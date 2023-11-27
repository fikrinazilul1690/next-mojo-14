'use client';

import React from 'react';
import { Card, CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import clsx from 'clsx';
import { AiOutlineCheck } from 'react-icons/ai';
import { CustomerAddress } from '@/app/lib/definitions';
import { useShipping } from '@/app/context/shipping-provider';
import Link from 'next/link';
import { useAddress } from '@/app/context/address-provider';

type Props = {
  address: CustomerAddress;
  onOpen: () => void;
};

export default function AddressCard({ address, onOpen }: Props) {
  const shipping = useShipping();
  const addressId = shipping((state) => state.addressId);
  const setAddressId = shipping((state) => state.setAddressId);
  const addressStore = useAddress();
  const setAction = addressStore((state) => state.setAction);
  return (
    <Card
      shadow='sm'
      classNames={{
        base: [
          'w-full',
          clsx({
            'bg-primary-50 border border-primary': address.id === addressId,
          }),
        ],
      }}
    >
      <CardBody>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-1 w-3/4'>
            <div className='flex gap-3 items-center mb-3'>
              {address.is_primary && (
                <Chip
                  className='text-white font-extrabold bg-slate-400'
                  radius='sm'
                >
                  Utama
                </Chip>
              )}
            </div>
            <span className='font-bold'>{address.contact_name}</span>
            <span>{address.contact_phone}</span>
            <span>{address.address}</span>
            <div className='flex gap-3 items-center my-3'>
              <Button
                color='primary'
                className='inline h-fit p-0 text-primary bg-transparent'
                variant='solid'
                disableRipple
                as={Link}
                href={`/addresses/${address.id}/update`}
              >
                Ubah Alamat
              </Button>
              {!address.is_primary && (
                <Button
                  color='primary'
                  className='inline h-fit p-0 text-primary bg-transparent'
                  variant='solid'
                  disableRipple
                  onClick={() => {
                    setAction(address, 'update');
                    onOpen();
                  }}
                >
                  Jadikan Alamat Utama & Pilih
                </Button>
              )}
              {!address.is_primary && (
                <Button
                  color='danger'
                  className='inline h-fit p-0 text-danger bg-transparent'
                  variant='solid'
                  disableRipple
                  onClick={() => {
                    setAction(address, 'delete');
                    onOpen();
                  }}
                >
                  Hapus
                </Button>
              )}
            </div>
          </div>
          {address.id === addressId ? (
            <Button
              color='primary'
              isIconOnly
              className='text-primary bg-transparent'
              isDisabled
              variant='solid'
            >
              <AiOutlineCheck size={24} />
            </Button>
          ) : (
            <Button
              color='primary'
              onClick={() => setAddressId(address.id)}
              variant='solid'
            >
              Pilih
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
