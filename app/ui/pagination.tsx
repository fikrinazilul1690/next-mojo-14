'use client';
import { Pagination as PaginationComponent } from '@nextui-org/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type Props = {
  totalPage: number;
  size?: 'sm' | 'md' | 'lg';
  showControls?: boolean;
  variant?: 'flat' | 'bordered' | 'faded' | 'light';
};

export default function Pagination({
  totalPage,
  showControls = false,
  size = 'md',
  variant = 'flat',
}: Props) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handlePage = useCallback(
    (page: number) => {
      console.log(`Searching... ${page}`);
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [replace, pathname, searchParams]
  );
  return (
    <PaginationComponent
      size={size}
      variant={variant}
      showControls={showControls}
      page={Number(searchParams.get('page')) ?? 1}
      total={totalPage}
      onChange={handlePage}
    />
  );
}
