import Breadcrumbs from '@/app/ui/breadcrumbs';
import CreateAdminForm from '@/app/ui/dashboard/create-admin-form';

export default async function Page() {
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Admins', href: '/dashboard/admins' },
          {
            label: 'Register Admin',
            href: '/dashboard/admins/create',
            active: true,
          },
        ]}
      />
      <CreateAdminForm />
    </>
  );
}
