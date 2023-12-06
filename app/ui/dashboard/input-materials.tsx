'use client';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { SelectionProduct } from '@/app/lib/definitions';
import { Dispatch, SetStateAction, useState } from 'react';

export default function InputMaterials({
  setSelectedColors,
}: {
  setSelectedColors: Dispatch<SetStateAction<SelectionProduct[]>>;
}) {
  const [value, setValue] = useState('');
  return (
    <Input
      size='sm'
      value={value}
      label='Materials'
      variant='bordered'
      endContent={
        <Button
          size='sm'
          variant='solid'
          isDisabled={!!!value}
          onPress={() => {
            const materialSlug = value.replaceAll(' ', '-').toLowerCase();
            setSelectedColors((prev) =>
              prev.map((currSel) => {
                if (currSel.name === 'material') {
                  if (
                    currSel.options.find(
                      (currOption) => currOption.value === materialSlug
                    )
                  ) {
                    return currSel;
                  }
                  return {
                    ...currSel,
                    options: [...currSel.options, { value: materialSlug }],
                  };
                }
                return currSel;
              })
            );
            setValue('');
          }}
        >
          Add
        </Button>
      }
      type='text'
      onValueChange={setValue}
    />
  );
}
