'use client';
import { Skeleton } from '@nextui-org/skeleton';
import { Button } from '@nextui-org/button';
import { AiOutlineHeart } from 'react-icons/ai';
import { toogleWishlist } from '@/app/lib/actions';
import { useOptimistic } from 'react';
import { SubmitButton } from '../submit-button';

type Props = {
  isExist: boolean | undefined;
  sku: string;
  productId: number;
};

export default function WishlistButton({ sku, productId, isExist }: Props) {
  const [optimisticIsExist, updateOptimisticIsExist] = useOptimistic<
    boolean | undefined
  >(isExist);
  const handleToogle = toogleWishlist.bind(
    null,
    `/products/${productId}`,
    !!isExist
  );
  return (
    <form
      action={async () => {
        updateOptimisticIsExist((pendingState) => {
          if (pendingState !== undefined) {
            return !pendingState;
          }
        });
        await handleToogle(sku);
      }}
    >
      <SubmitButton
        color='danger'
        variant={optimisticIsExist ? 'solid' : 'bordered'}
        isIconOnly
      >
        <AiOutlineHeart size={24} />
      </SubmitButton>
    </form>
  );
}

export function WishlistButtonSkeleton() {
  return (
    <Skeleton className='rounded-md'>
      <Button isIconOnly>
        <AiOutlineHeart size={24} />
      </Button>
    </Skeleton>
  );
}
