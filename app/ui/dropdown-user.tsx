'use client';
import { Key, useCallback, useState } from 'react';
import { Avatar } from '@nextui-org/avatar';
import { Card } from '@nextui-org/card';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '@/app/lib/definitions';
import { AiOutlineUser } from 'react-icons/ai';
import { LuHeart, LuSettings, LuLogOut } from 'react-icons/lu';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { MdDashboardCustomize } from 'react-icons/md';
import { Listbox, ListboxItem } from '@nextui-org/listbox';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/lib/actions';

export default function DropdownUser({ user }: { user: User }) {
  const router = useRouter();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };
  const onAction = useCallback(
    (key: Key) => {
      if (key !== 'logout') {
        router.push(`/${key}`);
      }
    },
    [router]
  );
  return (
    <div
      className='relative p-1'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href='/settings'
        className='rounded-full block border-4 border-slate-300'
      >
        <Image
          src={
            user.profile_picture?.url ||
            `https://robohash.org/${user.name}?set=set1&size=34x34`
          }
          alt={user.name!}
          className='rounded-full'
          width={34}
          height={34}
        />
      </Link>
      {isDropdownVisible && (
        <Card
          radius='sm'
          className='absolute top-[50px] sm:-left-14 -left-24 z-10'
        >
          <>
            {user.role === 'customer' && (
              <Listbox
                className='w-40'
                variant='light'
                aria-label='Listbox menu with icons'
                onAction={onAction}
              >
                <ListboxItem
                  key='info'
                  isReadOnly
                  textValue='Info'
                  className='h-14 gap-2'
                  startContent=<AiOutlineUser size={24} />
                >
                  <p className='font-semibold'>Signed in as</p>
                  <p className='font-semibold'>{user.name}</p>
                </ListboxItem>
                <ListboxItem
                  key='setting'
                  textValue='Setting'
                  startContent={<LuSettings size={24} />}
                >
                  Settings
                </ListboxItem>
                <ListboxItem
                  key='wishlist'
                  textValue='Wishlist'
                  startContent={<LuHeart size={24} />}
                >
                  Wishlist
                </ListboxItem>
                <ListboxItem
                  key='my-orders'
                  textValue='My Orders'
                  startContent={<LiaShippingFastSolid size={24} />}
                >
                  My Orders
                </ListboxItem>
                <ListboxItem
                  key='logout'
                  color='danger'
                  className='text-danger'
                  textValue='Logout'
                  startContent={<LuLogOut size={24} />}
                  onPress={async () => {
                    await logout();
                  }}
                >
                  Logout
                </ListboxItem>
              </Listbox>
            )}
            {(user.role === 'admin' || user.role === 'owner') && (
              <Listbox
                className='w-40'
                variant='light'
                aria-label='Listbox menu with icons'
                onAction={onAction}
              >
                <ListboxItem
                  key='info'
                  isReadOnly
                  textValue='Info'
                  className='h-14 gap-2'
                  startContent=<AiOutlineUser size={24} />
                >
                  <p className='font-semibold'>Signed in as</p>
                  <p className='font-semibold'>{user.name}</p>
                </ListboxItem>
                <ListboxItem
                  key='dashboard'
                  textValue='Dashboard'
                  startContent={<MdDashboardCustomize size={24} />}
                >
                  Dashboard
                </ListboxItem>
                <ListboxItem
                  key='logout'
                  color='danger'
                  className='text-danger'
                  textValue='Logout'
                  startContent={<LuLogOut size={24} />}
                  onPress={async () => {
                    await logout();
                  }}
                >
                  Logout
                </ListboxItem>
              </Listbox>
            )}
          </>
        </Card>
      )}
    </div>
  );
}
