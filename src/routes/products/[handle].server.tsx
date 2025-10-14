import clsx from 'clsx';
import groq from 'groq';

import {
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useLocalization,
  useRouteParams,
  useServerAnalytics,
  useShopQuery,
} from '@shopify/hydrogen';

import Layout from '../../components/global/Layout.server';
import NotFound from '../../components/global/NotFound.server';
import PortableText from '../../components/portableText/PortableText.server';
import ProductDetails from '../../components/product/Details.client';
import RelatedProducts from '../../components/product/RelatedProducts.server';
import Recommended from '../../components/search/Recommended.client';
import {PRODUCT_PAGE} from '../../fragments/sanity/pages/product';
import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';
import useSanityQuery from '../../hooks/useSanityQuery';

import type {Product} from '@shopify/hydrogen/storefront-api-types';
import type {ProductWithNodes, SanityProductPage} from '../../types';
type ShopifyPayload = {
  product: Pick<
    Product,
    | 'handle'
    | 'id'
    | 'media'
    | 'options'
    | 'seo'
    | 'title'
    | 'variants'
    | 'vendor'
  >;
};

export default function ProductRoute() {
  const {handle} = useRouteParams();

  // Fetch Sanity document
  // const {data: sanityProduct} = useSanityQuery<SanityProductPage>({
  //   params: {slug: handle},
  //   query: QUERY_SANITY,
  // });

  // Conditionally fetch Shopify document
  let storefrontProduct: ProductWithNodes | null = null;
  if (handle) {
    const {
      language: {isoCode: languageCode},
      country: {isoCode: countryCode},
    } = useLocalization();

    const {
      data: {product},
    } = useShopQuery<ShopifyPayload>({
      query: QUERY_SHOPIFY,
      variables: {
        country: countryCode,
        id: `gid://shopify/Product/${handle}`,
        language: languageCode,
      },
    });
    storefrontProduct = product;
  }

  // // Shopify analytics
  // useServerAnalytics(
  //   storefrontProduct
  //     ? {
  //         shopify: {
  //           canonicalPath: `/products/${handle}`,
  //           pageType: ShopifyAnalyticsConstants.pageType.product,
  //           resourceId: storefrontProduct.id,
  //           products: [
  //             {
  //               product_gid: storefrontProduct.id,
  //               variant_gid: storefrontProduct.variants?.nodes?.[0]?.id,
  //               variant: storefrontProduct.variants?.nodes?.[0]?.title,
  //               name: storefrontProduct.title,
  //               brand: storefrontProduct.vendor,
  //               category: storefrontProduct.productType,
  //               price: storefrontProduct.variants?.nodes?.[0]?.priceV2?.amount,
  //             },
  //           ],
  //         },
  //       }
  //     : null,
  // );

  // if (!sanityProduct) {
  //   return <div>Sanity Product not found</div>;
  // }

  if (!storefrontProduct) {
    return <div>Storefront product not found</div>;
  }

  if (!storefrontProduct) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  // const sanitySeo = sanityProduct.seo;
  const initialVariant = storefrontProduct.variants.nodes[0];
  const objectId = storefrontProduct.variants?.nodes[0]?.id
    ? storefrontProduct.variants.nodes[0].id.split(
        'gid://shopify/ProductVariant/',
      )[1]
    : null;

  return (
    <Layout>
      <article className="grid grid-flow-row gap-24 pb-24">
        <section className="relative grid w-full">
          <ProductDetails
            initialVariantId={initialVariant?.id}
            storefrontProduct={storefrontProduct}
          />
        </section>

        {objectId && (
          <section>
            <Recommended
              storefrontProduct={storefrontProduct}
              currentObjectID={objectId}
            />
          </section>
        )}

        <section>
          <RelatedProducts storefrontProduct={storefrontProduct} />
        </section>
      </article>

      {/* <Seo
        data={{
          ...(sanitySeo.image
            ? {
                featuredImage: {
                  height: sanitySeo.image.height,
                  url: sanitySeo.image.url,
                  width: sanitySeo.image.width,
                },
              }
            : {}),
          seo: {
            description: sanitySeo.description,
            title: sanitySeo.title,
          },
        }}
        type="product"
      /> */}
    </Layout>
  );
}

const QUERY_SANITY = groq`
  *[
    _type == 'product'
    && store.slug.current == $slug
  ][0]{
    ${PRODUCT_PAGE}
  }
`;

const QUERY_SHOPIFY = gql`
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query product($country: CountryCode, $id: ID!, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product: product(id: $id) {
      ...ProductFields
      media(first: 20) {
        nodes {
          ... on MediaImage {
            id
            image {
              altText
              height
              id
              url
              width
            }
            mediaContentType
          }
        }
      }
      variants(first: 250) {
        nodes {
          ...ProductVariantFields
        }
      }
    }
  }
`;
