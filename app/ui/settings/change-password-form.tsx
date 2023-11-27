'use client';
import { Input } from '@nextui-org/input';
import { useEffect, useRef, useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { useFormState } from 'react-dom';
import { ChangePasswordState, changePassword } from '@/app/lib/actions';
import toast from 'react-hot-toast';
import { SubmitButton } from '../submit-button';

type Props = {
  className: string;
};

export default function ChangePasswordForm({ className }: Props) {
  const initialState: ChangePasswordState = {
    message: null,
    errors: {},
    status: 'iddle',
  };
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useFormState(changePassword, initialState);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!!state.message) {
      if (state.status === 'error') {
        toast.error(state.message);
      }
      if (state.status === 'success') {
        toast.success(state.message);
        if (formRef.current) {
          formRef.current.reset();
        }
      }
    }
  }, [state]);

  return (
    <form ref={formRef} className={className} action={action}>
      <Input
        name='new_password'
        label='Password'
        variant='bordered'
        labelPlacement='outside'
        placeholder='Enter your new password'
        errorMessage={
          state.errors?.password &&
          state.errors.password.map((error: string) => (
            <p key={error}>{error}</p>
          ))
        }
        type={isVisible ? 'text' : 'password'}
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
      />
      <Input
        label='Confirm Password'
        name='confirm_password'
        variant='bordered'
        labelPlacement='outside'
        placeholder='Confirm your new password'
        errorMessage={
          state.errors?.confirm_password &&
          state.errors.confirm_password.map((error: string) => (
            <p key={error}>{error}</p>
          ))
        }
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
      />
      <SubmitButton color='primary' className='font-bold'>
        Change
      </SubmitButton>
    </form>
  );
}
