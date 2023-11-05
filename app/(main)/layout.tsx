import UserProvider from '@/app/context/user-provider';
import { fetchUser } from '@/app/lib/data';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = await fetchUser(session);
  return (
    <SessionProvider session={session}>
      <UserProvider user={user}>{children}</UserProvider>
    </SessionProvider>
  );
}
