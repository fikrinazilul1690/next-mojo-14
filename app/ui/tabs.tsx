'use client';
import { Tabs, Tab } from '@nextui-org/tabs';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  variant?: 'underlined' | 'solid' | 'light' | 'bordered';
  size?: 'lg' | 'md' | 'sm';
};

export default function NavTabs({ variant, size }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Tabs
      variant={variant}
      selectedKey={pathname.replace('/', '')}
      size={size}
      aria-label='Tabs variants'
      onSelectionChange={(key) => {
        router.push(`/${String(key)}`);
      }}
      className='mt-7'
    >
      <Tab key='cart' title='Cart' />
      <Tab key='wishlist' title='Wishlist' />
    </Tabs>
  );
}
