'use client';
import { useShipping } from '@/app/context/shipping-provider';
import { listBank } from '@/app/lib/client-data';
import { Select, SelectItem } from '@nextui-org/select';
import Image from 'next/image';
import { IoIosArrowForward } from 'react-icons/io';

export default function BankSelect() {
  const checkout = useShipping();
  const bank = checkout((state) => state.bank);
  const setBank = checkout((state) => state.setBank);
  return (
    <Select
      variant='bordered'
      items={listBank}
      label='Payment Method'
      labelPlacement='outside'
      fullWidth
      classNames={{
        trigger: 'h-12',
      }}
      selectionMode='single'
      selectedKeys={bank ? new Set([bank]) : new Set()}
      selectorIcon={<IoIosArrowForward />}
      renderValue={(items) => {
        return items.map((item) => (
          <Image
            key={item.key}
            src={item.data?.imageUrl ?? ''}
            alt={item.data?.name ?? 'broken'}
            width={100}
            height={100}
            style={{ width: 'auto', height: 'auto' }}
          />
        ));
      }}
    >
      {(bank) => (
        <SelectItem
          key={bank.code}
          textValue={bank.code}
          onPress={() => setBank(bank.code)}
        >
          <Image
            src={bank.imageUrl}
            alt={bank.name}
            width={100}
            height={100}
            style={{ width: 'auto', height: 'auto' }}
          />
        </SelectItem>
      )}
    </Select>
  );
}
