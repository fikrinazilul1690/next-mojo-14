'use client';
import { Suspense, memo, useState } from 'react';
import {
  Navbar as NavbarUI,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import { LuSearch } from 'react-icons/lu';
import { useDisclosure } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import { ProductSearchModal } from '@/app/ui/search';
import { logout } from '@/app/lib/actions';
import { Link } from '@nextui-org/link';
import { useUser } from '@/app/context/user-provider';
import DropdownCart from './dropdown-cart';
import DropdownUser from './dropdown-user';
import { useFormStatus } from 'react-dom';
import clsx from 'clsx';
import { LogoutButton } from './logout-button';

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'About Us', href: '/about-us' },
];

const UserButton = memo(function UserButton() {
  const pathname = usePathname();
  const [user] = useUser();

  const searchParams = new URLSearchParams();
  searchParams.set('callbackUrl', pathname);

  return (
    <>
      {!!user ? (
        <>
          {user.role === 'customer' && <DropdownCart />}
          <DropdownUser user={user} />
        </>
      ) : (
        <>
          <NavbarItem className='sm:flex hidden font-bold'>
            <Button
              as={Link}
              className='font-bold'
              color='primary'
              href={`/login${
                pathname === '/register' ? '' : `?${searchParams}`
              }`}
              variant='light'
              isDisabled={pathname.startsWith('/login')}
            >
              Login
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              className='font-bold'
              as={Link}
              color='primary'
              href='/register'
              variant='solid'
              isDisabled={pathname === '/register'}
            >
              Register
            </Button>
          </NavbarItem>
        </>
      )}
    </>
  );
});

export default function Navbar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [user] = useUser();

  return (
    <>
      <NavbarUI
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent className='sm:hidden' justify='start'>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          />
        </NavbarContent>
        <NavbarContent justify='start'>
          <NavbarBrand>
            <p className='font-bold text-center text-lg sm:text-2xl'>
              Mojopahit
              <br />
              Furniture
            </p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent
          className='hidden sm:flex gap-4 text-xl font-bold'
          justify='center'
        >
          <NavbarItem isActive={pathname === '/'}>
            <Link color='foreground' href='/'>
              Home
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname.startsWith('/products')}>
            <Link color='foreground' href='/products'>
              Products
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname === '/about-us'}>
            <Link color='foreground' href='/settings'>
              About Us
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify='end' className='items-center'>
          <Button
            className='max-sm:hidden'
            size='md'
            startContent={<LuSearch size={18} />}
            onClick={onOpen}
          >
            Type to search...
          </Button>
          <UserButton />
        </NavbarContent>
        <NavbarMenu>
          <NavbarMenuItem key={'search-btn'}>
            <Button
              size='md'
              startContent={<LuSearch size={18} />}
              onClick={onOpen}
              fullWidth
            >
              Type to search...
            </Button>
          </NavbarMenuItem>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className='w-full'
                color={
                  item.name === 'Logout'
                    ? 'danger'
                    : item.name === 'Login'
                    ? 'primary'
                    : 'foreground'
                }
                href={item.href}
                size='lg'
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
          {!!!user ? (
            <NavbarMenuItem key={`login`}>
              <Link className='w-full' href={'/login'} size='lg'>
                Login
              </Link>
            </NavbarMenuItem>
          ) : (
            <NavbarMenuItem key={`logout`}>
              <form
                action={async () => {
                  localStorage.clear();
                  await logout();
                }}
              >
                <LogoutButton />
              </form>
            </NavbarMenuItem>
          )}
        </NavbarMenu>
      </NavbarUI>
      <Suspense>
        <ProductSearchModal isOpen={isOpen} onOpenChange={onOpenChange} />
      </Suspense>
    </>
  );
}
