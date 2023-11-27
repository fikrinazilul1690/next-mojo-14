'use client';
import { useShipping } from '@/app/context/shipping-provider';
import { fetchListAddress } from '@/app/lib/client-data';
import { Button } from '@nextui-org/button';
import { Select, SelectItem } from '@nextui-org/select';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { IoIosArrowForward } from 'react-icons/io';

export default function AddressSelect() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shipping = useShipping();
  const { data: session } = useSession();
  const {
    data: addresses,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['address', session?.accessToken],
    queryFn: () => fetchListAddress(session?.accessToken ?? null),
    enabled: !!session?.accessToken,
  });
  const addressId = shipping((state) => state.addressId);
  const setAddressId = shipping((state) => state.setAddressId);
  if (!(addresses?.length !== 0))
    return (
      <Button
        variant='bordered'
        className='justify-between'
        size='lg'
        fullWidth
        endContent={<IoIosArrowForward />}
        as={Link}
        href={`/addresses/create?${new URLSearchParams({
          callbackUrl: `${pathname}?${searchParams}`,
        })}`}
      >
        Create Address
      </Button>
    );
  return (
    <Select
      isLoading={isLoading}
      variant='bordered'
      items={addresses ?? []}
      label='Shipping Address'
      labelPlacement='outside'
      fullWidth
      classNames={{
        trigger: 'h-12',
      }}
      selectionMode='single'
      selectedKeys={
        isSuccess && addressId ? new Set([addressId.toString()]) : new Set()
      }
      selectorIcon={<IoIosArrowForward />}
      renderValue={(items) => {
        return items.map((item) => (
          <div key={item.key} className='flex flex-col gap-0 p-1'>
            <div className='flex gap-2 items-center'>
              <span>{item.data?.contact_name}</span>
              <span className='font-bold'>(+{item.data?.contact_phone})</span>
            </div>
            <span className='text-default-500 text-tiny'>
              {`${item.data?.address} - (${item.data?.district}, ${item.data?.city})`}
            </span>
          </div>
        ));
      }}
    >
      {(address) => (
        <SelectItem
          key={address.id.toString()}
          textValue={address.id.toString()}
          onPress={() => setAddressId(address.id)}
        >
          <div className='flex flex-col gap-0 p-1'>
            <div className='flex gap-2 items-center'>
              <span>{address.contact_name}</span>
              <span className='font-bold'>(+{address.contact_phone})</span>
            </div>
            <span className='text-default-500 text-tiny'>
              {`${address.address} - (${address.district}, ${address.city})`}
            </span>
          </div>
        </SelectItem>
      )}
    </Select>
  );
}
