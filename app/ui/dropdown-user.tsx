'use client';
import { useState } from 'react';
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
import { LogoutButton } from './logout-button';

export default function DropdownUser({ user }: { user: User }) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };
  return (
    <div
      className='relative p-2'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href='/settings'
        className='flex relative w-[34px] h-[34px] justify-center items-center box-border overflow-hidden align-middle z-0 outline-none rounded-full ring-2 ring-offset-2 ring-offset-background ring-default transition-transform'
      >
        <Image
          src={user.profile_picture?.url || '/default-user.jpg'}
          alt={user.name!}
          className='rounded-full object-cover'
          fill
        />
      </Link>
      {isDropdownVisible && (
        <Card
          as='form'
          radius='sm'
          className='absolute top-[50px] sm:-left-14 -left-24 z-10'
        >
          <>
            {user.role === 'customer' && (
              <Listbox
                className='w-40'
                variant='light'
                aria-label='Listbox menu with icons'
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
                  key='settings'
                  textValue='Settings'
                  startContent={<LuSettings size={24} />}
                  href='/settings'
                >
                  Settings
                </ListboxItem>
                <ListboxItem
                  key='wishlist'
                  textValue='Wishlist'
                  href='/wishlist'
                  startContent={<LuHeart size={24} />}
                >
                  Wishlist
                </ListboxItem>
                <ListboxItem
                  key='my-orders'
                  textValue='My Orders'
                  href='/orders'
                  startContent={<LiaShippingFastSolid size={24} />}
                >
                  My Orders
                </ListboxItem>
                <ListboxItem key='logout' textValue='Logout'>
                  <LogoutButton
                    startContent={<LuLogOut size={24} />}
                    formAction={async () => {
                      localStorage.clear();
                      await logout();
                    }}
                  />
                </ListboxItem>
              </Listbox>
            )}
            {(user.role === 'admin' || user.role === 'owner') && (
              <Listbox
                className='w-40'
                variant='light'
                aria-label='Listbox menu with icons'
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
                  key='settings'
                  textValue='Settings'
                  startContent={<LuSettings size={24} />}
                  href='/settings'
                >
                  Settings
                </ListboxItem>
                <ListboxItem
                  key='dashboard'
                  textValue='Dashboard'
                  startContent={<MdDashboardCustomize size={24} />}
                  href='/dashboard'
                >
                  Dashboard
                </ListboxItem>
                <ListboxItem key='logout' textValue='Logout'>
                  <LogoutButton
                    formAction={async () => {
                      localStorage.clear();
                      await logout();
                    }}
                    startContent={<LuLogOut size={24} />}
                  />
                </ListboxItem>
              </Listbox>
            )}
          </>
        </Card>
      )}
    </div>
  );
}
