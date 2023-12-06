'use client';
import Link from 'next/link';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';
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
import { User } from '@/app/lib/definitions';

export function RegisterAdmin() {
  return (
    <Button
      as={Link}
      href='/dashboard/admins/create'
      color='primary'
      variant='solid'
    >
      <div className='flex gap-2 items-center'>
        <span className='font-bold'>Register New Admin</span>
        <AiOutlinePlus size={16} />
      </div>
    </Button>
  );
}

export function DeleteAdmin({
  user,
  deleteAction,
}: {
  user: User;
  deleteAction: () => Promise<void>;
}) {
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
                Delete Admin
              </ModalHeader>
              <ModalBody>
                <p>Are you sure want to delete {user?.name}'s account ?</p>
              </ModalBody>
              <ModalFooter>
                <Button color='default' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button
                  color='danger'
                  onPress={async () => {
                    onClose();
                    await deleteAction();
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
