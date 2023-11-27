import { fetchDetailPayment } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { listBank } from '@/app/lib/client-data';
import { Divider } from '@nextui-org/divider';
import { formatIDR } from '@/app/lib/utils';
import PaymentStatus from '@/app/ui/payment/payment-status';
import dynamic from 'next/dynamic';
import { CountdownSkeleton } from '@/app/ui/skeleton';

export default async function Page({
  params,
}: {
  params: { paymentId: string };
}) {
  const detailPayment = await fetchDetailPayment(params.paymentId);
  if (!detailPayment) notFound();
  return (
    <main className='border max-w-3xl mx-auto rounded-lg mt-5'>
      <div className='py-10 px-7'>
        <h3 className='text-2xl font-semibold text-center'>Payment Details</h3>

        <PaymentStatus detailPayment={detailPayment}>
          <section className='my-4'>
            <div className='flex justify-between'>
              <span className='text-lg font-bold'>Payment Method</span>
              <Image
                alt={detailPayment.bank}
                src={
                  listBank.find((val) => val.code === detailPayment.bank)
                    ?.imageUrl ?? ''
                }
                width={120}
                height={100}
              />
            </div>
            <Divider className='my-2' />
          </section>
          <section className='my-4'>
            <div className='flex justify-between'>
              <div className='flex flex-col gap-2'>
                <span className='text-lg font-bold'>Virtual Account</span>
                <span className='text-lg'>{detailPayment.va_number}</span>
              </div>
            </div>
            <Divider className='my-2' />
          </section>
          <section className='my-4'>
            <div className='flex justify-between'>
              <div className='flex flex-col gap-2'>
                <span className='text-lg font-bold'>Payment Amount</span>
                <span className='text-lg'>
                  {formatIDR(detailPayment.gross_amount)}
                </span>
              </div>
            </div>
            <Divider className='my-2' />
          </section>
        </PaymentStatus>
      </div>
    </main>
  );
}
