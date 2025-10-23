import {useCart} from '~/contexts/CartContext';
import CartIcon from '~/components/icons/Cart';

type Props = {
  onClick?: () => void;
};

/**
 * A client component that defines the behavior when a user toggles a cart
 */
export default function CartToggle({onClick}: Props) {
  const {cart, cartOpen, openCart, closeCart} = useCart();

  const handleToggle = () => {
    if (cartOpen) {
      closeCart();
    } else {
      openCart();
    }
    onClick?.();
  };

  return (
    <button
      aria-expanded={cartOpen}
      aria-controls="cart"
      onClick={handleToggle}
      className="relative"
    >
      <span className="hidden hover:text-theme md:inline">
        Cart ({cart?.totalQuantity || 0})
      </span>
      <span className="relative flex h-6 w-6 flex-grow-0 md:hidden">
        <span
          style={{lineHeight: '27px'}}
          className="absolute left-0 top-0 h-full w-full text-center"
        >
          {cart?.totalQuantity || 0}
        </span>
        <CartIcon />
      </span>
    </button>
  );
}
