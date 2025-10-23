import React from 'react';
import { Box, Text } from '@sanity/ui';
import { useSchema } from 'sanity';
import { PreviewCard } from 'sanity';

interface Spot {
  productWithVariant?: {
    product?: {
      _ref?: string;
    };
  };
}

interface ProductTooltipProps {
  spot: Spot;
}

const ProductTooltip = ({ spot }: ProductTooltipProps) => {
  const schema = useSchema();
  const productRef = spot?.productWithVariant?.product?._ref;
  const productType = schema.get('product');

  if (!productRef) {
    return (
      <Box padding={2}>
        <Text muted size={1}>
          No product selected
        </Text>
      </Box>
    );
  }

  return (
    <Box padding={2}>
      <PreviewCard
        schemaType={productType}
        documentId={productRef}
      />
    </Box>
  );
};

export default ProductTooltip;