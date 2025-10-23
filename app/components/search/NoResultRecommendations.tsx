import {useEffect, useState} from 'react';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {FeaturedCollections} from '~/components';
import {ProductSwimlane} from '~/components';
import {PAGINATION_SIZE} from '~/lib/const';
import type {Collection, Product} from '@shopify/hydrogen/storefront-api-types';
import {client} from '~/lib/storfrontFetch';

type NoResultData = {
  featuredCollections: {
    nodes: Collection[];
  };
  featuredProducts: {
    nodes: Product[];
  };
};

async function fetchNoResultRecommendations(): Promise<NoResultData | null> {
  try {
    const res = await fetch(client.getStorefrontApiUrl(), {
      method: 'POST',
      headers: client.getPublicTokenHeaders(),
      body: JSON.stringify({
        query: SEARCH_NO_RESULTS_QUERY,
        variables: {
          pageBy: PAGINATION_SIZE,
        },
      }),
    });

    const json: any = await res.json();
    return json.data || null;
  } catch (err) {
    console.error('Error fetching no result recommendations:', err);
    return null;
  }
}

export function NoResultRecommendations() {
  const [data, setData] = useState<NoResultData | null>(null);

  useEffect(() => {
    void (async () => {
      const recommendations = await fetchNoResultRecommendations();
      setData(recommendations);
    })();
  }, []);

  if (!data) {
    return null;
  }

  return (
    <>
      <FeaturedCollections
        title="Trending Collections"
        data={data.featuredCollections.nodes}
      />
      <ProductSwimlane
        title="Trending Products"
        data={data.featuredProducts.nodes}
      />
    </>
  );
}

const SEARCH_NO_RESULTS_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD_FRAGMENT}
  query searchNoResult($pageBy: Int!) {
    featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
    featuredProducts: products(first: $pageBy) {
      nodes {
        ...ProductCard
      }
    }
  }
`;
