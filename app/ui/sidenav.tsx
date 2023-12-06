'use client';
import { Listbox, ListboxSection, ListboxItem } from '@nextui-org/listbox';
import { IconWrapper } from './icon-wrapper';
import { FiSettings } from 'react-icons/fi';
import { CiLock } from 'react-icons/ci';
import { SlLocationPin } from 'react-icons/sl';
import { MdOutlineMoneyOff } from 'react-icons/md';
import { TbShoppingCartDollar } from 'react-icons/tb';
import { useUser } from '../context/user-provider';

const listBar = [
  {
    role: ['customer', 'owner', 'admin'],
    name: 'Settings',
    key: 'settings',
    child: [
      {
        startContent: (
          <IconWrapper>
            <FiSettings size={24} />
          </IconWrapper>
        ),
        key: 'settings',
        href: '/settings',
        name: 'Setting',
      },
      {
        startContent: (
          <IconWrapper>
            <CiLock size={24} />
          </IconWrapper>
        ),
        key: 'change-password',
        href: '/settings/change-password',
        name: 'Change Password',
      },
    ],
  },
  {
    role: ['customer'],
    name: 'Address',
    key: 'address',
    child: [
      {
        startContent: (
          <IconWrapper>
            <SlLocationPin size={24} />
          </IconWrapper>
        ),
        key: 'addresses',
        href: '/addresses',
        name: 'List Address',
      },
    ],
  },
  {
    role: ['customer'],
    name: 'Orders',
    key: 'orders',
    child: [
      {
        startContent: (
          <IconWrapper>
            <MdOutlineMoneyOff size={24} />
          </IconWrapper>
        ),
        key: 'pending-transaction',
        href: '/payment/pending-transaction',
        name: 'Waiting for Payment',
      },
      {
        startContent: (
          <IconWrapper>
            <TbShoppingCartDollar size={24} />
          </IconWrapper>
        ),
        key: 'list-order',
        href: '/orders',
        name: 'List Order',
      },
    ],
  },
];

export default function SideNav() {
  const [user] = useUser();
  return (
    <Listbox aria-label='Actions' hideSelectedIcon>
      {listBar
        .filter((menu) => menu.role.includes(user?.role ?? ''))
        .map((menu) => (
          <ListboxSection key={menu.key} title={menu.name} showDivider>
            {menu.child.map((child) => (
              <ListboxItem
                startContent={child.startContent}
                key={child.key}
                href={child.href}
              >
                {child.name}
              </ListboxItem>
            ))}
          </ListboxSection>
        ))}
    </Listbox>
  );
}
