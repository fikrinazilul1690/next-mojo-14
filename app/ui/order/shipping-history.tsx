'use client';
import { History, OrderInfo } from '@/app/lib/definitions';
import { formatDateWithTime } from '@/app/lib/utils';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Chip } from '@nextui-org/chip';

export default function ShippingHistories({
  orderInfo,
}: {
  orderInfo: OrderInfo;
}) {
  const shippingHistories = orderInfo.order_history ?? [];
  return (
    <Card shadow='sm' className='max-w-[400px] h-[500px] overflow-y-auto'>
      <CardHeader className='pb-0 font-bold flex-col gap-3'>
        <span>Shipping Histories</span>
        {orderInfo.courier.tracking_id !== '' ? (
          <div className='flex flex-col gap-3'>
            <span className='text-foreground-400'>Waybill :</span>
            <span>{orderInfo.courier.tracking_id}</span>
          </div>
        ) : null}
      </CardHeader>

      {shippingHistories.length !== 0 ? (
        <CardBody className='w-full h-full'>
          {shippingHistories
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            )
            .map((history, key) => (
              <ShippingHistory key={key} shippingHistory={history} />
            ))}
        </CardBody>
      ) : (
        <CardBody className='rounded-md w-full h-full justify-center items-center'>
          <p className='font-bold text-4xl text-center'>
            Your order is being processed
          </p>
        </CardBody>
      )}
    </Card>
  );
}

export function ShippingHistory({
  shippingHistory,
}: {
  shippingHistory: History;
}) {
  return (
    <div className='h-28 px-3 flex justify-start gap-7 text-sm first:bg-primary-50 first:rounded-t-lg'>
      <div className='flex gap-3 h-4/5 w-12 my-auto'>
        <span className='text-foreground-400'>
          {formatDateWithTime(new Date(shippingHistory.updated_at))}
        </span>
        <Divider orientation='vertical' />
      </div>
      <div className='flex h-4/5 flex-col gap-3 my-auto'>
        <Chip
          className='bg-transparent'
          classNames={{ content: 'font-medium' }}
          variant='bordered'
        >
          {shippingHistory.status}
        </Chip>
        <span className='font-bold'>{shippingHistory.note}</span>
      </div>
    </div>
  );
}
