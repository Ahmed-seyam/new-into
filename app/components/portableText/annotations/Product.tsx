import type {
  PortableTextBlock,
  PortableTextMarkDefinition,
} from '@portabletext/types';
import {useEffect, useState} from 'react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import {PRODUCT_FIELDS} from '~/fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '~/fragments/shopify/productVariant';
import type {
  ProductWithNodes,
  SanityColorTheme,
  SanityProductWithVariant,
} from '~/types';
import {client} from '~/lib/storfrontFetch';
import ProductInlineLink from '../ProductInlineLink';

type Props = PortableTextBlock & {
  colorTheme?: SanityColorTheme;
  mark: PortableTextMarkDefinition & {
    linkAction: 'addToCart' | 'buyNow' | 'link';
    productWithVariant: SanityProductWithVariant;
    quantity?: number;
  };
};

type ShopifyPayload = {
  product: Partial<Product>;
  productVariant: Partial<ProductVariant>;
};

async function fetchProduct(
  productGid: string,
  variantGid: string,
): Promise<ProductWithNodes | null> {
  try {
    const res = await fetch(client.getStorefrontApiUrl(), {
      method: 'POST',
      headers: client.getPublicTokenHeaders(),
      body: JSON.stringify({
        query: QUERY_SHOPIFY,
        variables: {
          id: productGid,
          variantId: variantGid,
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

export default function ProductAnnotation({children, colorTheme, mark}: Props) {
  const {productWithVariant} = mark;
  const [storefrontProduct, setStorefrontProduct] =
    useState<ProductWithNodes | null>(null);

  useEffect(() => {
    if (!productWithVariant?.gid || !productWithVariant?.variantGid) return;

    void (async () => {
      const product = await fetchProduct(
        productWithVariant.gid,
        productWithVariant.variantGid,
      );
      setStorefrontProduct(product);
    })();
  }, [productWithVariant?.gid, productWithVariant?.variantGid]);

  if (!storefrontProduct) {
    return <>{children}</>;
  }

  return (
    <ProductInlineLink
      colorTheme={colorTheme}
      linkAction={mark.linkAction || 'link'}
      quantity={mark.quantity}
      storefrontProduct={storefrontProduct}
    >
      <>{children}</>
    </ProductInlineLink>
  );
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
