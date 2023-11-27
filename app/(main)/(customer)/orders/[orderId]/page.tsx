import { fetchOrderDetails } from '@/app/lib/data';
import { formatIDR } from '@/app/lib/utils';
import ShippingHistories from '@/app/ui/order/shipping-history';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import Image from 'next/image';

export default async function Page({
  params,
}: {
  params: { orderId: string };
}) {
  const detailOrder = await fetchOrderDetails(params.orderId);
  console.log(detailOrder.courier);
  return (
    <main className='sm:w-3/5 mx-2 sm:mx-auto my-4'>
      <h1 className='text-2xl font-bold text-center m-5'>Checkout Product</h1>
      <div className='flex max-lg:flex-col max-lg:gap-4 lg:justify-between w-full items-start'>
        <ShippingHistories orderInfo={detailOrder} />
        <div className='w-1/2 flex flex-col gap-3'>
          <div className='w-full flex flex-col gap-2'>
            <div className='text-sm flex justify-between'>
              <span className='text-foreground-400'>Status :</span>
              <span className='font-bold'>
                {detailOrder.status.replace('_', ' ')}
              </span>
            </div>
            <div className='text-sm  flex justify-between'>
              <span className='text-foreground-400'>Destination :</span>
              <span className='font-bold w-3/5 text-end'>{`${detailOrder.destination.address}, ${detailOrder.destination.district}, ${detailOrder.destination.city}, ${detailOrder.destination.province}, ${detailOrder.destination.postal_code}`}</span>
            </div>
            <div className='text-sm  flex justify-between'>
              <span className='text-foreground-400'>Courier :</span>
              <span className='font-bold w-3/5 text-end'>
                {detailOrder.courier.company_name}
              </span>
            </div>
            <div className='text-sm  flex justify-between'>
              <span className='text-foreground-400'>Shipping Cost :</span>
              <span className='font-bold w-3/5 text-end'>
                {formatIDR(detailOrder.shipping_cost).replace(/(\.|,)00$/g, '')}
              </span>
            </div>
            <div className='text-sm  flex justify-between'>
              <span className='text-foreground-400'>Total :</span>
              <span className='font-bold w-3/5 text-end'>
                {formatIDR(detailOrder.total_cost).replace(/(\.|,)00$/g, '')}
              </span>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <span>Order Items :</span>
            {detailOrder.order_items.map((item, key) => (
              <Card key={key} fullWidth shadow='sm'>
                <CardBody className='flex-row h-40 justify-between items-start'>
                  <div className='flex w-3/4 h-full items-center gap-x-2'>
                    <div className='relative w-3/6 h-full'>
                      <Image
                        className='object-cover rounded-md'
                        src={item.image}
                        alt={item.name}
                        fill
                      />
                    </div>
                    <div className='flex h-full flex-col justify-center'>
                      <span className='font-bold text-lg'>{item.name}</span>
                      <div className='text-slate-400 text-sm flex gap-1'>
                        <span>{`qty: ${item.quantity}`}</span>
                        <span>x</span>
                        <span>
                          {formatIDR(item.price).replace(/(\.|,)00$/g, '')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='h-full w-2/6 flex items-center justify-center gap-4'>
                    <div className='h-3/5'>
                      <Divider orientation='vertical' />
                    </div>
                    <span className='font-bold'>
                      {formatIDR(item.total_price).replace(/(\.|,)00$/g, '')}
                    </span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
