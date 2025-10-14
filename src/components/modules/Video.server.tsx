import {Suspense} from 'react';

import {gql, useLocalization, useShopQuery, Link} from '@shopify/hydrogen';
import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';
import MuxVideoPlayer from '../global/MuxVideoPlayer.client';
import ProductHotspot from '../product/Hotspot.client';
// import Filters from './Filters.client';

import type {ProductWithNodes, SanityProductWithVariant} from '../../types';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

type ShopifyPayload = {
  products: Partial<Product>[];
  productVariants: Partial<ProductVariant>[];
};

function Filter({filter}: any) {
  switch (filter.type) {
    case 'vendor':
      return (
        <Link
          to={`/collections/all?shopify_products[refinementList][vendor][0]=${filter.title}`}
          className="btn-primary"
        >
          {filter.title}
        </Link>
      );
    case 'category':
      return (
        <Link
          to={`/collections/all?shopify_products[refinementList][product_type][0]=${filter.title}`}
          className="btn-tertiary filter-1"
        >
          {filter.title}
        </Link>
      );
    case 'color':
      return (
        <Link
          to={`/collections/all?shopify_products[refinementList][options.color][0]=${filter.title}`}
          className="btn-tertiary"
          data-color={filter.title}
        >
          {filter.title}
        </Link>
      );
    case 'material':
      return (
        <Link
          to={`/collections/all?shopify_products[refinementList][options.material][0]=${filter.title}`}
          className="btn-tertiary"
          data-color={filter.title}
        >
          {filter.title}
        </Link>
      );
    case 'era':
      return (
        <Link
          to={`/collections/all?shopify_products[refinementList][meta.product.era][0]=${filter.title}`}
          className="btn-tertiary"
        >
          {filter.title}
        </Link>
      );
    case 'condition':
      return (
        <Link
          to={`/collections/all?shopify_products[refinementList][meta.product.condition][0]=${filter.title}`}
          className="btn-tertiary"
        >
          {filter.title}
        </Link>
      );
  }
}

function Filters({filters}: any) {
  if (filters.length > 0) {
    return (
      <div
        style={{maxWidth: 'calc(100vw - 2rem)'}}
        className="flex gap-1 overflow-x-auto"
      >
        {filters.map((filter: any, index) => {
          return (
            <Filter key={`filter-${filter.type}-${index}`} filter={filter} />
          );
        })}
      </div>
    );
  } else {
    return <></>;
  }
}

export default function VideoModule({module}: any) {
  // console.log(module);
  // Conditionally fetch Shopify products if this is an image module that references products
  let storefrontProducts: ProductWithNodes[];
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const products: SanityProductWithVariant[] | undefined =
    module.productHotspots?.map((hotspot: any) => hotspot.product);
  if (products) {
    const [productGids, productVariantGids] = products.reduce<
      [string[], string[]]
    >(
      (acc, val) => {
        // console.log('val', val);
        if (val) {
          acc[0].push(val.gid);
          acc[1].push(val.variantGid);
        }
        return acc;
      },
      [[], []],
    );

    const {data} = useShopQuery<ShopifyPayload>({
      query: QUERY_SHOPIFY,
      variables: {
        country: countryCode,
        ids: productGids,
        language: languageCode,
        variantIds: productVariantGids,
      },
    });
    storefrontProducts = data.products?.map((product, index) => {
      const productVariant = data.productVariants[index];
      return {
        ...product,
        variants: {nodes: [productVariant as ProductVariant]},
      };
    });
  }
  return (
    <Suspense fallback={<VideoFallback />}>
      <div className="video-module mx-auto px-3 md:px-6 lg:w-3/4">
        <div className="relative mx-auto mb-2 aspect-square overflow-hidden rounded-md sm:aspect-[16/9]">
          {module.productHotspots?.map((hotspot, index) => (
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
  return <></>;
}

const QUERY_SHOPIFY = gql`
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query products(
    $country: CountryCode
    $language: LanguageCode
    $ids: [ID!]!
    $variantIds: [ID!]!
  ) @inContext(country: $country, language: $language) {
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
