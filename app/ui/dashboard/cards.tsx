import { fetchCardData } from '@/app/lib/data';
import { HiOutlineBanknotes, HiOutlineClock } from 'react-icons/hi2';
import { GrTransaction } from 'react-icons/gr';
import { TbTruckDelivery } from 'react-icons/tb';

const iconMap = {
  collected: HiOutlineBanknotes,
  transactions: GrTransaction,
  pending: HiOutlineClock,
  orders: TbTruckDelivery,
};

export default async function Cards() {
  const { totalPaid, totalPendingPayment, totalOrders, totalTransactions } =
    await fetchCardData();
  return (
    <>
      {/* NOTE: comment in this code when you get to this point in the course */}

      <Card title='Collected' value={totalPaid} type='collected' />
      <Card title='Pending' value={totalPendingPayment} type='pending' />
      <Card title='Total Orders' value={totalOrders} type='orders' />
      <Card
        title='Total Transactions'
        value={totalTransactions}
        type='transactions'
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'orders' | 'transactions' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className='rounded-xl bg-gray-50 p-2 shadow-sm'>
      <div className='flex p-4'>
        {Icon ? <Icon className='h-5 w-5 text-gray-700' /> : null}
        <h3 className='ml-2 text-sm font-medium'>{title}</h3>
      </div>
      <p className='truncate rounded-xl bg-white px-4 py-8 text-center text-2xl'>
        {value}
      </p>
    </div>
  );
}
