'use client';
import { formatIDR } from '@/app/lib/utils';
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
import { WishlistItem } from '@/app/lib/definitions';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { TbShoppingCartPlus } from 'react-icons/tb';

type Props = {
  wishlist: WishlistItem[];
};

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
    name: 'Action',
    uid: 'action',
  },
];

export default function WishlistTable({ wishlist }: Props) {
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
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn align='center' key={column.uid}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={<CustomerEmptyTable title='Your Wishlist Is Empty' />}
      >
        {wishlist.map((item) => (
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
              <div className='flex gap-3 h-5 justify-center items-center text-small'>
                <Button
                  variant='solid'
                  color='primary'
                  startContent={<TbShoppingCartPlus size={24} />}
                >
                  Add To Cart
                </Button>
                <Divider orientation='vertical' className='bg-black h-full' />
                <DeleteButton variant='bin' ariaLabel='delete from wishlist' />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
