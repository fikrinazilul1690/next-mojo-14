import NavTabs from '@/app/ui/tabs';

export default async function CartAndWishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='sm:w-7/12 sm:m-auto flex flex-col gap-5'>
      <NavTabs size='lg' variant='underlined' />
      {children}
    </main>
  );
}
