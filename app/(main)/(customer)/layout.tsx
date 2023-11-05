import ShippingProvider from '@/app/context/shipping-address-provider';
import Footer from '@/app/ui/footer';
import Navbar from '@/app/ui/navbar';

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShippingProvider>
      <Navbar />
      {children}
      <Footer />
    </ShippingProvider>
  );
}
