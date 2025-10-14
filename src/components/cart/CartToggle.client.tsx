import {useCart} from '@shopify/hydrogen';

import CartIcon from '../icons/Cart';
import {useCartUI} from './CartUIProvider.client';

type Props = {
  onClick?: () => void;
};

/**
 * A client component that defines the behavior when a user toggles a cart
 */
export default function CartToggle({onClick}: Props) {
  const {totalQuantity} = useCart();
  const {isCartOpen, toggleCart} = useCartUI();

  return (
    <button
      aria-expanded={isCartOpen}
      aria-controls="cart"
      onClick={() => {
        toggleCart();
        onClick?.();
      }}
    >
      <span className="hidden hover:text-theme md:inline">
        Cart ({totalQuantity})
      </span>
      <span className="relative flex h-6 w-6 flex-grow-0 md:hidden">
        <span
          style={{lineHeight: '27px'}}
          className="blockh-full absolute left-0 top-0 w-full text-center"
        >
          {totalQuantity}
        </span>
        <CartIcon />
      </span>
    </button>
  );
}
