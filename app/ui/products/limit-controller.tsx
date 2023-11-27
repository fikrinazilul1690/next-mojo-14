'use client';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { useDebouncedCallback } from 'use-debounce';
import { limitRange } from '@/app/lib/client-data';

export default function LimitController({ limit }: { limit: number }) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handleLimit = useDebouncedCallback((limit) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(1));
    if (!!Number(limit)) {
      if (limit >= 1 && limit <= 100) {
        params.set('limit', limit);
      }
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);
  return (
    <Autocomplete
      radius='sm'
      variant='underlined'
      label='Limit'
      className='w-28'
      type='number'
      isClearable={false}
      onInputChange={handleLimit}
      defaultInputValue={limit.toString()}
      defaultItems={limitRange}
      allowsCustomValue
    >
      {(item) => (
        <AutocompleteItem key={item.value}>{item.value}</AutocompleteItem>
      )}
    </Autocomplete>
  );
}
