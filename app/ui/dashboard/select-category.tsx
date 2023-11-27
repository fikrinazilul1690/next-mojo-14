'use client';
import { fetchCategoreis } from '@/app/lib/client-data';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { useQuery } from '@tanstack/react-query';

export default function SelectCategory() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['category'],
    queryFn: fetchCategoreis,
  });
  return (
    <Autocomplete
      fullWidth
      label='Category'
      radius='sm'
      isLoading={isLoading}
      labelPlacement='outside'
      placeholder='Enter Product Category'
      allowsCustomValue
      items={categories ?? []}
    >
      {(category) => (
        <AutocompleteItem key={category.name} value={category.name}>
          {category.name.toLowerCase()}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
