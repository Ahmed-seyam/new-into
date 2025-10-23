import type {ProductWithNodes} from '../../types';
import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';
import Slideshow from '../elements/Slideshow';
import ProductCard from './Card';
import {client} from '~/lib/storfrontFetch';

type Props = {
  storefrontProduct: ProductWithNodes;
};

type ShopifyPayload = {
  productRecommendations: ProductWithNodes[];
};

async function fetchProductRecommendations(
  productId: string,
): Promise<ProductWithNodes[] | null> {
  try {
    const res = await fetch(client.getStorefrontApiUrl(), {
      method: 'POST',
      headers: client.getPublicTokenHeaders(),
      body: JSON.stringify({
        query: `
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
        `,
        variables: {
          country: 'US',
          language: 'EN',
          productId,
        },
      }),
    });

    const json: any = await res.json();
    const data: ShopifyPayload = json.data;
    return data?.productRecommendations?.slice(0, 8) || null;
  } catch (err) {
    console.error('Error fetching product recommendations:', err);
    return null;
  }
}

export default async function RelatedProducts({storefrontProduct}: Props) {
  // Fetch product recommendations
  const products = await fetchProductRecommendations(storefrontProduct.id);

  if (!products || products.length === 0) {
    return null;
  }

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
}
