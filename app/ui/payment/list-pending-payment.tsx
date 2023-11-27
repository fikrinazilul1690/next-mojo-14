import { fetchListPendingPayment } from '@/app/lib/data';
import React from 'react';
import ListPayment from './payment-card';

export default async function ListPendingPayment() {
  const listPendingPayment = await fetchListPendingPayment();
  return <ListPayment listPayment={listPendingPayment} />;
}
