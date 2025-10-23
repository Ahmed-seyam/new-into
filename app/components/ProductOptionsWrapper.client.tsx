import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import {ReactNode} from 'react';
import type {ProductWithNodes} from '../types';
import {ProductOptionsProvider} from '~/contexts/ProductOptions';

type Props = {
  children: ReactNode;
  data: ProductWithNodes;
  initialVariantId?: ProductVariant['id'];
};

export default function ProductOptionsWrapper({
  children,
  data,
  initialVariantId,
}: Props) {
  return (
    <ProductOptionsProvider product={data} initialVariantId={initialVariantId}>
      {children}
    </ProductOptionsProvider>
  );
}
