import {useCart} from '~/contexts/CartContext';
import {useProductOptions} from '~/contexts/ProductOptions';
import {defaultButtonStyles} from '../../elements/Button';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';

type Props = {
  quantity?: number;
  showSoldOut?: boolean;
};

export default function SelectedVariantBuyNowButton({
  quantity = 1,
  showSoldOut = true,
}: Props) {
  const {selectedVariant} = useProductOptions();
  const availableForSale = selectedVariant?.availableForSale;
  const {addToCart, isLoading} = useCart();

  if ((!showSoldOut && !availableForSale) || !selectedVariant?.id) {
    return null;
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    const line: CartLineInput = {
      merchandiseId: selectedVariant.id,
      quantity,
    };

    await addToCart(line);
  };

  return (
    <button
      className={defaultButtonStyles()}
      disabled={!availableForSale || isLoading}
      onClick={() => handleAddToCart}
    >
      {availableForSale ? 'Buy now' : 'Sold Out'}
    </button>
  );
}
