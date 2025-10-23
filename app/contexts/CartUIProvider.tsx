// ~/contexts/CartUIProvider.tsx
import {createContext, useContext, ReactNode} from 'react';
import {useCart} from '~/contexts/CartContext';

type CartUIContextType = {
  isCartOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartUIContext = createContext<CartUIContextType | null>(null);

export function useCartUI() {
  const context = useContext(CartUIContext);
  if (!context) {
    throw new Error('useCartUI must be used within CartUIProvider');
  }
  return context;
}

type Props = {
  children: ReactNode;
};

export function CartUIProvider({children}: Props) {
  const {cartOpen, openCart, closeCart} = useCart();

  const toggleCart = () => {
    if (cartOpen) {
      closeCart();
    } else {
      openCart();
    }
  };

  const value = {
    isCartOpen: cartOpen,
    toggleCart,
    openCart,
    closeCart,
  };

  return (
    <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>
  );
}
