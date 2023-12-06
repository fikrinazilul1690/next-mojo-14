'use client';
import { fetchNtcColors } from '@/app/lib/client-data';
import { Color, SelectionProduct } from '@/app/lib/definitions';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function SelectColors({
  setSelectedColors,
}: {
  setSelectedColors: Dispatch<SetStateAction<SelectionProduct[]>>;
}) {
  const [search, setSearch] = useState('');
  const [filter] = useDebounce(search, 300);
  const {
    data: colors,
    isLoading,
    error,
    isError,
  } = useQuery<Color[], { status: number; message: string }>({
    queryKey: ['color', filter],
    queryFn: () => fetchNtcColors(filter),
    enabled: !!filter,
    retry: (_failureCount, error) => {
      return error.status !== 404;
    },
  });
  return (
    <Autocomplete
      variant='bordered'
      fullWidth
      label='Search colors'
      radius='sm'
      size='sm'
      isLoading={isLoading}
      labelPlacement='inside'
      inputValue={search}
      onInputChange={(value) => {
        setSearch(value);
      }}
      items={colors ?? []}
      errorMessage={isError && <div>{error.message}</div>}
      onSelectionChange={(e) => {
        setSearch('');
        const colorSlug = String(e);
        const color = colors?.find(
          (color) => color.name.replaceAll(' ', '-').toLowerCase() === colorSlug
        );
        if (color) {
          setSelectedColors((prev) =>
            prev.map((currSel) => {
              if (currSel.name === 'color') {
                if (
                  currSel.options.find(
                    (currOption) => currOption.value === color.name
                  )
                ) {
                  return currSel;
                }
                return {
                  ...currSel,
                  options: [
                    ...currSel.options,
                    { value: colorSlug, hex_code: color.hex },
                  ],
                };
              }
              return currSel;
            })
          );
        }
      }}
    >
      {(color) => (
        <AutocompleteItem
          textValue={color.name}
          key={color.name.replaceAll(' ', '-').toLowerCase()}
          value={color.name}
        >
          <div className='flex gap-2'>
            <span
              className={`block w-4 h-4`}
              style={{ backgroundColor: color.hex }}
            ></span>
            <span>{color.name.toLowerCase()}</span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
