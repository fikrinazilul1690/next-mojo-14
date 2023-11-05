'use client';

import { RadioGroup } from '@nextui-org/react';
import { CustomRadio } from '@/app/ui/custom-radio';
import { Category } from '@/app/lib/definitions';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

// Todo: integrate with rtk query and revalidate

export default function CategoryFilter({
  category,
  categories,
  defaultValue,
  defaultValueLabel,
  className,
}: {
  category: string;
  categories: Category[];
  defaultValue: string;
  defaultValueLabel: string;
  className?: string;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handleChange = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', String(1));
      if (category) {
        params.set('category', category);
      } else {
        params.delete('category');
      }
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, replace, searchParams]
  );
  return (
    <RadioGroup
      className={`gap-1 justify-center ${className}`}
      classNames={{
        wrapper:
          'max-sm:justify-start flex-nowrap max-sm:overflow-x-scroll overflow-hidden',
      }}
      orientation='horizontal'
      value={category}
      onValueChange={handleChange}
    >
      <CustomRadio value={defaultValue}>{defaultValueLabel}</CustomRadio>
      {categories.map((val) => (
        <CustomRadio key={val.name} value={val.name}>
          {val.name}
        </CustomRadio>
      ))}
    </RadioGroup>
  );
}
