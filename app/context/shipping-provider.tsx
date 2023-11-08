'use client';
import { useState, createContext, useContext } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pricing } from '../lib/definitions';

type State = {
  addressId: number | null;
  courierService: string | null;
  shippingCost: number;
  bank: string | null;
};

type Action = {
  reset: () => void;
  setAddressId: (addressId: number) => void;
  setCourier: (courierService: Pricing | null) => void;
  setShippingCost: (shippingCost: number) => void;
  setBank: (bank: string) => void;
  resetCourier: () => void;
};

const initialState: State = {
  addressId: null,
  courierService: null,
  bank: null,
  shippingCost: 0,
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
            bank: null,
          }),
        setAddressId: (addressId) => {
          set(() => ({
            addressId,
          }));
          get().resetCourier();
        },
        setCourier: (pricing) => {
          const courierService = `${pricing?.courier_code}_${pricing?.courier_service_code}`;
          set(() => ({
            courierService,
            shippingCost: pricing?.price,
          }));
        },
        setBank: (bank) =>
          set(() => ({
            bank,
          })),
        resetCourier: () =>
          set(() => ({
            courierService: undefined,
            shippingCost: 0,
          })),
        setShippingCost: (shippingCost) => set(() => ({ shippingCost })),
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
