import {createContext, useContext, useState, ReactNode, useMemo} from 'react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import {ProductWithNodes} from '~/types';

type ProductOptionsContextType = {
  selectedOptions: Record<string, string>;
  setSelectedOption: (name: string, value: string) => void;
  selectedVariant: ProductVariant | undefined;
  product: ProductWithNodes;
};

const ProductOptionsContext = createContext<ProductOptionsContextType | null>(
  null,
);

export function useProductOptions() {
  const context = useContext(ProductOptionsContext);
  if (!context) {
    throw new Error(
      'useProductOptions must be used within ProductOptionsProvider',
    );
  }
  return context;
}

type Props = {
  children: ReactNode;
  product: ProductWithNodes;
  initialVariantId?: string;
};

export function ProductOptionsProvider({
  children,
  product,
  initialVariantId,
}: Props) {
  // Initialize selected options from first variant or specified variant
  const initialVariant = initialVariantId
    ? product.variants.nodes.find((v) => v.id === initialVariantId)
    : product.variants.nodes[0];

  const initialOptions =
    initialVariant?.selectedOptions?.reduce(
      (acc, option) => ({
        ...acc,
        [option.name]: option.value,
      }),
      {} as Record<string, string>,
    ) || {};

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>(initialOptions);

  const setSelectedOption = (name: string, value: string) => {
    setSelectedOptions((prev) => ({...prev, [name]: value}));
  };

  // Find the variant that matches selected options
  const selectedVariant = useMemo(() => {
    return product.variants.nodes.find((variant) => {
      return variant.selectedOptions.every(
        (option) => selectedOptions[option.name] === option.value,
      );
    });
  }, [product.variants.nodes, selectedOptions]);

  const value = {
    selectedOptions,
    setSelectedOption,
    selectedVariant,
    product,
  };

  return (
    <ProductOptionsContext.Provider value={value}>
      {children}
    </ProductOptionsContext.Provider>
  );
}
