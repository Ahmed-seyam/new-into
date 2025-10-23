import {ProductOptionsProvider} from '~/contexts/ProductOptions';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import type {ProductWithNodes} from '../../types';
import ProductTooltip from './Tooltip';
import {Link} from 'react-router';

type Props = {
  initialVariantId?: ProductVariant['id'];
  storefrontProduct: ProductWithNodes;
};

export default function ProductTag({
  initialVariantId,
  storefrontProduct,
}: Props) {
  const {handle, title, id} = storefrontProduct;

  return (
    <ProductOptionsProvider
      product={storefrontProduct}
      initialVariantId={initialVariantId}
    >
      <Tippy
        interactive
        placement="top"
        render={() => <ProductTooltip storefrontProduct={storefrontProduct} />}
      >
        <Link to={`/products/${id}`}>
          <div
            className={clsx(
              'inline-flex place-content-center whitespace-nowrap rounded-xs bg-lightGray px-1.5 py-1 text-sm leading-none text-darkGray duration-200 ease-out',
              'hover:bg-gray',
            )}
          >
            {title}
          </div>
        </Link>
      </Tippy>
    </ProductOptionsProvider>
  );
}
