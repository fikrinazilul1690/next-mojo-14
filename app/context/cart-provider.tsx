'use client';
import React, { createContext, useOptimistic } from 'react';

const useUserState = (initalTotalCart?: number) =>
  useOptimistic<number | undefined, number>(
    initalTotalCart,
    (state, action) => {
      if (state !== undefined) {
        return state + action;
      }
    }
  );

export const CartContext = createContext<ReturnType<
  typeof useUserState
> | null>(null);

export const useTotalCart = () => {
  const user = React.useContext(CartContext);
  if (!user) {
    throw new Error('useTotalCart must be used within a CartContext');
  }
  return user;
};

const CartProvider = ({
  totalCart: initialTotalCart,
  children,
}: {
  totalCart?: number;
  children: React.ReactNode;
}) => {
  const [totalCart, updateTotalCart] = useUserState(initialTotalCart);

  return (
    <CartContext.Provider value={[totalCart, updateTotalCart]}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
