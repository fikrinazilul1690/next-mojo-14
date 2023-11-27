import Link from 'next/link';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { AiOutlinePlus } from 'react-icons/ai';

export function CreateProduct() {
  return (
    <Button
      as={Link}
      href='/dashboard/products/create'
      color='primary'
      variant='solid'
    >
      <div className='flex gap-2 items-center'>
        <span className='font-bold'>Create Product</span>
        <AiOutlinePlus size={16} />
      </div>
    </Button>
  );
}

export function DeleteProduct() {
  return (
    <Tooltip color='danger' content='Delete Product'>
      <Button isIconOnly color='danger' variant='ghost'>
        <RiDeleteBin5Line />
      </Button>
    </Tooltip>
  );
}

export function UpdateProduct() {
  return (
    <Tooltip content='Edit Product'>
      <Button isIconOnly variant='ghost'>
        <BiSolidEditAlt />
      </Button>
    </Tooltip>
  );
}
