import ListPendingPayment from '@/app/ui/payment/list-pending-payment';
import { ListPaymentSkeleton } from '@/app/ui/skeleton';
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1 className='text-2xl font-bold text-center mb-10'>
        List Pending Transaction
      </h1>
      <Suspense fallback={<ListPaymentSkeleton />}>
        <ListPendingPayment />
      </Suspense>
    </div>
  );
}
