import algoConfig from '../../../algolia.config.json';
import {RelatedProducts} from '@algolia/recommend-react';
import {recommendClient} from '@algolia/recommend';
import {Highlight} from 'react-instantsearch';
import '~/styles/search.css';
import Filters from '~/components/modules/Filters';
import '~/styles/theme.css';
import {getBlendMode} from '~/utils/getBlendMode';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

const indexName = algoConfig.prefix + 'products';
const appId = algoConfig.appId;
const apiKey = algoConfig.appKey;
const client = recommendClient(appId, apiKey);

type RelatedItemProps = {
  item: any;
};

const RelatedItem = ({item}: RelatedItemProps) => (
  <article>
    <a href={'/products/' + item.id}>
      <header className="relative overflow-hidden rounded-md bg-gray">
        {item.image ? (
          <img
            src={`${item.image}?w=600&h=900`}
            srcSet={`${item.image}?w=375&h=562.5 375w, ${item.image}?w=600&h=900 600w, ${item.image}?w=800&h=1200 800w`}
            alt={item.title}
            width="600"
            height="900"
            className="hit-image aspect-[3/4]"
            style={{mixBlendMode: getBlendMode(item)}}
            loading="lazy"
          />
        ) : (
          <div className="hit-image aspect-[3/4] bg-gray" />
        )}
      </header>
      <div>
        <p className="mb-1 mt-4 text-xxs font-bold">{item.vendor}</p>
        <Highlight attribute="title" hit={item} />
        <footer>
          {item.inventory_available ? (
            <p>${item.price}</p>
          ) : (
            <p>
              <s>${item.price}</s> Sold out
            </p>
          )}
        </footer>
      </div>
    </a>
  </article>
);

type Props = {
  storefrontProduct: Product;
  currentObjectID: string;
};

export default function Recommended({
  storefrontProduct,
  currentObjectID,
}: Props) {
  const filters = [];

  const era = (storefrontProduct as any).era?.value;

  if (storefrontProduct.vendor)
    filters.push({type: 'vendor', title: storefrontProduct.vendor});
  if (storefrontProduct.productType)
    filters.push({type: 'category', title: storefrontProduct.productType});

  if (
    storefrontProduct.options[0]?.values[0] &&
    storefrontProduct.options[0].name !== 'Title'
  )
    filters.push({
      type: 'color',
      title: storefrontProduct.options[0].values[0],
    });

  if (era) filters.push({type: 'era', title: era});

  return (
    <div>
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h3 className="text-center">Shop more in</h3>
        {filters.length > 0 && <Filters filters={filters} />}
      </div>
      <RelatedProducts
        recommendClient={client}
        indexName={indexName}
        objectIDs={[currentObjectID]}
        maxRecommendations={10}
        itemComponent={RelatedItem}
      />
    </div>
  );
}
