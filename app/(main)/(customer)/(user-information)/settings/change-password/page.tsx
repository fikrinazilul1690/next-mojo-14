import ChangePasswordForm from '@/app/ui/settings/change-password-form';
import React from 'react';

export default function Page() {
  return (
    <div className='flex flex-col gap-3 items-center justify-center'>
      <h3 className='text-xl font-semibold'>Change Password</h3>
      <ChangePasswordForm className='flex flex-col w-full gap-3 items-center' />
    </div>
  );
}
