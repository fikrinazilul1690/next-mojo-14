import clsx from 'clsx';
import { AiOutlineCheck } from 'react-icons/ai';
import { GiSandsOfTime } from 'react-icons/gi';

export default function ProductType({ type }: { type: boolean }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-warning-100 text-black': type,
          'bg-green-500 text-white': !type,
        }
      )}
    >
      {type ? (
        <>
          Pre Order
          <GiSandsOfTime className='ml-1 w-4 text-black' />
        </>
      ) : null}
      {!type ? (
        <>
          Ready Stock
          <AiOutlineCheck className='ml-1 w-4 text-white' />
        </>
      ) : null}
    </span>
  );
}
