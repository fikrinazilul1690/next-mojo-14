'use client';
import { useDisclosure } from '@nextui-org/react';
import { useState, createContext, useContext } from 'react';
import { create } from 'zustand';
import { CustomerAddress } from '../lib/definitions';

type AddressActionType = 'update' | 'delete';

type State = {
  address: CustomerAddress | null;
  actionType: AddressActionType | null;
};

type Action = {
  reset: () => void;
  setAction: (address: CustomerAddress, type: AddressActionType) => void;
};

const initialState: State = {
  address: null,
  actionType: null,
};

// the store itself does not need any change
export const createStore = () =>
  create<State & Action>()((set, get) => ({
    ...initialState,
    reset: () =>
      set({
        ...initialState,
      }),
    setAction: (address, actionType) => {
      set(() => ({
        address,
        actionType,
      }));
    },
  }));

const AddressContext = createContext<ReturnType<typeof createStore> | null>(
  null
);

export const useAddress = () => {
  if (!AddressContext)
    throw new Error('useAddress must be used within a AddressProvider');
  return useContext(AddressContext)!;
};

const AddressProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(() => createStore());

  return (
    <AddressContext.Provider value={store}>{children}</AddressContext.Provider>
  );
};

export default AddressProvider;
