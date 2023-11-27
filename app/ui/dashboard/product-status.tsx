import clsx from 'clsx';
import { AiOutlineCheck } from 'react-icons/ai';
import { RxCross2 } from 'react-icons/rx';

export default function ProductStatus({ status }: { status: boolean }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': !status,
          'bg-green-500 text-white': status,
        }
      )}
    >
      {!status ? (
        <>
          Inactive
          <RxCross2 className='ml-1 w-4 text-gray-500' />
        </>
      ) : null}
      {status ? (
        <>
          Active
          <AiOutlineCheck className='ml-1 w-4 text-white' />
        </>
      ) : null}
    </span>
  );
}
