import { decryptToken } from '@/app/lib/data';
import ListItems from '@/app/ui/checkout/item-card';
import {
  CheckoutButtonSkeleton,
  CheckoutSummarySkeleton,
  SelectSkeleton,
} from '@/app/ui/skeleton';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { CardFooter } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const AddressSelect = dynamic(
  () => import('@/app/ui/checkout/address-select'),
  { ssr: false, loading: () => <SelectSkeleton /> }
);

const BankSelect = dynamic(() => import('@/app/ui/checkout/bank-select'), {
  ssr: false,
  loading: () => <SelectSkeleton />,
});

const CourierSelect = dynamic(
  () => import('@/app/ui/checkout/courier-select'),
  {
    ssr: false,
    loading: () => <SelectSkeleton />,
  }
);

const CheckoutSummary = dynamic(
  () => import('@/app/ui/checkout/checkout-sumarry'),
  {
    ssr: false,
    loading: () => <CheckoutSummarySkeleton />,
  }
);

const CheckoutButton = dynamic(
  () => import('@/app/ui/checkout/single-checkout-button'),
  {
    ssr: false,
    loading: () => <CheckoutButtonSkeleton />,
  }
);

export default async function Page({
  searchParams,
}: {
  searchParams: {
    token?: string;
  };
}) {
  const items = await decryptToken(searchParams.token);
  if (!items) notFound();
  return (
    <main className='sm:w-3/5 mx-2 sm:mx-auto my-4'>
      <h1 className='text-2xl font-bold text-center m-5'>Checkout Product</h1>
      <div className='flex max-lg:flex-col max-lg:gap-4 lg:justify-between w-full items-start'>
        <ListItems className='lg:w-1/2 w-full' items={items} />
        <Card shadow='sm' className='w-full lg:w-2/5 sticky top-20'>
          <CardHeader>
            <h1 className='font-bold text-xl'>Shipping And Payment Method</h1>
          </CardHeader>
          <CardBody className='gap-2'>
            <AddressSelect />
            <CourierSelect items={items} />
            <BankSelect />
          </CardBody>
          <CardFooter className='flex-col gap-3'>
            <CheckoutSummary items={items} />
            <CheckoutButton items={items} />
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
