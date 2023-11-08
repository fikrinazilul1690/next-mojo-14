import CartProvider from '@/app/context/cart-provider';
import ShippingProvider from '@/app/context/shipping-provider';
import { fetchTotalCart } from '@/app/lib/data';
import Footer from '@/app/ui/footer';
import Navbar from '@/app/ui/navbar';

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const totalCart = await fetchTotalCart();
  return (
    <CartProvider totalCart={totalCart}>
      <ShippingProvider>
        <Navbar />
        {children}
        <Footer />
      </ShippingProvider>
    </CartProvider>
  );
}
