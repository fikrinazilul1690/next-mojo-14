import { fetchCart } from '@/app/lib/data';
import CartTable from '@/app/ui/cart/cart-table';

export default async function Page() {
  const cart = await fetchCart();
  return <CartTable cart={cart} />;
}
