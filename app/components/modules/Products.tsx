import {useEffect, useState} from 'react';

import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import type {ProductWithNodes, SanityModuleProduct} from '~/types';
import {PRODUCT_FIELDS} from '~/fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '~/fragments/shopify/productVariant';
import {Link} from 'react-router';
import Slideshow from '../elements/LandingSlideshow';
import ProductCard from '../product/Card';

type Props = {
  imageAspectClassName?: string;
  module?: SanityModuleProduct;
  storefrontApiUrl: string;
  publicAccessToken: string;
};

type ShopifyPayload = {
  product: Partial<Product>;
  productVariant: Partial<ProductVariant>;
};

// Fetch product + variant using fetch API
async function fetchShopifyProduct(
  productGid: string,
  productVariantGid: string,
  storefrontApiUrl: string,
  publicAccessToken: string,
): Promise<ProductWithNodes | null> {
  try {
    const res = await fetch(storefrontApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': publicAccessToken,
      },
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

function ProductModule({
  module,
  storefrontApiUrl,
  publicAccessToken,
}: {
  module: any;
  storefrontApiUrl: string;
  publicAccessToken: string;
}) {
  const productGid = module?.module?.productWithVariant?.gid;
  const productVariantGid = module?.module?.productWithVariant?.variantGid;
  const [storefrontProduct, setStorefrontProduct] =
    useState<ProductWithNodes | null>(null);

  useEffect(() => {
    if (!productGid || !productVariantGid) return;
    void (async () => {
      const data = await fetchShopifyProduct(
        productGid,
        productVariantGid,
        storefrontApiUrl,
        publicAccessToken,
      );
      setStorefrontProduct(data);
    })();
  }, [productGid, productVariantGid, storefrontApiUrl, publicAccessToken]);

  if (!storefrontProduct) return null;
  return (
    <ProductCard key={module._key} storefrontProduct={storefrontProduct} />
  );
}

function Filter({filter}: any) {
  switch (filter.type) {
    case 'vendor':
      return (
        <Link
          to={`/search?refinementList[vendor][0]=${encodeURIComponent(filter.title)}`}
          className="btn-primary"
          prefetch="intent"
        >
          {filter.title}
        </Link>
      );
    case 'category':
      return (
        <Link
          to={`/search?refinementList[product_type][0]=${encodeURIComponent(filter.title)}`}
          className="btn-tertiary filter-1"
          prefetch="intent"
        >
          {filter.title}
        </Link>
      );
    case 'color':
      return (
        <Link
          to={`/search?refinementList[options.color][0]=${encodeURIComponent(filter.title)}`}
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
          to={`/search?refinementList[meta.product.era][0]=${encodeURIComponent(filter.title)}`}
          className="btn-tertiary"
          prefetch="intent"
        >
          {filter.title}
        </Link>
      );
    case 'condition':
      return (
        <Link
          to={`/search?refinementList[meta.product.condition][0]=${encodeURIComponent(filter.title)}`}
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

function Filters({filters}: {filters: any[]}) {
  return (
    <div className="flex gap-1">
      {filters?.map((filter, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Filter key={`filter-${filter.type}-${index}`} filter={filter} />
      ))}
    </div>
  );
}

export default function ProductsModule({
  imageAspectClassName,
  module,
  storefrontApiUrl,
  publicAccessToken,
}: Props) {
  const {layout, title, filters = []}: any = module || {};

  switch (layout) {
    case 'grid':
      return (
        <div className="container">
          <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
            {title && <h3 className="text-center">{title}</h3>}
            <Filters filters={filters} />
          </div>

          <div className="grid grid-cols-2 gap-3 gap-y-6 md:grid-cols-4 md:gap-6 xl:grid-cols-5">
            {module?.modules?.map((subModule: any) => (
              <ProductModule
                key={subModule._key}
                module={subModule}
                storefrontApiUrl={storefrontApiUrl}
                publicAccessToken={publicAccessToken}
              />
            ))}
          </div>
        </div>
      );

    case 'carousel':
    default:
      return (
        <div>
          {title && <h3 className="mb-6 text-center">{title}</h3>}

          <Slideshow
            items={module?.modules?.map((subModule: any) => (
              <div key={subModule._key}>
                <ProductModule
                  module={subModule}
                  storefrontApiUrl={storefrontApiUrl}
                  publicAccessToken={publicAccessToken}
                />
              </div>
            ))}
          />
        </div>
      );
  }
}

const QUERY_SHOPIFY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query product(
    $country: CountryCode
    $id: ID!
    $language: LanguageCode
    $variantId: ID!
  ) @inContext(country: $country, language: $language) {
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
