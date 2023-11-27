'use client';
import React, { createContext, useOptimistic } from 'react';

const useCartTotalState = (initalTotalCart?: number) =>
  useOptimistic<number | undefined>(initalTotalCart);

export const CartContext = createContext<ReturnType<
  typeof useCartTotalState
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
  const [totalCart, updateTotalCart] = useCartTotalState(initialTotalCart);

  return (
    <CartContext.Provider value={[totalCart, updateTotalCart]}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
