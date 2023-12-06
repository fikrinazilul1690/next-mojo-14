'use client';
import { fetchDetailPayment } from '@/app/lib/client-data';
import { DetailPayment } from '@/app/lib/definitions';
import { Button } from '@nextui-org/button';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Divider } from '@nextui-org/divider';
import { Accordion, AccordionItem } from '@nextui-org/react';
import React from 'react';
import { formatIDR } from '@/app/lib/utils';
import dynamic from 'next/dynamic';
import { CountdownSkeleton } from '../skeleton';

const CountdownTimer = dynamic(() => import('./countdown-timer'), {
  ssr: false,
  loading: () => <CountdownSkeleton />,
});

export default function PaymentStatus({
  detailPayment: initialData,
  children,
}: {
  detailPayment: DetailPayment;
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { data: detailPayment, refetch } = useQuery({
    queryKey: ['payment', session?.accessToken, initialData.id],
    queryFn: () =>
      fetchDetailPayment(session?.accessToken ?? null, initialData.id),
    enabled: !!session?.accessToken,
    initialData: initialData,
  });

  return (
    <>
      {detailPayment.status === 'pending' && (
        <section className='my-4'>
          <div className='flex justify-center items-center'>
            <CountdownTimer expiryTime={detailPayment.expiry_time} />
          </div>
        </section>
      )}
      {children}
      <section className='my-4'>
        <Accordion className='p-0'>
          <AccordionItem
            key='1'
            aria-label='Order Details'
            classNames={{
              title: ['font-bold'],
            }}
            title='Order Details'
          >
            {detailPayment?.order_items.map((item) => (
              <div key={item.product_sku} className='w-full'>
                <div className='w-full flex justify-between items-center'>
                  <div className='flex gap-1 flex-col'>
                    <span className='text-foreground-600 font-bold'>
                      {item.product_name}
                    </span>
                    <span className='text-foreground-600'>
                      {item.quantity} x{' '}
                      {formatIDR(item.product_price).replace(/(\.|,)00$/g, '')}
                    </span>
                  </div>
                  <span className='text-foreground-600 font-bold'>
                    {formatIDR(item.total_price).replace(/(\.|,)00$/g, '')}
                  </span>
                </div>
                <Divider className='my-2' />
              </div>
            ))}
            <div className='w-full'>
              <div className='flex gap-1 flex-col'>
                <span className='text-foreground-600 font-bold'>
                  Shipping Cost
                </span>
                <div className='flex justify-between items-center'>
                  <span className='text-foreground-600'>
                    {detailPayment?.courier_company}
                  </span>
                  <span className='text-foreground-600 font-bold'>
                    {formatIDR(detailPayment?.shipping_cost ?? 0).replace(
                      /(\.|,)00$/g,
                      ''
                    )}
                  </span>
                </div>
              </div>
              <Divider className='my-2' />
              <div className='flex justify-between items-center'>
                <span className='text-foreground-600 font-bold'>Total</span>
                <span className='text-foreground-600 font-bold'>
                  {formatIDR(detailPayment.gross_amount).replace(
                    /(\.|,)00$/g,
                    ''
                  )}
                </span>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
        <Divider className='my-2' />
      </section>
      <section className='my-4'>
        <div className='flex justify-between'>
          <div className='flex flex-col gap-2'>
            <span className='text-lg font-bold'>Status</span>
            <span
              className={`text-lg ${
                detailPayment.status === 'pending'
                  ? 'text-warning'
                  : detailPayment.status === 'success'
                  ? 'text-green-700'
                  : detailPayment.status === 'failure'
                  ? 'text-danger'
                  : ''
              }`}
            >
              {detailPayment.status}
            </span>
          </div>
        </div>
        <Divider className='my-2' />
      </section>
      <section className='my-4'>
        <div className='flex gap-5 items-center'>
          <Button
            onClick={() => refetch()}
            variant='bordered'
            fullWidth
            color='primary'
          >
            Cek Status Pembayaran
          </Button>
          <Button
            as={Link}
            href='/products'
            variant='solid'
            fullWidth
            color='primary'
          >
            Belanja Lagi
          </Button>
        </div>
      </section>
    </>
  );
}
