'use client';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { useEffect, useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { useFormState } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
import toast from 'react-hot-toast';
import { SubmitButton } from '../submit-button';
import { useSearchParams } from 'next/navigation';

type Props = {
  className: string;
  callbackURL: string;
};

export default function LoginForm({ className, callbackURL }: Props) {
  const initialState = { message: null, errors: {} };
  const logitWithCallbackUrl = authenticate.bind(null, callbackURL);
  const [state, action] = useFormState(logitWithCallbackUrl, initialState);
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (!!state.message) {
      toast.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    if (!!error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className='flex flex-col gap-3 justify-center'>
      <form className={className} action={action}>
        <Input
          type='email'
          name='email'
          label='Email'
          variant='bordered'
          labelPlacement='outside'
          placeholder='Enter your email'
          errorMessage={
            state.errors?.email &&
            state.errors.email.map((error: string) => (
              <p key={error}>{error}</p>
            ))
          }
        />
        <Input
          label='Password'
          name='password'
          variant='bordered'
          labelPlacement='outside'
          placeholder='Enter your password'
          errorMessage={
            state.errors?.password &&
            state.errors.password.map((error: string) => (
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
          Masuk
        </SubmitButton>
      </form>
    </div>
  );
}
