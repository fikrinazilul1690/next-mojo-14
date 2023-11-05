'use client';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { Button, ButtonGroup } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { TbShoppingCartPlus } from 'react-icons/tb';
import { IoBagOutline } from 'react-icons/io5';
import { Select, SelectItem } from '@nextui-org/select';
import { ChangeEvent, useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product, Variant } from '@/app/lib/definitions';
import { formatIDR } from '@/app/lib/utils';

type Props = {
  product: Product;
  selectedVariant: Variant;
};

export default function ProductAction({
  product,
  selectedVariant: variant,
}: Props) {
  //   const queryClient = useQueryClient();
  const [qty, setQty] = useState<number>(1);
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams);
      const variant = product.variant.find(
        (variant) => variant.sku === e.target.value
      );
      if (variant) {
        params.set('sku', variant.sku);
        replace(`/products/${product.id}?${params}`, { scroll: false });
      }
    },
    [product.id, product.variant, replace, searchParams]
  );

  return (
    <Card shadow='none'>
      <CardHeader className='flex-col p-0 items-start'>
        <h1 className='text-2xl font-bold'>Quantity</h1>
      </CardHeader>
      <CardBody className='px-0 items-center gap-5'>
        <div className='flex w-full justify-between items-center'>
          {!!variant.stock && (
            <span className='self-start'>Stock: {variant.stock}</span>
          )}
        </div>
        {product.customizable && (
          <Select
            variant='underlined'
            label='Product Variant'
            placeholder='Select variant'
            className='max-w-xs'
            defaultSelectedKeys={[variant.sku]}
            onChange={handleChange}
          >
            {product?.variant.map((val) => (
              <SelectItem key={val.sku} value={val.sku}>
                {val.variant_name.replace('_', '-')}
              </SelectItem>
            ))}
          </Select>
        )}
        <ButtonGroup>
          <Button
            isDisabled={qty <= 1}
            variant='bordered'
            onClick={() => {
              if (qty > 1) setQty(qty - 1);
            }}
          >
            <AiOutlineMinus size={18} />
          </Button>
          <Input
            isDisabled={!!variant.stock ? qty > variant.stock : false}
            classNames={{
              input: 'text-center',
            }}
            type='number'
            variant='bordered'
            className='w-16'
            radius='none'
            value={qty.toString()}
            onChange={(e) => {
              const result = e.target.value;
              const numQty = Number(result);

              if (!!!numQty) {
                setQty(0);
                return;
              }

              if (!!!variant.stock) return setQty(numQty);

              if (numQty <= variant.stock) return setQty(numQty);
            }}
            onBlur={(e) => {
              if (qty === 0) {
                setQty(1);
              }
            }}
          />
          <Button
            variant='bordered'
            isDisabled={!!variant.stock ? qty === variant.stock : false}
            onClick={() => setQty(qty + 1)}
          >
            <AiOutlinePlus size={18} />
          </Button>
        </ButtonGroup>
      </CardBody>
      <CardFooter className='px-0 flex-col gap-3'>
        <span className='text-xl font-bold self-start'>
          Total:{' '}
          {formatIDR(variant.price * (Number(qty) || 1), {
            maximumSignificantDigits: 3,
          })}
        </span>
        <Button
          isDisabled={!!variant.stock ? qty > variant.stock : qty === 0}
          fullWidth
          variant='solid'
          color='primary'
          className='hover:bg-primary/80'
          startContent={<TbShoppingCartPlus size={24} />}
        >
          Add to Cart
        </Button>
        <Button
          isDisabled={!!variant.stock ? qty > variant.stock : qty === 0}
          fullWidth
          variant='ghost'
          startContent={<IoBagOutline size={24} />}
        >
          Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
