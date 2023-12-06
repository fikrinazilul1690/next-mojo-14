'use client';
import { fetchCategoreis } from '@/app/lib/client-data';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';

export default function SelectCategory({
  name,
  errorMessage,
  defaultValue,
}: {
  name: string;
  errorMessage?: ReactNode;
  defaultValue?: string;
}) {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['category'],
    queryFn: fetchCategoreis,
  });
  return (
    <Autocomplete
      variant='bordered'
      fullWidth
      label='Category'
      radius='sm'
      isLoading={isLoading}
      labelPlacement='outside'
      placeholder='Enter Product Category'
      allowsCustomValue
      items={categories ?? []}
      name={name}
      errorMessage={errorMessage}
      defaultInputValue={defaultValue}
    >
      {(category) => (
        <AutocompleteItem key={category.name} value={category.name}>
          {category.name.toLowerCase()}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
