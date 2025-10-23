import {useEffect, useState} from 'react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import {PRODUCT_FIELDS} from '~/fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '~/fragments/shopify/productVariant';
import type {ProductWithNodes, SanityModuleProduct} from '~/types';
import ProductPill from '~/components/product/Pill';
import {client} from '~/lib/storfrontFetch';
import ProductCard from '../product/Card';

type Props = {
  imageAspectClassName?: string;
  layout?: 'card' | 'pill';
  module?: SanityModuleProduct;
};

type ShopifyPayload = {
  product: Partial<Product>;
  productVariant: Partial<ProductVariant>;
};

// Fetch product + variant using client
async function fetchShopifyProduct(
  productGid: string,
  productVariantGid: string,
): Promise<ProductWithNodes | null> {
  try {
    const res = await fetch(client.getStorefrontApiUrl(), {
      method: 'POST',
      headers: client.getPublicTokenHeaders(),
      body: JSON.stringify({
        query: QUERY_SHOPIFY,
        variables: {
          id: productGid,
          variantId: productVariantGid,
        },
      }),
    });

    const json: any = await res.json();
    const data: ShopifyPayload = json.data;
    if (!data?.product) return null;

    return {
      ...data.product,
      variants: {nodes: [data.productVariant as ProductVariant]},
    } as ProductWithNodes;
  } catch (err) {
    console.error('Error fetching product:', err);
    return null;
  }
}

export default function ProductModule({
  imageAspectClassName,
  layout = 'card',
  module,
}: Props) {
  const productGid = module?.productWithVariant?.gid;
  const productVariantGid = module?.productWithVariant?.variantGid;
  const [storefrontProduct, setStorefrontProduct] =
    useState<ProductWithNodes | null>(null);

  useEffect(() => {
    if (!productGid || !productVariantGid) return;
    void (async () => {
      const data = await fetchShopifyProduct(productGid, productVariantGid);
      setStorefrontProduct(data);
    })();
  }, [productGid, productVariantGid]);

  if (!storefrontProduct) {
    return null;
  }

  if (layout === 'pill') {
    return <ProductPill storefrontProduct={storefrontProduct} />;
  }

  if (layout === 'card') {
    return (
      <ProductCard
        imageAspectClassName={imageAspectClassName}
        storefrontProduct={storefrontProduct}
      />
    );
  }

  return null;
}

const QUERY_SHOPIFY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query product($id: ID!, $variantId: ID!) {
    product: product(id: $id) {
      ...ProductFields
    }
    productVariant: node(id: $variantId) {
      ... on ProductVariant {
        ...ProductVariantFields
      }
    }
  }
`;
