import clsx from 'clsx';
import {Suspense} from 'react';

import {Image, Link} from '@shopify/hydrogen';

import {getBlendMode} from '../../utils/getBlendMode';
import {
  getProductOptionString,
  hasMultipleProductOptions,
} from '../../utils/productOptions';
import Badge from '../elements/Badge';
import ProductOptionsWrapper from '../ProductOptionsWrapper.client';
import SelectedVariantAddToCartButton from './buttons/SelectedVariantAddToCart.client';
import MoneyCompareAtPrice from './money/CompareAtPrice.client';
import MoneyPrice from './money/Price.client';

import type {ProductWithNodes} from '../../types';
type Props = {
  imageAspectClassName?: string;
  storefrontProduct: ProductWithNodes;
};

function extractId(gid: string): string | null {
  const regex = /gid:\/\/shopify\/Product\/(\d+)/;
  const match = gid.match(regex);
  return match ? match[1] : null;
}

export default function ProductCard({
  imageAspectClassName = 'aspect-[3/4]',
  storefrontProduct,
  hideText = false,
}: Props) {
  const firstVariant = storefrontProduct.variants.nodes[0];

  if (firstVariant == null) {
    return null;
  }

  const multipleProductOptions = hasMultipleProductOptions(
    storefrontProduct.options,
  );
  const productOptions = getProductOptionString(storefrontProduct.options);

  let shopifyId = null;
  if (storefrontProduct.id) {
    shopifyId = extractId(storefrontProduct.id);
  }

  return (
    <div className="relative flex w-full flex-col gap-y-3">
      <div
        className={`relative ${imageAspectClassName} overflow-hidden rounded-md bg-gray`}
      >
        <Link to={`/products/${shopifyId}`} prefetch={false}>
          {firstVariant.image && (
            <Image
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                objectPosition: 'center',
                objectFit: 'cover',
                mixBlendMode: getBlendMode(storefrontProduct),
              }}
              alt={storefrontProduct.title}
              data={firstVariant.image}
              loaderOptions={{crop: 'center'}}
            />
          )}
        </Link>
        {/* Quick add to cart */}
        {firstVariant.availableForSale && (
          <div className="absolute bottom-0 right-0 m-4">
            {/* 
            Use <ProductOptionsWrapper /> as an escape hatch to wrap our add to cart button
            within a <ProductOptionsProvider /> (required for the button to work correctly).
            */}
            {/* <ProductOptionsWrapper data={storefrontProduct}>
              <SelectedVariantAddToCartButton label="Quick add" />
            </ProductOptionsWrapper> */}
          </div>
        )}
      </div>

      <Link to={`/products/${shopifyId}`}>
        <div className="grid grid-flow-row">
          {/* Vendor */}
          {!hideText && (
            <>
              {storefrontProduct.vendor && (
                <div className="mb-1 text-xxs font-bold ">
                  {storefrontProduct.vendor}
                </div>
              )}
            </>
          )}

          {/* Title */}
          {!hideText ? (
            <>{storefrontProduct.title}</>
          ) : (
            <div className="truncate text-ellipsis text-xxs">
              {storefrontProduct.title}
            </div>
          )}

          {/* Product options */}
          {/* {multipleProductOptions && <div>{productOptions}</div>} */}

          {/* Price / compare at price */}
          <div className={`${hideText && 'text-xxs'} flex gap-2`}>
            {firstVariant.compareAtPriceV2 && (
              <Suspense fallback={null}>
                <MoneyCompareAtPrice money={firstVariant.compareAtPriceV2} />
              </Suspense>
            )}
            <Suspense fallback={null}>
              {firstVariant?.availableForSale ? (
                <MoneyPrice
                  className={`${hideText && 'text-xxs'}`}
                  money={firstVariant.priceV2}
                />
              ) : (
                <s className={`${hideText && 'text-xxs'} `}>
                  <MoneyPrice money={firstVariant.priceV2} />
                </s>
              )}
            </Suspense>
            {/* Sold out */}
            {!firstVariant?.availableForSale && <Badge label="Sold out" />}
          </div>
          {/* Badges */}
          {/* Sale */}
          {firstVariant?.availableForSale && firstVariant?.compareAtPriceV2 && (
            <Badge label="Sale" tone="critical" />
          )}
        </div>
      </Link>
    </div>
  );
}
