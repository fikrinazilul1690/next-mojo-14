'use client';
import Image from 'next/image';
import { formatIDR } from '@/app/lib/utils';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/table';
import { DeleteProduct, UpdateProduct } from './product-button';
import { OrderInfo } from '@/app/lib/definitions';
import { useOptimistic } from 'react';
import { Chip } from '@nextui-org/chip';
import { RequestPickUp } from './orders-button';
import { requestPickUp } from '@/app/lib/actions';

const columns = [
  { name: 'Order ID', uid: 'id' },
  { name: 'Items', uid: 'item' },
  { name: 'Buyyer', uid: 'buyyer' },
  { name: 'Status', uid: 'status' },
  { name: 'Destination', uid: 'destination' },
  { name: 'Total Cost', uid: 'total-cost' },
  { name: '', uid: 'actions' },
];

export default function OrdersTableClient({ orders }: { orders: OrderInfo[] }) {
  const [optimisticOrders, updateOptimisticOrders] = useOptimistic(orders);
  return (
    <Table aria-label='Products tabel'>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={'center'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'No rows to display.'} items={optimisticOrders}>
        {(order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id.toUpperCase()}</TableCell>
            <TableCell>
              <div className='mb-2 flex items-center'>
                <Image
                  src={order.order_items[0].image}
                  className='mr-2 rounded-sm'
                  width={34}
                  height={34}
                  alt={`${order.order_items[0].name}`}
                />
                <p>
                  {order.order_items.length > 1
                    ? `${order.order_items[0].name} and ${
                        order.order_items.length - 1
                      } more`
                    : order.order_items[0].name}
                </p>
              </div>
            </TableCell>
            <TableCell>{order.buyyer.email}</TableCell>
            <TableCell>
              <Chip>{order.status.replaceAll('_', ' ')}</Chip>
            </TableCell>
            <TableCell>{order.destination.address}</TableCell>
            <TableCell>
              <p className='text-xl font-medium'>
                {formatIDR(order.total_cost ?? 0).replace(/(\.|,)00$/g, '')}
              </p>
            </TableCell>
            <TableCell>
              {order.status === 'on_progress' && (
                <RequestPickUp
                  action={async () => {
                    updateOptimisticOrders((pendingState) =>
                      pendingState.map((state) => {
                        if (state.id === order.id) {
                          state.status = 'confirmed';
                        }
                        return state;
                      })
                    );
                    await requestPickUp(order.id);
                  }}
                />
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
