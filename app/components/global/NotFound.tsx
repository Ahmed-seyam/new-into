import {Link, LoaderFunctionArgs, useLoaderData} from 'react-router';
import groq from 'groq';
import type {
  ProductWithNodes,
  SanityNotFoundPage,
  SanityMenuLink,
} from '../../types';

import { NOT_FOUND_PAGE } from '../../fragments/sanity/pages/notFound';
import { PRODUCT_FIELDS } from '../../fragments/shopify/product';
import { PRODUCT_VARIANT_FIELDS } from '../../fragments/shopify/productVariant';
import { LINKS } from '../../fragments/sanity/links';
import { sanityFetch } from '~/lib/sanity';
import Layout from './Layout';

export async function loader({context}: LoaderFunctionArgs) {
  const sanityData = await sanityFetch<SanityNotFoundPage>(QUERY_SANITY);
  const menuLinks = await sanityFetch<SanityMenuLink[]>(QUERY_MENU);

  let products: ProductWithNodes[] = [];
  
  if (sanityData?.collectionGid) {
    const {storefront} = context;
    const {collection} = await storefront.query(QUERY_SHOPIFY, {
      variables: {
        country: storefront.i18n.country,
        id: sanityData.collectionGid,
        language: storefront.i18n.language,
      },
    });
    
    products = collection?.products?.nodes || [];
  }

  return Response.json({sanityData, products, menuLinks}, {status: 404});
}

export default function NotFound() {
  const {sanityData, menuLinks}: any = useLoaderData<typeof loader>();

  return (
    <Layout backgroundColor={sanityData?.colorTheme?.background} menuLinks={menuLinks}>
      <div className="absolute top-0 left-0 flex h-screen w-full items-center justify-center">
        <p className="text-center">
          {sanityData?.title || 'Nothing here.'}&nbsp;
          <Link to="/" className="underline">
            Back to shop?
          </Link>
        </p>
      </div>
    </Layout>
  );
}

const QUERY_SANITY = groq`
  *[_type == 'settings'][0] {
    ...notFoundPage {
      ${NOT_FOUND_PAGE}
    }
  }
`;

const QUERY_MENU = groq`
  *[_type == 'settings'][0].menu.links[] {
    ${LINKS}
  }
`;

const QUERY_SHOPIFY = `#graphql
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query NotFoundCollectionProductDetails(
    $country: CountryCode
    $id: ID!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: $id) {
      products(first: 16) {
        nodes {
          ...ProductFields
          variants(first: 1) {
            nodes {
              ...ProductVariantFields
            }
          }
        }
      }
    }
  }
` as const;