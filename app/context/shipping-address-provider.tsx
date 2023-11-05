'use client';
import { useState, createContext, useContext } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  addressId: number | null;
  courierService: string | null;
};

type Action = {
  reset: () => void;
  setAddressId: (addressId: number) => void;
  setCourier: (courierService: string) => void;
  resetCourier: () => void;
};

const initialState: State = {
  addressId: null,
  courierService: null,
};

// the store itself does not need any change
export const createStore = () =>
  create<State & Action>()(
    persist(
      (set, get) => ({
        ...initialState,
        reset: () =>
          set({
            addressId: null,
            courierService: null,
          }),
        setAddressId: (addressId) => {
          set(() => ({
            addressId,
          }));
          get().resetCourier();
        },
        setCourier: (courierService) =>
          set(() => ({
            courierService,
          })),
        resetCourier: () =>
          set(() => ({
            courierService: undefined,
          })),
      }),
      {
        name: 'shipping',
      }
    )
  );

const ShippingContext = createContext<ReturnType<typeof createStore> | null>(
  null
);

export const useShipping = () => {
  if (!ShippingContext)
    throw new Error('useShipping must be used within a ShippingProvider');
  return useContext(ShippingContext)!;
};

const ShippingProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(() => createStore());

  return (
    <ShippingContext.Provider value={store}>
      {children}
    </ShippingContext.Provider>
  );
};

export default ShippingProvider;
