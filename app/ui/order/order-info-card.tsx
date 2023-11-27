import { OrderInfo } from '@/app/lib/definitions';
import { formatDateWithTime, formatIDR } from '@/app/lib/utils';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import Image from 'next/image';
import Link from 'next/link';

export function OrderInfoCard({ orderInfo }: { orderInfo: OrderInfo }) {
  const { order_items: orderItems } = orderInfo;
  console.log(orderInfo);
  return (
    <Card
      isPressable
      as={Link}
      href={`/orders/${orderInfo.id}`}
      fullWidth
      shadow='sm'
    >
      <CardHeader className='pb-0'>
        <span className='text-sm text-foreground-400'>
          {formatDateWithTime(new Date(orderInfo.created_at))}
        </span>
      </CardHeader>
      <CardBody className='flex-row h-40 justify-between items-start'>
        <div className='flex w-1/2 h-full items-center gap-x-2'>
          <div className='relative w-1/2 h-full'>
            <Image
              className='object-cover rounded-md'
              src={orderItems[0].image}
              alt={orderItems[0].name}
              fill
            />
          </div>
          <div className='flex h-full flex-col justify-between'>
            <div>
              <span className='font-bold text-lg'>{orderItems[0].name}</span>
              <div className='text-slate-400 text-sm flex gap-1'>
                <span>{`qty: ${orderItems[0].quantity}`}</span>
                <span>x</span>
                <span>
                  {formatIDR(orderItems[0].price).replace(/(\.|,)00$/g, '')}
                </span>
              </div>
            </div>
            {orderItems.length > 1 && (
              <span className='text-slate-400 text-sm'>{`+${
                orderItems.length - 1
              } more`}</span>
            )}
          </div>
        </div>
        <div className='h-full w-2/6 flex items-center justify-center gap-4'>
          <div className='h-3/5'>
            <Divider orientation='vertical' />
          </div>
          <div className='flex flex-col gap-1'>
            <span className='text-sm text-center'>Total Shopping</span>
            <span className='font-bold'>
              {formatIDR(orderItems[0].total_price).replace(/(\.|,)00$/g, '')}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default function ListOrderInfo({
  listOrderInfo,
}: {
  listOrderInfo: OrderInfo[];
}) {
  return listOrderInfo.map((orderInfo) => (
    <OrderInfoCard key={orderInfo.id} orderInfo={orderInfo} />
  ));
}
