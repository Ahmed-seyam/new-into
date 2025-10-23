import ProductGallery from './Gallery';
import ProductWidget from './Widget';
import {ProductOptionsProvider} from '~/contexts/ProductOptions';

import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import type {ProductWithNodes} from '../../types';

type Props = {
  initialVariantId?: ProductVariant['id'];
  storefrontProduct: ProductWithNodes;
};

export default function ProductDetails({
  initialVariantId,
  storefrontProduct,
}: Props) {
  return (
    <ProductOptionsProvider
      product={storefrontProduct}
      initialVariantId={initialVariantId}
    >
      <div className="grid grid-flow-row gap-6 md:grid-cols-12">
        {/* Product Gallery */}
        <div className="md:col-span-6 lg:col-span-8">
          <ProductGallery storefrontProduct={storefrontProduct} />
        </div>

        {/* Product Widget */}
        <div className="md:col-span-6 lg:col-span-4">
          <ProductWidget storefrontProduct={storefrontProduct} />
        </div>
      </div>
    </ProductOptionsProvider>
  );
}
