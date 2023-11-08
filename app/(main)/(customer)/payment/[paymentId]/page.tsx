import { fetchDetailPayment } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function Page({
  params,
}: {
  params: { paymentId: string };
}) {
  const detailPayment = await fetchDetailPayment(params.paymentId);
  if (!detailPayment) notFound();
  return (
    <div>
      <span>TODO</span>
      <pre>{JSON.stringify(detailPayment, null, 2)}</pre>
    </div>
  );
}
