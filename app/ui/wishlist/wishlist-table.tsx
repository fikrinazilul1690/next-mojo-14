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
import { useTotalCart } from '@/app/context/cart-provider';
import {
  CartActionState,
  WishlistActionState,
  addToCartFromWishlist,
  deleteWishlist,
} from '@/app/lib/actions';
import { useEffect, useOptimistic } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFormState } from 'react-dom';
import toast from 'react-hot-toast';

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

export default function WishlistTable({ wishlist: wishlistIntial }: Props) {
  const queryClient = useQueryClient();
  const [totalCart, updateTotalCart] = useTotalCart();
  const [wishlistOptimistic, updateWishlistOptimistic] =
    useOptimistic(wishlistIntial);
  const initialState: CartActionState = { status: 'iddle', message: null };
  const [cartState, formActionAddToCart] = useFormState(
    async (prevState: CartActionState, formData: FormData) => {
      updateTotalCart((pendingState) => {
        if (!!pendingState) {
          return pendingState + Number(formData.get('quantity'));
        }
      });
      const data = await addToCartFromWishlist(prevState, formData);
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      return data;
    },
    initialState
  );

  const [wishlistState, formActionDeleteWishlist] = useFormState(
    async (prevState: WishlistActionState, formData: FormData) => {
      updateWishlistOptimistic((pendingState) =>
        pendingState.filter((state) => state.sku !== formData.get('sku'))
      );
      return await deleteWishlist(prevState, formData);
    },
    initialState satisfies WishlistActionState
  );

  useEffect(() => {
    if (cartState.message) {
      if (cartState.status === 'error') {
        toast.error(cartState.message);
        return;
      }
      if (cartState.status === 'success') {
        toast.success(cartState.message);
        return;
      }
    }
  }, [cartState]);

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
        {wishlistOptimistic.map((item) => (
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
              {formatIDR(item.price).replace(/(\.|,)00$/g, '')}
            </TableCell>
            <TableCell>
              <div className='flex gap-3 h-5 justify-center items-center text-small'>
                <Button
                  variant='solid'
                  color='primary'
                  startContent={<TbShoppingCartPlus size={24} />}
                  onPress={() => {
                    const formData = new FormData();
                    formData.append('sku', item.sku);
                    formData.append('quantity', String(1));
                    formActionAddToCart(formData);
                  }}
                >
                  Add To Cart
                </Button>
                <Divider orientation='vertical' className='bg-black h-full' />
                <DeleteButton
                  onClick={() => {
                    const formData = new FormData();
                    formData.append('sku', item.sku);
                    formActionDeleteWishlist(formData);
                  }}
                  variant='bin'
                  ariaLabel='delete from wishlist'
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
