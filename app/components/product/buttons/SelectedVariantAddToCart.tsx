import {useProductOptions} from '~/contexts/ProductOptions';
import {useCart} from '~/contexts/CartContext';

type Props = {
  label?: string;
  quantity?: number;
  showSoldOut?: boolean;
};

export default function SelectedVariantAddToCartButton({
  label = 'Add to cart',
  quantity = 1,
  showSoldOut = true,
}: Props) {
  const {selectedVariant} = useProductOptions();
  const {addToCart, isLoading} = useCart();

  if (!selectedVariant || (!showSoldOut && !selectedVariant.availableForSale)) {
    return null;
  }

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return;
    await addToCart({
      merchandiseId: selectedVariant.id,
      quantity,
    });
  };

  return (
    <button
      className="btn-primary"
      disabled={!selectedVariant.availableForSale || isLoading}
      onClick={() => handleAddToCart}
      type="button"
    >
      {isLoading
        ? 'Adding...'
        : selectedVariant.availableForSale
          ? label
          : 'Sold out'}
    </button>
  );
}
