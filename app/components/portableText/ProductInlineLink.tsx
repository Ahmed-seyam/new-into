import {Link} from 'react-router';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import {ReactNode, useMemo} from 'react';
import type {ProductWithNodes, SanityColorTheme} from '~/types';
import Tooltip from '~/components/elements/Tooltip';
import CartIcon from '~/components/icons/Cart';
import CreditCardIcon from '~/components/icons/CreditCard';
import ProductTooltip from '~/components/product/Tooltip';
import {useCart} from '~/contexts/CartContext';

type Props = {
  children?: ReactNode;
  colorTheme?: SanityColorTheme;
  initialVariantId?: ProductVariant['id'];
  linkAction: 'addToCart' | 'buyNow' | 'link';
  quantity?: number;
  storefrontProduct: ProductWithNodes;
};

export default function ProductInlineLink({
  children,
  colorTheme,
  linkAction,
  quantity = 1,
  storefrontProduct,
}: Props) {
  const {handle, title} = storefrontProduct;
  const selectedVariant = storefrontProduct.variants.nodes[0];
  const {addToCart, isLoading} = useCart();

  if (!selectedVariant?.id) {
    return <>{children}</>;
  }

  if (!selectedVariant.availableForSale && linkAction !== 'link') {
    return (
      <>
        <span className="text-darkGray line-through">{children}</span>
        <span className="color-white ml-[0.25em] rounded-xs bg-lightGray px-1 py-0.5 text-xs font-bold text-red">
          Sold out
        </span>
      </>
    );
  }

  const LinkContent = (
    <span
      className={clsx(
        'inline-flex place-content-center items-center rounded-xs bg-peach p-0.5 leading-none duration-200 ease-out',
        'hover:opacity-80',
      )}
      style={{background: colorTheme?.background}}
    >
      {children}
      {linkAction === 'addToCart' && <CartIcon className="ml-[0.25em]" />}
      {linkAction === 'buyNow' && <CreditCardIcon className="ml-[0.25em]" />}
    </span>
  );

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return;
    await addToCart({
      merchandiseId: selectedVariant.id,
      quantity,
    });
  };

  const handleBuyNow = async () => {
    if (!selectedVariant?.id) return;
    await addToCart({
      merchandiseId: selectedVariant.id,
      quantity,
    });
    // Redirect to checkout
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      // You'll need to fetch the checkout URL from the cart
      window.location.href = `/checkout`;
    }
  };

  return (
    <Tippy
      interactive={linkAction === 'link'}
      placement="top"
      render={() => {
        if (linkAction === 'addToCart') {
          return <Tooltip label={`Add to cart: ${title}`} tone="dark" />;
        }
        if (linkAction === 'buyNow') {
          return <Tooltip label={`Buy now: ${title}`} tone="dark" />;
        }
        if (linkAction === 'link') {
          return <ProductTooltip storefrontProduct={storefrontProduct} />;
        }
        return null;
      }}
    >
      <span>
        {linkAction === 'addToCart' && (
          <button
            onClick={() => handleAddToCart}
            style={{fontWeight: 'inherit', letterSpacing: 'inherit'}}
            type="button"
            disabled={isLoading}
          >
            {LinkContent}
          </button>
        )}
        {linkAction === 'buyNow' && (
          <button
            onClick={() => handleBuyNow}
            style={{fontWeight: 'inherit', letterSpacing: 'inherit'}}
            type="button"
            disabled={isLoading}
          >
            {LinkContent}
          </button>
        )}
        {linkAction === 'link' && (
          <Link to={`/products/${handle}`} prefetch="intent">
            {LinkContent}
          </Link>
        )}
      </span>
    </Tippy>
  );
}
