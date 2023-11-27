'use client';
import { Pagination as PaginationComponent } from '@nextui-org/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Props = {
  totalPages: number;
  size?: 'sm' | 'md' | 'lg';
  showControls?: boolean;
  variant?: 'flat' | 'bordered' | 'faded' | 'light';
};

export default function Pagination({
  totalPages,
  showControls = false,
  size = 'md',
  variant = 'flat',
}: Props) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handlePage = (page: number) => {
    console.log(`Searching... ${page}`);
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <PaginationComponent
      size={size}
      variant={variant}
      showControls={showControls}
      page={Number(searchParams.get('page')) ?? 1}
      total={totalPages}
      onChange={handlePage}
    />
  );
}
