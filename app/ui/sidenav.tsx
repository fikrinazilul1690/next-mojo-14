'use client';
import { Listbox, ListboxSection, ListboxItem } from '@nextui-org/listbox';
import { IconWrapper } from './icon-wrapper';
import { FiSettings } from 'react-icons/fi';
import { CiLock } from 'react-icons/ci';
import { SlLocationPin } from 'react-icons/sl';
import { MdOutlineMoneyOff } from 'react-icons/md';
import { TbShoppingCartDollar } from 'react-icons/tb';
import { useRouter } from 'next/navigation';

export default function SideNav() {
  return (
    <Listbox aria-label='Actions' hideSelectedIcon>
      <ListboxSection key='settings' title='Settings' showDivider>
        <ListboxItem
          startContent={
            <IconWrapper>
              <FiSettings size={24} />
            </IconWrapper>
          }
          key='settings'
          href='/settings'
        >
          Setting
        </ListboxItem>
        <ListboxItem
          startContent={
            <IconWrapper>
              <CiLock size={24} />
            </IconWrapper>
          }
          key='change-password'
          href='/settings/change-password'
        >
          Change Password
        </ListboxItem>
      </ListboxSection>
      <ListboxSection key='address' title='Address' showDivider>
        <ListboxItem
          startContent={
            <IconWrapper>
              <SlLocationPin size={24} />
            </IconWrapper>
          }
          key='addresses'
          href='/addresses'
        >
          Address List
        </ListboxItem>
      </ListboxSection>
      <ListboxSection key='orders' title='Orders' showDivider>
        <ListboxItem
          startContent={
            <IconWrapper>
              <MdOutlineMoneyOff size={24} />
            </IconWrapper>
          }
          key='pending-transaction'
          href='/payment/pending-transaction'
        >
          Waiting for Payment
        </ListboxItem>
        <ListboxItem
          startContent={
            <IconWrapper>
              <TbShoppingCartDollar size={24} />
            </IconWrapper>
          }
          key='order-list'
          href='/orders'
        >
          Order List
        </ListboxItem>
      </ListboxSection>
    </Listbox>
  );
}
