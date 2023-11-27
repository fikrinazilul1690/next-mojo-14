'use client';
import { cartCheckout } from '@/app/lib/actions';
import { useShipping } from '@/app/context/shipping-provider';
import { CheckoutItem, Item } from '@/app/lib/definitions';
import { useTotalCart } from '@/app/context/cart-provider';
import { SubmitButton } from '../submit-button';

export default function SingleCheckoutButton({
  items,
}: {
  items: CheckoutItem[];
}) {
  const shipping = useShipping();
  const [totalCart, updateTotalCart] = useTotalCart();
  const courierService = shipping((state) => state.courierService);
  const addressId = shipping((state) => state.addressId);
  const bank = shipping((state) => state.bank);
  return (
    <div className='flex justify-center items-center'>
      <form
        action={async () => {
          updateTotalCart(0);
          await cartCheckout.bind(
            null,
            courierService ?? '',
            addressId ?? 0,
            bank ?? '',
            items.map<Item>((item) => ({
              sku: item.sku,
              quantity: item.quantity,
            }))
          )();
        }}
      >
        <SubmitButton
          isDisabled={!!!addressId || !!!bank || !!!courierService}
          color='primary'
          variant='solid'
        >
          Checkout
        </SubmitButton>
      </form>
    </div>
  );
}
