'use client';
import React, { useEffect, useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import Link from 'next/link';
import { SubmitButton } from '../submit-button';
import { RegisterAdminState, registerAdmin } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';

export default function CreateAdminForm() {
  const initialState: RegisterAdminState = { message: null, errors: {} };
  const [state, action] = useFormState(registerAdmin, initialState);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!!state.message) {
      toast.error(state.message);
    }
  }, [state]);
  return (
    <form
      autoComplete='off'
      action={action}
      className='flex flex-col gap-4 w-full mb-24'
    >
      <Input
        variant='bordered'
        type='text'
        label='Name'
        placeholder='Enter Admin Name'
        labelPlacement='outside'
        radius='sm'
        name='name'
        errorMessage={
          !!state.errors?.name &&
          state.errors.name.map((error: string) => <p key={error}>{error}</p>)
        }
      />
      <Input
        variant='bordered'
        type='email'
        label='Email'
        placeholder='Enter Admin Email'
        labelPlacement='outside'
        radius='sm'
        name='email'
        errorMessage={
          !!state.errors?.email &&
          state.errors.email.map((error: string) => <p key={error}>{error}</p>)
        }
      />
      <Input
        variant='bordered'
        type='tel'
        label='Phone'
        placeholder='Enter Admin Phone'
        labelPlacement='outside'
        radius='sm'
        name='phone'
        errorMessage={
          !!state.errors?.phone &&
          state.errors.phone.map((error: string) => <p key={error}>{error}</p>)
        }
      />
      <Input
        variant='bordered'
        endContent={
          <button
            className='focus:outline-none'
            type='button'
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {isVisible ? (
              <AiFillEyeInvisible className='text-2xl text-default-400 pointer-events-none' />
            ) : (
              <AiFillEye className='text-2xl text-default-400 pointer-events-none' />
            )}
          </button>
        }
        type={isVisible ? 'text' : 'password'}
        label='Initial Password'
        placeholder='Enter The Admin Initial Password'
        labelPlacement='outside'
        radius='sm'
        name='password'
        errorMessage={
          !!state.errors?.password &&
          state.errors.password.map((error: string) => (
            <p key={error}>{error}</p>
          ))
        }
      />
      <div className='flex justify-end items-center gap-3'>
        <Button as={Link} href='/dashboard/admins'>
          Cancel
        </Button>
        <SubmitButton color='primary'>Save</SubmitButton>
      </div>
    </form>
  );
}
