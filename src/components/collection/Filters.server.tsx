import clsx from 'clsx';
import { Suspense } from 'react';

import {
    gql, HydrogenRouteProps, Seo, ShopifyAnalyticsConstants, type, useLocalization,
    useServerAnalytics, useShopQuery
} from '@shopify/hydrogen';

type Props = {};

export default function Filters({}: Props) {
  const {data} = useShopQuery<ShopifyPayload>({
    query: QUERY_SHOPIFY,
    preload: true,
  });

  if (!data) {
  }

  const productTypes = data.productTypes;

  return (
    <>
      <div className="relative flex w-full flex-col gap-y-3">Filters</div>
      <div className="relative">
        <div className="grid grid-flow-col gap-4">
          <div>
            <span className="mb-1 text-xxs font-bold">Categories</span>
            {productTypes.edges.map((productType) => (
              <div key={productType.node}>{productType.node}</div>
            ))}
          </div>
          <div>
            <h3>Colors</h3>
            <ul>
              <li>Black</li>
              <li>Blue</li>
              <li>Brown</li>
            </ul>
          </div>
          <div>
            <h3>Designers</h3>
          </div>
          <div>
            <h3>Material</h3>
            <ul>
              <li>Cotton</li>
              <li>Leather</li>
              <li>Nylon</li>
            </ul>
          </div>
          <div>
            <h3>Era</h3>
            <ul>
              <li>2020</li>
              <li>2019</li>
              <li>2018</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

const QUERY_SHOPIFY = gql`
  query CollectionFilters {
    productTypes(first: 250) {
      edges {
        node
      }
    }
  }
`;
