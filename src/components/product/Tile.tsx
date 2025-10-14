import clsx from 'clsx';
import {Suspense} from 'react';

import {Link} from '@shopify/hydrogen';

import {ProductWithNodes} from '../../types';
import {
  getProductOptionString,
  hasMultipleProductOptions,
} from '../../utils/productOptions';
import MoneyCompareAtPrice from './money/CompareAtPrice.client';
import MoneyPrice from './money/Price.client';

type Props = {
  storefrontProduct: ProductWithNodes;
};

export default function ProductTile({storefrontProduct}: Props) {
  if (!storefrontProduct) {
    return null;
  }

  const firstVariant = storefrontProduct.variants.nodes[0];

  const {availableForSale, compareAtPriceV2, priceV2} = firstVariant;

  const multipleProductOptions = hasMultipleProductOptions(
    storefrontProduct.options,
  );
  const productOptions = getProductOptionString(storefrontProduct.options);

  return (
    <Link to={`/products/${storefrontProduct.id}`}>
      <div
        className={clsx(
          'group min-w-[12.5em] rounded-md bg-white p-5 transition-[border-radius] duration-500 ease-out',
          'hover:rounded-xl',
        )}
        role="row"
      >
        <div className="overflow-hidden">
          {/* Sold out */}
          {!availableForSale && (
            <div className="mb-2 text-xs font-bold uppercase text-darkGray">
              Sold out
            </div>
          )}

          {/* Sale */}
          {availableForSale && compareAtPriceV2 && (
            <div className="mb-2 text-xs font-bold uppercase text-red">
              Sale
            </div>
          )}

          {/* Vendor */}
          {storefrontProduct.vendor && (
            <div className="mb-1 text-xxs font-bold ">
              {storefrontProduct.vendor}
            </div>
          )}

          {/* Title */}
          <div className="truncate text-ellipsis">
            {storefrontProduct.title}
          </div>

          {/* Product options */}
          {/* {multipleProductOptions && (
            <div className="mt-1 truncate text-sm text-darkGray">
              {productOptions}
            </div>
          )} */}
        </div>

        {/* Price / sold out */}
        <div className="">
          {compareAtPriceV2 && (
            <span className="text-darkGray">
              <Suspense fallback={null}>
                <MoneyCompareAtPrice money={compareAtPriceV2} />
              </Suspense>
            </span>
          )}
          {priceV2 && (
            <Suspense fallback={null}>
              <MoneyPrice money={priceV2} />
            </Suspense>
          )}
        </div>
      </div>
    </Link>
  );
}
