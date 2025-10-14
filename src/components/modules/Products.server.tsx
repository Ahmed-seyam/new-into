import {gql, Link, useLocalization, useShopQuery} from '@shopify/hydrogen';

import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';
import Slideshow from '../elements/Slideshow.client';
import ProductCard from '../product/Card.server';

import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import type {ProductWithNodes, SanityModuleProduct} from '../../types';

type Props = {
  imageAspectClassName?: string;
  module?: SanityModuleProduct;
};

type ShopifyPayload = {
  product: Partial<Product>;
  productVariant: Partial<ProductVariant>;
};

const ProductModule = (module) => {
  const productGid = module.module?.productWithVariant?.gid;
  const productVariantGid = module.module?.productWithVariant?.variantGid;

  // Conditionally fetch Shopify document
  let storefrontProduct: ProductWithNodes | null = null;
  if (productGid && productVariantGid) {
    const {
      language: {isoCode: languageCode},
      country: {isoCode: countryCode},
    } = useLocalization();
    const {data} = useShopQuery<ShopifyPayload>({
      query: QUERY_SHOPIFY,
      variables: {
        country: countryCode,
        id: productGid,
        language: languageCode,
        variantId: productVariantGid,
      },
    });

    // Attach variant nodes
    storefrontProduct = {
      ...data.product,
      variants: {nodes: [data.productVariant as ProductVariant]},
    };
  }

  if (!storefrontProduct) {
    return null;
  }

  return (
    <ProductCard key={module._key} storefrontProduct={storefrontProduct} />
  );
};

function Filter({filter}: any) {
  switch (filter.type) {
    case 'vendor':
      return (
        <Link
          to={`/collections/all?refinementList[vendor][0]=${filter.title}`}
          className="btn-primary"
        >
          {filter.title}
        </Link>
      );
    case 'category':
      return (
        <Link
          to={`/collections/all?refinementList[product_type][0]=${filter.title}`}
          className="btn-tertiary filter-1"
        >
          {filter.title}
        </Link>
      );
    case 'color':
      return (
        <Link
          to={`/collections/all?refinementList[options.color][0]=${filter.title}`}
          className="btn-tertiary"
          data-color={filter.title}
        >
          {filter.title}
        </Link>
      );
    case 'era':
      return (
        <Link
          to={`/collections/all?refinementList[meta.product.era][0]=${filter.title}`}
          className="btn-tertiary"
        >
          {filter.title}
        </Link>
      );
    case 'condition':
      return (
        <Link
          to={`/collections/all?refinementList[meta.product.condition][0]=${filter.title}`}
          className="btn-tertiary"
        >
          {filter.title}
        </Link>
      );
  }
}

function Filters({filters}) {
  // TODO: We currently render `react-social-media-embed` components after initial mount to
  // prevent hydration errors for now.

  return (
    <div className="flex gap-1">
      {filters?.map((filter: any, index) => {
        return (
          <Filter key={`filter-${filter.type}-${index}`} filter={filter} />
        );
      })}
    </div>
  );
}

export default function ProductsModule({imageAspectClassName, module}: Props) {
  const {layout, title, filters = []} = module;

  switch (layout) {
    case 'grid':
      return (
        <div className="container">
          <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row ">
            {title && <h3 className="text-center">{title}</h3>}
            <Filters filters={filters} />
          </div>

          <div className="grid grid-cols-2 gap-3 gap-y-6 md:grid-cols-4  md:gap-6 xl:grid-cols-5">
            {module.modules?.map((module) => (
              <ProductModule module={module} />
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
            items={module.modules?.map((module) => (
              <div key={module._key}>
                <ProductModule module={module} />
              </div>
            ))}
          />
        </div>
      );
  }

  return null;
}

const QUERY_SHOPIFY = gql`
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
