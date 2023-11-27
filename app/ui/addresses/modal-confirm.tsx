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
  const addressStore = useAddress();
  const setAddressId = useShipping()((state) => state.setAddressId);
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
                      await deleteAddress(address.id);
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
