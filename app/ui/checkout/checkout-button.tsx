'use client';
import { Button } from '@nextui-org/button';
import { useFormStatus } from 'react-dom';

export default function CheckoutButton({
  fromAction,
}: {
  fromAction?: () => void;
}) {
  const { pending } = useFormStatus();
  return (
    <form>
      <Button
        type='submit'
        isDisabled={pending}
        formAction={fromAction}
        color='primary'
        variant='solid'
      >
        Checkout
      </Button>
    </form>
  );
}
