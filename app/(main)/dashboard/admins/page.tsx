import { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchAdminsPage } from '@/app/lib/data';
import { getOffset } from '@/app/lib/utils';
import Pagination from '@/app/ui/pagination';
import AdminsTable from '@/app/ui/dashboard/admins-table';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { RegisterAdmin } from '@/app/ui/dashboard/admins-button';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const limit = 6;
  const currentPage = Number(searchParams?.page) || 1;
  const offset = getOffset(currentPage, limit);
  const { data } = await fetchAdminsPage({
    limit,
    offset,
  });

  return (
    <div className='w-full'>
      <div className='flex w-full items-start justify-between'>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Admins', href: '/dashboard/admins', active: true },
          ]}
        />
        <RegisterAdmin />
      </div>
      <Suspense key={currentPage} fallback={<div>Loading</div>}>
        <AdminsTable limit={limit} offset={offset} />
      </Suspense>
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={data.page} showControls />
      </div>
    </div>
  );
}
