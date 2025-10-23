import {Link} from 'react-router';
import type {CartLine as CartLineType} from '@shopify/hydrogen/storefront-api-types';
import {useCart} from '~/contexts/CartContext';
import CloseIcon from '~/components/icons/Close';

type Props = {
  line: CartLineType;
};

export default function CartLine({line}: Props) {
  const {updateCartLine, removeCartLine, isLoading} = useCart();
  const merchandise = line.merchandise;

  if (merchandise.__typename !== 'ProductVariant') return null;

  const {product} = merchandise;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeCartLine(line.id);
    } else {
      await updateCartLine(line.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4">
      {/* Image */}
      <Link
        to={`/products/${product.handle}`}
        className="flex-shrink-0"
        prefetch="intent"
      >
        {product.featuredImage && (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            className="h-24 w-24 rounded object-cover"
          />
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div className="flex-1">
            <Link
              to={`/products/${product.handle}`}
              className="font-bold hover:underline"
              prefetch="intent"
            >
              {product.title}
            </Link>
            {merchandise.title !== 'Default Title' && (
              <p className="text-sm text-darkGray">{merchandise.title}</p>
            )}
          </div>
          <button
            onClick={() => removeCartLine(line.id)}
            disabled={isLoading}
            className="ml-2 p-1 hover:opacity-50"
            aria-label="Remove item"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(line.quantity - 1)}
              disabled={isLoading}
              className="flex h-8 w-8 items-center justify-center rounded border border-gray hover:bg-lightGray disabled:opacity-50"
            >
              −
            </button>
            <span className="w-8 text-center">{line.quantity}</span>
            <button
              onClick={() => handleQuantityChange(line.quantity + 1)}
              disabled={isLoading}
              className="flex h-8 w-8 items-center justify-center rounded border border-gray hover:bg-lightGray disabled:opacity-50"
            >
              +
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-bold">
              {line.cost.totalAmount.currencyCode}{' '}
              {parseFloat(line.cost.totalAmount.amount).toFixed(2)}
            </p>
            {line.quantity > 1 && (
              <p className="text-xs text-darkGray">
                {parseFloat(merchandise.priceV2.amount).toFixed(2)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
