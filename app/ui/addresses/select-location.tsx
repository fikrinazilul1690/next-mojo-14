'use client';
import { fetchLocations } from '@/app/lib/client-data';
import { Location } from '@/app/lib/definitions';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function SelectLocation({
  setLocation,
  errorMessage,
  value: defaultValue = '',
}: {
  setLocation: (location: Location) => void;
  errorMessage: ReactNode;
  value?: string;
}) {
  const [search, setSearch] = useState('');
  const [value, setValue] = useState(defaultValue);
  const [selectedKey, setSelectedKey] = useState<string | number | null>(null);
  const [filter] = useDebounce(search, 300);
  const { data: locations, isLoading } = useQuery({
    queryKey: ['location', filter],
    queryFn: () => fetchLocations(filter),
    enabled: !!filter,
  });
  return (
    <Autocomplete
      variant='bordered'
      fullWidth
      label='City / District / Postal Code'
      radius='sm'
      isLoading={isLoading}
      labelPlacement='outside'
      selectedKey={selectedKey}
      inputValue={value}
      onInputChange={(value) => {
        setSearch(value);
        setValue(value);
      }}
      onSelectionChange={(key) => {
        const location = locations?.find((loc) => loc.area_id === String(key));
        setSelectedKey(key);
        setValue(location?.name ?? '');
        if (location) {
          setLocation(location);
        }
      }}
      items={locations ?? []}
      errorMessage={errorMessage}
    >
      {(location) => (
        <AutocompleteItem key={location.area_id} value={location.name}>
          {location.name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
