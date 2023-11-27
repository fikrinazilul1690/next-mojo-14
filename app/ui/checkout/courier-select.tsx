'use client';
import { useShipping } from '@/app/context/shipping-provider';
import { fetchCourierPricing } from '@/app/lib/client-data';
import { CheckoutItem, Item } from '@/app/lib/definitions';
import { formatIDR } from '@/app/lib/utils';
import { Select, SelectItem } from '@nextui-org/select';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';
import { IoIosArrowForward } from 'react-icons/io';

type Props = {
  items: CheckoutItem[];
};

export default function CourierSelect({ items }: Props) {
  const shipping = useShipping();
  const addressId = shipping((state) => state.addressId);
  const courierService = shipping((state) => state.courierService);
  const setCourier = shipping((state) => state.setCourier);
  const resetCourier = shipping((state) => state.resetCourier);
  const setShippingCost = shipping((state) => state.setShippingCost);
  const { data: session } = useSession();
  const {
    data: pricing,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['pricing', session?.accessToken, addressId, items],
    queryFn: () =>
      fetchCourierPricing(
        session?.accessToken ?? null,
        addressId ?? 0,
        items.map<Item>((item) => ({ sku: item.sku, quantity: item.quantity }))
      ),
    enabled: !!session?.accessToken && !!addressId,
  });

  const selectedCourier = useMemo(() => {
    const key = courierService?.split('_');
    if (key?.length === 2) {
      return pricing?.find(
        (data) =>
          data.courier_code === key[0] && data.courier_service_code === key[1]
      );
    }
  }, [pricing, courierService]);

  useEffect(() => {
    if (!!addressId && selectedCourier?.price !== undefined) {
      setShippingCost(selectedCourier.price);
    } else if (!courierService || courierService?.split('_').length !== 2) {
      resetCourier();
    }
  }, [
    setShippingCost,
    resetCourier,
    addressId,
    selectedCourier,
    courierService,
  ]);

  return (
    <Select
      isLoading={isLoading}
      isDisabled={!addressId}
      variant='bordered'
      items={pricing ?? []}
      label='Shipping Service'
      labelPlacement='outside'
      fullWidth
      classNames={{
        trigger: 'h-12',
      }}
      selectionMode='single'
      selectedKeys={
        isSuccess && selectedCourier
          ? new Set([
              `${selectedCourier.courier_code}_${selectedCourier.courier_service_code}`,
            ])
          : new Set()
      }
      onChange={(e) => {
        const value = e.target.value;
        if (value) {
          setCourier(value);
        }
      }}
      selectorIcon={<IoIosArrowForward />}
      renderValue={(items) => {
        return items.map((item) => (
          <div key={item.key} className='flex flex-col gap-0 p-1'>
            <div className='flex gap-1 items-center overflow-hidden'>
              <span className='font-bold'>{item.data?.courier_name}</span>
              {'-'}
              <span className='text-ellipsis'>
                {item.data?.courier_service_name}
              </span>
            </div>
            <div className='flex gap-2 items-center overflow-hidden'>
              <span className='font-bold text-sm'>
                {formatIDR(item.data?.price ?? 0).replace(/(\.|,)00$/g, '')}
              </span>
              <span className='text-default-500 text-tiny'>
                ({item.data?.duration})
              </span>
            </div>
          </div>
        ));
      }}
    >
      {(data) => (
        <SelectItem
          key={`${data.courier_code}_${data.courier_service_code}`}
          textValue={`${data.courier_code}_${data.courier_service_code}`}
        >
          <div className='flex flex-col gap-0 p-1'>
            <div className='flex gap-1 items-center overflow-hidden'>
              <span className='font-bold'>{data.courier_name}</span>
              {'-'}
              <span className='text-ellipsis'>{data.courier_service_name}</span>
            </div>
            <div className='flex gap-2 items-center overflow-hidden'>
              <span className='font-bold text-sm'>
                {formatIDR(data.price).replace(/(\.|,)00$/g, '')}
              </span>
              <span className='text-default-500 text-tiny'>
                ({data.duration})
              </span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
}
