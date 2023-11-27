import SideNav from '@/app/ui/sidenav';
import { Divider } from '@nextui-org/divider';

export default function UserInformationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen w-2/3 m-auto flex-col gap-1 md:flex-row md:overflow-hidden'>
      <div className='w-full flex-none md:w-64 md:py-12'>
        <SideNav />
      </div>
      <Divider className='h-full md:my-9' orientation='vertical' />
      <main className='flex-grow p-6 md:p-12'>{children}</main>
    </div>
  );
}
