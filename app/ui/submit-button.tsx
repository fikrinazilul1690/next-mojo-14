'use client';

import { Button } from '@nextui-org/button';
import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton({
  size,
  className,
  color,
  variant,
  children,
  isDisabled,
  fullWidth,
  formAction,
  startContent,
  endContent,
  isIconOnly,
  radius,
}: {
  children: ReactNode;
  isDisabled?: boolean;
  isIconOnly?: boolean;
  color?:
    | 'danger'
    | 'warning'
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success';
  variant?:
    | 'shadow'
    | 'flat'
    | 'solid'
    | 'bordered'
    | 'light'
    | 'faded'
    | 'ghost';
  className?: string;
  fullWidth?: boolean;
  formAction?: string | ((formData: FormData) => void);
  startContent?: ReactNode;
  endContent?: ReactNode;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  size?: 'sm' | 'md' | 'lg';
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      size={size}
      fullWidth={fullWidth}
      formAction={formAction}
      type='submit'
      isDisabled={isDisabled}
      color={color}
      variant={variant}
      isLoading={pending}
      className={className}
      startContent={startContent}
      endContent={endContent}
      isIconOnly={isIconOnly}
      radius={radius}
    >
      {children}
    </Button>
  );
}
