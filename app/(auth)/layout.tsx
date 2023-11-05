import Footer from '@/app/ui/footer';
import Navbar from '@/app/ui/auth/navbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
