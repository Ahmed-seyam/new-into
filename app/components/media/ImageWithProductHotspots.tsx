import {useEffect, useState} from 'react';
import {Product, ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import {PRODUCT_FIELDS} from '~/fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '~/fragments/shopify/productVariant';
import {urlFor} from '~/lib/sanity';
import type {ProductWithNodes, SanityImageWithProductHotspots} from '~/types';
import {client} from '~/lib/storfrontFetch';
import ProductHotspot from '../product/Hotspot';

type Props = {
  content: SanityImageWithProductHotspots;
};

type ShopifyPayload = {
  products: Partial<Product>[];
  productVariants: Partial<ProductVariant>[];
};

async function fetchProducts(
  productGids: string[],
  productVariantGids: string[],
): Promise<ProductWithNodes[]> {
  try {
    const res = await fetch(client.getStorefrontApiUrl(), {
      method: 'POST',
      headers: client.getPublicTokenHeaders(),
      body: JSON.stringify({
        query: QUERY_SHOPIFY,
        variables: {
          ids: productGids,
          variantIds: productVariantGids,
        },
      }),
    });

    const json: any = await res.json();
    const data: ShopifyPayload = json.data;

    if (!data?.products) return [];

    return data.products.map((product, index) => {
      const productVariant = data.productVariants[index];
      return {
        ...product,
        variants: {nodes: [productVariant as ProductVariant]},
      } as ProductWithNodes;
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

export default function ImageWithProductHotspots({content}: Props) {
  const [storefrontProducts, setStorefrontProducts] = useState<
    ProductWithNodes[]
  >([]);

  useEffect(() => {
    if (!content.productHotspots?.length) return;

    const [productGids, productVariantGids] = content.productHotspots.reduce(
      (acc, val) => {
        if (val.product) {
          acc[0].push(val.product.gid);
          acc[1].push(val.product.variantGid);
        }
        return acc;
      },
      [[], []],
    );

    if (productGids.length === 0) return;

    void (async () => {
      const products = await fetchProducts(productGids, productVariantGids);
      setStorefrontProducts(products);
    })();
  }, [content.productHotspots]);

  const imageUrl = content?.image?.asset?._ref
    ? urlFor(content.image.asset._ref)
        .auto('format')
        .fit('max')
        .width(1920)
        .quality(90)
        .url()
    : null;

  return (
    <div className="relative">
      {content.productHotspots?.map((hotspot, index) => (
        <ProductHotspot
          key={hotspot._key}
          storefrontProduct={storefrontProducts[index]}
          x={hotspot.x}
          y={hotspot.y}
        />
      ))}

      {imageUrl && (
        <img
          src={imageUrl}
          alt={content?.image?.altText || ''}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
}

const QUERY_SHOPIFY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query products($ids: [ID!]!, $variantIds: [ID!]!) {
    products: nodes(ids: $ids) {
      ... on Product {
        ...ProductFields
      }
    }
    productVariants: nodes(ids: $variantIds) {
      ... on ProductVariant {
        ...ProductVariantFields
      }
    }
  }
`;
