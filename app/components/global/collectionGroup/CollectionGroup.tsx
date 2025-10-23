import {useEffect, useState} from 'react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import {PRODUCT_FIELDS} from '~/fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '~/fragments/shopify/productVariant';
import type {SanityCollectionGroup} from '~/types';
import {client} from '~/lib/storfrontFetch';
import CollectionGroupDialog from './CollectionGroupDialog';

type Props = {
  collectionGroup: SanityCollectionGroup;
};

type ShopifyPayload = {
  collection: Collection;
};

async function fetchCollection(
  collectionGid: string,
): Promise<Collection | null> {
  try {
    const res = await fetch(client.getStorefrontApiUrl(), {
      method: 'POST',
      headers: client.getPublicTokenHeaders(),
      body: JSON.stringify({
        query: QUERY_SHOPIFY,
        variables: {
          id: collectionGid,
          numProducts: 4,
        },
      }),
    });

    const json: any = await res.json();
    const data: ShopifyPayload = json.data;
    return data?.collection || null;
  } catch (err) {
    console.error('Error fetching collection:', err);
    return null;
  }
}

export default function CollectionGroup({collectionGroup}: Props) {
  const collectionGid = collectionGroup?.collectionProducts?.gid;
  const [collection, setCollection] = useState<Collection | null>(null);

  useEffect(() => {
    if (!collectionGid) return;

    void (async () => {
      const data = await fetchCollection(collectionGid);
      setCollection(data);
    })();
  }, [collectionGid]);

  if (!collectionGid || !collection) {
    return null;
  }

  return (
    <CollectionGroupDialog
      collection={collection}
      collectionGroup={collectionGroup}
    />
  );
}

const QUERY_SHOPIFY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query CollectionDetails($id: ID!, $numProducts: Int!) {
    collection(id: $id) {
      image {
        altText
        height
        id
        url
        width
      }
      products(first: $numProducts) {
        nodes {
          ...ProductFields
          variants(first: 1) {
            nodes {
              ...ProductVariantFields
            }
          }
        }
      }
      title
    }
  }
`;
