'use client';

import { useCountdown } from '@/app/lib/hooks';
import { zeroPad } from '@/app/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function CountdownTimer({ expiryTime }: { expiryTime: string }) {
  const { hours, minutes, seconds, isPassed } = useCountdown(expiryTime);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (isPassed) {
      queryClient.invalidateQueries({ queryKey: ['payment'] });
    }
  }, [isPassed, queryClient]);

  return (
    <div className='flex items-center justify-center px-5 py-5'>
      <div className={isPassed ? 'text-danger' : 'text-warning'}>
        <h1 className='text-2xl text-center text-black mb-3'>
          Please finish your payment in
        </h1>
        <div className='text-4xl text-center flex w-full items-center justify-center'>
          <div className='w-24 mx-1 p-2 rounded-lg shadow-md'>
            <div className='font-mono leading-none'>{zeroPad(hours, 2)}</div>
            <div className='font-mono uppercase text-sm leading-none'>
              Hours
            </div>
          </div>
          <div className='text-2xl mx-1 font-extralight'>:</div>
          <div className='w-24 mx-1 p-2 rounded-lg shadow-md'>
            <div className='font-mono leading-none'>{zeroPad(minutes, 2)}</div>
            <div className='font-mono uppercase text-sm leading-none'>
              Minutes
            </div>
          </div>
          <div className='text-2xl mx-1 font-extralight'>:</div>
          <div className='w-24 mx-1 p-2 rounded-lg shadow-md'>
            <div className='font-mono leading-none'>{zeroPad(seconds, 2)}</div>
            <div className='font-mono uppercase text-sm leading-none'>
              Seconds
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
