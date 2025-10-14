import clsx from 'clsx';

import {gql, useLocalization, useShopQuery} from '@shopify/hydrogen';

import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';
import Slideshow from '../elements/Slideshow.client';
import ProductCard from './Card.server';

import type {ProductWithNodes, SanityColorTheme} from '../../types';
type Props = {
  storefrontProduct: ProductWithNodes;
};

type ShopifyPayload = {
  productRecommendations: ProductWithNodes[];
};

export default function RelatedProducts({storefrontProduct}: Props) {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();
  const {data} = useShopQuery<ShopifyPayload>({
    query: QUERY_SHOPIFY,
    variables: {
      country: countryCode,
      language: languageCode,
      productId: storefrontProduct.id,
    },
  });

  const products = data?.productRecommendations?.slice(0, 8);
  if (products.length > 0) {
    return (
      <div className="-mx-3 grid grid-flow-row gap-6 md:-mx-6">
        <div className="text-center">
          <h3>You may also like</h3>
        </div>
        <Slideshow
          items={products.map((product) => (
            <ProductCard key={product.id} storefrontProduct={product} />
          ))}
        />
      </div>
    );
  } else {
    return null;
  }
}

const QUERY_SHOPIFY = gql`
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query productRecommendations(
    $country: CountryCode
    $language: LanguageCode
    $productId: ID!
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      ...ProductFields
      variants(first: 1) {
        nodes {
          ...ProductVariantFields
        }
      }
    }
  }
`;
