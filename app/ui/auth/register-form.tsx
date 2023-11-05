'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { useFormState, useFormStatus } from 'react-dom';
import { register } from '@/app/lib/actions';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Props = {
  className: string;
};

export default function RegisterForm(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, action] = useFormState(register, initialState);
  const [isVisible, setIsVisible] = useState(false);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (!!state.message) {
      toast.error(state.message);
    }
  }, [state]);
  return (
    <form {...props} action={action}>
      <Input
        type='text'
        name='name'
        label='Name'
        variant='bordered'
        labelPlacement='outside'
        placeholder='Enter your name'
        errorMessage={
          !!state.errors?.name &&
          state.errors.name.map((error: string) => <p key={error}>{error}</p>)
        }
        isInvalid={!!state.errors?.name}
      />
      <Input
        name='email'
        type='email'
        label='Email'
        variant='bordered'
        labelPlacement='outside'
        placeholder='Enter your email'
        errorMessage={
          !!state.errors?.email &&
          state.errors.email.map((error: string) => <p key={error}>{error}</p>)
        }
        isInvalid={!!state.errors?.email}
      />
      <Input
        type='tel'
        name='phone'
        label='Phone'
        variant='bordered'
        labelPlacement='outside'
        placeholder='Enter your phone number'
        errorMessage={
          !!state.errors?.phone &&
          state.errors.phone.map((error: string) => <p key={error}>{error}</p>)
        }
        isInvalid={!!state.errors?.phone}
      />
      <Input
        label='Password'
        name='password'
        variant='bordered'
        labelPlacement='outside'
        placeholder='Enter your password'
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
        errorMessage={
          !!state.errors?.password &&
          state.errors.password.map((error: string) => (
            <p key={error}>{error}</p>
          ))
        }
        isInvalid={!!state.errors?.password}
      />
      <Input
        label='Confirm Password'
        name='confirm_password'
        variant='bordered'
        labelPlacement='outside'
        placeholder='Confirm your password'
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
        errorMessage={
          !!state.errors?.confirm_password &&
          state.errors.confirm_password.map((error: string) => (
            <p key={error}>{error}</p>
          ))
        }
        isInvalid={!!state.errors?.password || !!state.errors?.confirm_password}
      />
      <Button
        isDisabled={pending}
        type='submit'
        color='primary'
        className='font-bold'
      >
        Daftar
      </Button>
    </form>
  );
}
