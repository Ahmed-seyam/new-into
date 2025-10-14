import {ProductOptionsProvider} from '@shopify/hydrogen';

import ProductGallery from './Gallery.client';
import ProductWidget from './Widget.client';

import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import type {ProductWithNodes, SanityProductPage} from '../../types';
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
      data={storefrontProduct}
      initialVariantId={initialVariantId}
    >
      <div className="grid grid-flow-row gap-6 md:grid-cols-12">
        {/* Gallery */}
        <div className="md:col-span-6 lg:col-span-8">
          <ProductGallery storefrontProduct={storefrontProduct} />
        </div>
        {/* Widget (desktop) */}
        <div className="md:col-span-6 lg:col-span-4">
          <ProductWidget storefrontProduct={storefrontProduct} />
        </div>
      </div>
    </ProductOptionsProvider>
  );
}
