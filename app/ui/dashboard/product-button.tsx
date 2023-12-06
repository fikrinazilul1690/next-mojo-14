'use client';
import Link from 'next/link';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/modal';
import { useDisclosure } from '@nextui-org/react';
import { Product } from '@/app/lib/definitions';

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

export function DeleteProduct({ product }: { product: Product }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Tooltip color='danger' content='Delete Product'>
        <Button onPress={onOpen} isIconOnly color='danger' variant='ghost'>
          <RiDeleteBin5Line />
        </Button>
      </Tooltip>
      <Modal placement='top' isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Delete Product
              </ModalHeader>
              <ModalBody>
                <p>Are you sure want to delete {product?.name} ?</p>
              </ModalBody>
              <ModalFooter>
                <Button color='default' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button
                  color='danger'
                  onPress={async () => {
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function UpdateProduct({ href }: { href: string }) {
  return (
    <Tooltip content='Edit Product'>
      <Button as={Link} href={href} isIconOnly variant='ghost'>
        <BiSolidEditAlt />
      </Button>
    </Tooltip>
  );
}
