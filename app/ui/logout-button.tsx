'use client';
import { Spinner } from '@nextui-org/spinner';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

export function LogoutButton({
  formAction,
  startContent,
}: {
  formAction?: string | ((formData: FormData) => void);
  startContent?: ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <div
      className={clsx('flex gap-2 items-center hover:text-danger-300', {
        'text-danger': !pending,
        'text-danger-50 cursor-not-allowed': pending,
      })}
    >
      {pending && !!startContent ? (
        <Spinner color='current' size='sm' />
      ) : (
        startContent
      )}
      <button type='submit' aria-disabled={pending} formAction={formAction}>
        Logout
      </button>
      {pending && !!!startContent ? (
        <Spinner color='current' size='sm' />
      ) : null}
    </div>
  );
}
