'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiHomeAlt2 } from 'react-icons/bi';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { GiBoxUnpacking } from 'react-icons/gi';
import { LiaShippingFastSolid } from 'react-icons/lia';

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: BiHomeAlt2 },
  {
    name: 'Products',
    href: '/dashboard/products',
    icon: GiBoxUnpacking,
  },
  { name: 'Admins', href: '/dashboard/admins', icon: HiOutlineUserGroup },
  { name: 'Orders', href: '/dashboard/orders', icon: LiaShippingFastSolid },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              }
            )}
          >
            <LinkIcon size={24} />
            <p className='hidden md:block'>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
