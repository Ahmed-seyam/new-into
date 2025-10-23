import {Suspense, useEffect, useState} from 'react';
import {PRODUCT_FIELDS} from '~/fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '~/fragments/shopify/productVariant';

import type {ProductWithNodes, SanityProductWithVariant} from '~/types';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import {Link} from 'react-router';
import {string} from 'yup';
import {client} from '~/lib/storfrontFetch';
import MuxVideoPlayer from '../global/MuxVideoPlayer';
import ProductHotspot from '../product/Hotspot';

type ShopifyPayload = {
  products: Partial<Product>[];
  productVariants: Partial<ProductVariant>[];
};

function Filter({filter}: any) {
  switch (filter.type) {
    case 'vendor':
      return (
        <Link
          to={`/search?shopify_products[refinementList][vendor][0]=${encodeURIComponent(filter.title)}`}
          className="btn-primary"
          prefetch="intent"
        >
          {filter.title}
        </Link>
      );
    case 'category':
      return (
        <Link
          to={`/search?shopify_products[refinementList][product_type][0]=${encodeURIComponent(filter.title)}`}
          className="btn-tertiary filter-1"
          prefetch="intent"
        >
          {filter.title}
        </Link>
      );
    case 'color':
      return (
        <Link
          to={`/search?shopify_products[refinementList][options.color][0]=${encodeURIComponent(filter.title)}`}
          className="btn-tertiary"
          data-color={filter.title}
          prefetch="intent"
        >
          {filter.title}
        </Link>
      );
    case 'material':
      return (
        <Link
          to={`/search?shopify_products[refinementList][options.material][0]=${encodeURIComponent(filter.title)}`}
          className="btn-tertiary"
          data-color={filter.title}
          prefetch="intent"
        >
          {filter.title}
        </Link>
      );
    case 'era':
      return (
        <Link
          to={`/search?shopify_products[refinementList][meta.product.era][0]=${encodeURIComponent(filter.title)}`}
          className="btn-tertiary"
          prefetch="intent"
        >
          {filter.title}
        </Link>
      );
    case 'condition':
      return (
        <Link
          to={`/search?shopify_products[refinementList][meta.product.condition][0]=${encodeURIComponent(filter.title)}`}
          className="btn-tertiary"
          prefetch="intent"
        >
          {filter.title}
        </Link>
      );
    default:
      return null;
  }
}

function Filters({filters}: any) {
  if (filters?.length > 0) {
    return (
      <div
        style={{maxWidth: 'calc(100vw - 2rem)'}}
        className="flex gap-1 overflow-x-auto"
      >
        {filters.map((filter: any, index: number) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Filter key={`filter-${filter.type}-${index}`} filter={filter} />
          );
        })}
      </div>
    );
  } else {
    return null;
  }
}

// Fetch products using client
async function fetchShopifyProducts(
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

export default function VideoModule({module}: any) {
  const [storefrontProducts, setStorefrontProducts] = useState<
    ProductWithNodes[]
  >([]);

  useEffect(() => {
    const products: SanityProductWithVariant[] | undefined =
      module.productHotspots?.map((hotspot: any) => hotspot.product);

    if (products && products.length > 0) {
      const [productGids, productVariantGids] = products.reduce<
        [string[], string[]]
      >(
        (acc, val) => {
          if (val) {
            acc[0].push(val.gid);
            acc[1].push(val.variantGid);
          }
          return acc;
        },
        [[], []],
      );

      void (async () => {
        const data = await fetchShopifyProducts(
          productGids,
          productVariantGids,
        );
        setStorefrontProducts(data);
      })();
    }
  }, [module.productHotspots]);

  return (
    <Suspense fallback={<VideoFallback />}>
      <div className="video-module mx-auto px-3 md:px-6 lg:w-3/4">
        <div className="relative mx-auto mb-2 aspect-square overflow-hidden rounded-md sm:aspect-[16/9]">
          {module.productHotspots?.map((hotspot: any, index: number) => (
            <ProductHotspot
              key={hotspot._key}
              storefrontProduct={storefrontProducts[index]}
              x={hotspot.x}
              y={hotspot.y}
            />
          ))}
          <MuxVideoPlayer playbackId={module.video.asset.playbackId} />
        </div>

        <Filters filters={module.filters} />
      </div>
    </Suspense>
  );
}

function VideoFallback() {
  return null;
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
