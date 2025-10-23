import {Image} from '@shopify/hydrogen-react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen-react/storefront-api-types';
import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';
import ProductTile from './Tile';
import {client} from '~/lib/storfrontFetch';

type Props = {
  gid: string;
  variantGid: string;
};

type ShopifyPayload = {
  product: Partial<Product>;
  productVariant: Partial<ProductVariant>;
};

async function fetchProductAndVariant(gid: string, variantGid: string) {
  try {
    const res = await fetch(client.getStorefrontApiUrl(), {
      method: 'POST',
      headers: client.getPublicTokenHeaders(),
      body: JSON.stringify({
        query: `
          ${PRODUCT_FIELDS}
          ${PRODUCT_VARIANT_FIELDS}

          query product(
            $country: CountryCode
            $language: LanguageCode
            $id: ID!
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
        `,
        variables: {
          country: 'US',
          language: 'EN',
          id: gid,
          variantId: variantGid,
        },
      }),
    });

    const json: any = await res.json();
    const data: ShopifyPayload = json.data;
    if (!data?.product || !data?.productVariant) {
      return null;
    }
    // Attach variant nodes
    return {
      ...data.product,
      variants: {nodes: [data.productVariant as any]},
    };
  } catch (err) {
    console.error('Error fetching product:', err);
    return null;
  }
}

export default async function ProductHero({gid, variantGid}: Props) {
  // Fetch Shopify data
  const storefrontProduct = await fetchProductAndVariant(gid, variantGid);

  if (!storefrontProduct || !storefrontProduct.variants?.nodes?.length) {
    return null;
  }

  const firstVariant = storefrontProduct.variants.nodes[0];

  return (
    <div className="relative">
      {firstVariant.image && (
        <Image
          className="absolute h-full w-full transform bg-cover bg-center object-cover object-center"
          data={firstVariant.image}
        />
      )}

      <div className="absolute bottom-4 right-4">
        <ProductTile storefrontProduct={storefrontProduct} />
      </div>
    </div>
  );
}
