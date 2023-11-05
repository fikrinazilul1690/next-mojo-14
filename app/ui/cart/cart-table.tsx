'use client';
import { formatIDR } from '@/app/lib/utils';
import CartCheckout from '@/app/ui/cart/checkout';
import CustomerEmptyTable from '@/app/ui/customer-empty-table';
import Image from 'next/image';
import DeleteButton from '@/app/ui/delete-button';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/table';
import { CartItem } from '@/app/lib/definitions';

const columns = [
  {
    name: 'Products',
    uid: 'products',
  },
  {
    name: 'Price',
    uid: 'price',
  },
  {
    name: 'Quantity',
    uid: 'quantity',
  },
  {
    name: 'Sub Total',
    uid: 'subTotal',
  },
  {
    name: 'Action',
    uid: 'action',
  },
];

type Props = {
  cart: CartItem[];
};

export default function CartTable({ cart }: Props) {
  return (
    <Table
      removeWrapper
      classNames={{
        th: [
          'bg-transparent',
          'text-default-500',
          'border-b',
          'border-divider',
          'text-center',
          'text-base',
          'font-semibold',
        ],
        td: ['border-b', 'border-divider', 'text-center', 'first:text-start'],
      }}
      aria-label='Example static collection table'
      layout='fixed'
      bottomContent={<CartCheckout cart={cart} />}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn align='center' key={column.uid}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={<CustomerEmptyTable title='Your Cart Is Empty' />}
      >
        {cart.map((item) => (
          <TableRow key={item.sku}>
            <TableCell>
              <div className='flex gap-2 items-center'>
                <Image
                  src={item.image.url}
                  alt={item.image.name}
                  width={50}
                  height={50}
                />
                <div className='flex flex-col'>
                  <span className='text-small overflow-hidden'>
                    {item.name}
                  </span>
                  <span className='text-tiny text-default-400'>{item.sku}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              {formatIDR(item.price, { maximumSignificantDigits: 3 })}
            </TableCell>
            <TableCell>
              <input
                min='0'
                className='py-3 w-[70px] text-center [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:h-10 [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:h-10'
                type='number'
                value={item.quantity.toString()}
                onChange={() => {}}
              />
            </TableCell>
            <TableCell>
              {formatIDR(item.quantity * item.price, {
                maximumSignificantDigits: 3,
              })}
            </TableCell>
            <TableCell>
              <DeleteButton ariaLabel='delete from cart' variant='x' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
