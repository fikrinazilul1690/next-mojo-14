'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { useAddress } from '@/app/context/address-provider';
import { ListAddresses } from '@/app/lib/definitions';
import { deleteAddress, selectPrimaryAddress } from '@/app/lib/actions';
import { useShipping } from '@/app/context/shipping-provider';
import { useQueryClient } from '@tanstack/react-query';

export default function ModalAddressConfirm({
  onOpenChange,
  isOpen,
  updateOptimistic,
}: {
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean;
  updateOptimistic: (
    action: ListAddresses | ((pendingState: ListAddresses) => ListAddresses)
  ) => void;
}) {
  const queryClient = useQueryClient();
  const addressStore = useAddress();
  const setAddressId = useShipping()((state) => state.setAddressId);
  const resetShipping = useShipping()((state) => state.reset);
  const addressId = useShipping()((state) => state.addressId);
  const actionType = addressStore((state) => state.actionType);
  const address = addressStore((state) => state.address);
  return (
    <Modal placement='top' isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              {actionType === 'delete' ? 'Delete Address' : 'Update Address'}
            </ModalHeader>
            <ModalBody>
              {actionType === 'delete' ? (
                <p>
                  Are you sure want to delete {address?.contact_name}&apos;s
                  address ?
                </p>
              ) : null}
              {actionType === 'update' ? (
                <p>
                  Are you sure want to select {address?.contact_name}&apos;s
                  address as primary address?
                </p>
              ) : null}
            </ModalBody>
            <ModalFooter>
              <Button color='default' variant='light' onPress={onClose}>
                Close
              </Button>
              {actionType === 'delete' ? (
                <Button
                  color='danger'
                  onPress={async () => {
                    onClose();
                    if (address) {
                      updateOptimistic((pendingState) =>
                        pendingState.filter(
                          (currentAddress) => currentAddress.id !== address.id
                        )
                      );
                      if (address.id === addressId) {
                        resetShipping();
                      }
                      await deleteAddress(address.id);
                      await queryClient.invalidateQueries({
                        queryKey: ['address'],
                      });
                    }
                  }}
                >
                  Delete
                </Button>
              ) : null}
              {actionType === 'update' ? (
                <Button
                  color='primary'
                  onPress={async () => {
                    onClose();
                    if (address) {
                      updateOptimistic((pendingState) =>
                        pendingState.map((currentAddress) => {
                          if (currentAddress.is_primary) {
                            currentAddress.is_primary = false;
                          }
                          if (currentAddress.id === address.id) {
                            currentAddress.is_primary = true;
                          }
                          return currentAddress;
                        })
                      );
                      setAddressId(address.id);
                      await selectPrimaryAddress(address.id);
                      await queryClient.invalidateQueries({
                        queryKey: ['address'],
                      });
                    }
                  }}
                >
                  Update
                </Button>
              ) : null}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
