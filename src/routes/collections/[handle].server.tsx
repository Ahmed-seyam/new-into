import clsx from 'clsx';
import groq from 'groq';
import {useMemo} from 'react';
import {renderToString} from 'react-dom/server';
import {getServerState} from 'react-instantsearch-hooks-server';

import {
  gql,
  HydrogenRouteProps,
  Seo,
  ShopifyAnalyticsConstants,
  type,
  useLocalization,
  useQuery,
  useServerAnalytics,
  useShopQuery,
  useUrl,
} from '@shopify/hydrogen';

import Filters from '../../components/collection/Filters.server';
import LoadMoreProducts from '../../components/collection/LoadMoreProducts.client';
import SortOrderSelect from '../../components/collection/SortOrderSelect.client';
import Layout from '../../components/global/Layout.server';
import NotFound from '../../components/global/NotFound.server';
import ModuleGrid from '../../components/modules/ModuleGrid.server';
import {CollectionSearchPage} from '../../components/search/CollectionSearchPage.client';
import {COLLECTION_PAGE_SIZE} from '../../constants';
import {COLLECTION_PAGE} from '../../fragments/sanity/pages/collection';
import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';
import useSanityQuery from '../../hooks/useSanityQuery';
import {combineProductsAndModules} from '../../utils/combineProductsAndModules';

import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import type {SanityCollectionPage} from '../../types';
type Props = {
  collectionProductCount: number;
  params: HydrogenRouteProps;
  productSort?: {
    key?: string;
    reverse?: boolean;
  };
};

type ShopifyPayload = {
  collection: Collection;
};

export default function CollectionRoute({params}) {
  const {handle} = params;
  const {href} = useUrl();
  const {serverState} = useQuery(href, async () => {
    getServerState(<CollectionSearchPage serverUrl={href} />, {renderToString});
  });

  const {
    data: {collection},
  } = useShopQuery({
    query: QUERY,
    variables: {
      handle,
    },
  });

  return (
    <Layout>
      <CollectionSearchPage
        serverState={serverState}
        serverUrl={href}
        collection={handle}
        description={collection?.description}
        title={collection?.seo?.title}
      ></CollectionSearchPage>
    </Layout>
  );
}

// export default function CollectionRoute({
//   collectionProductCount = COLLECTION_PAGE_SIZE,
//   params,
//   productSort,
// }: Props) {
//   const {
//     language: {isoCode: languageCode},
//     country: {isoCode: countryCode},
//   } = useLocalization();

//   const {handle} = params;
//   const {data} = useShopQuery<ShopifyPayload>({
//     query: QUERY_SHOPIFY,
//     variables: {
//       handle,
//       country: countryCode,
//       language: languageCode,
//       numProducts: collectionProductCount,
//       productSortKey: productSort?.key,
//       productSortReverse: productSort?.reverse,
//     },
//     preload: true,
//   });

//   // Shopify analytics
//   useServerAnalytics(
//     data?.collection
//       ? {
//           shopify: {
//             pageType: ShopifyAnalyticsConstants.pageType.collection,
//             resourceId: data.collection.id,
//           },
//         }
//       : null,
//   );

//   const SINGLE_LINE_QUERY = QUERY_SANITY.replace(/\n/g, ' ');

//   const {data: sanityCollection} = useSanityQuery<SanityCollectionPage>({
//     params: {slug: handle},
//     query: SINGLE_LINE_QUERY,
//   });

//   if (data?.collection == null || !sanityCollection) {
//     // @ts-expect-error <NotFound> doesn't require response
//     return <NotFound />;
//   }

//   const sanitySeo = sanityCollection.seo;
//   const collection = data.collection;
//   const products = collection.products.nodes;
//   const hasNextPage = data.collection.products.pageInfo.hasNextPage;

//   const items = useMemo(() => {
//     // Create combined list of both products and modules, with modules inserted at regular intervals
//     return combineProductsAndModules({
//       modules: sanityCollection.modules,
//       products,
//     });
//   }, [products, sanityCollection.modules]);

//   return (
//     <Layout>
//       <Filters />
//       <div className="flex h-20 items-center justify-between">
//         <button>Show Filters</button>

//         {products.length > 0 && (
//           <div className="align-end ml-auto flex items-center">
//             <SortOrderSelect
//               key={sanityCollection._id}
//               initialSortOrder={sanityCollection.sortOrder}
//             />
//           </div>
//         )}
//       </div>
//       {/* No results */}
//       {products.length === 0 && <div>No products.</div>}

//       <ModuleGrid
//         variant="grid"
//         colorTheme={sanityCollection.colorTheme}
//         items={items}
//       />

//       {hasNextPage && (
//         <LoadMoreProducts startingCount={collectionProductCount} />
//       )}

//       <Seo
//         data={{
//           ...(sanitySeo.image
//             ? {
//                 image: {
//                   height: sanitySeo.image.height,
//                   url: sanitySeo.image.url,
//                   width: sanitySeo.image.width,
//                 },
//               }
//             : {}),
//           seo: {
//             description: sanitySeo.description,
//             title: sanitySeo.title,
//           },
//         }}
//         type="collection"
//       />
//     </Layout>
//   );
// }

const QUERY_SANITY = groq`
  *[
    _type == 'collection'
    && store.slug.current == $slug
  ][0]{
    ${COLLECTION_PAGE}
  }
`;

const QUERY = gql`
  query CollectionDetails($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(first: 8) {
        nodes {
          id
          title
          publishedAt
          handle
          variants(first: 1) {
            nodes {
              id
              image {
                url
                altText
                width
                height
              }
              priceV2 {
                amount
                currencyCode
              }
              compareAtPriceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
