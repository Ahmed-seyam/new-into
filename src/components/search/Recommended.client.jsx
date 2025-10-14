import algoConfig from '../../../algolia.config.json';
import {RelatedProducts} from '@algolia/recommend-react';
// import {HorizontalSlider} from '@algolia/ui-components-horizontal-slider-react';
import recommend from '@algolia/recommend';

import {
  InstantSearch,
  InstantSearchSSRProvider,
  Pagination,
  Highlight,
  Configure,
  Hits,
  RefinementList,
  SortBy,
  HitsPerPage,
  ClearRefinements,
  CurrentRefinements,
} from 'react-instantsearch-hooks-web';
import {InfiniteHits} from 'react-instantsearch-hooks-web';
import algoliasearch from 'algoliasearch/lite';
import {singleIndex} from 'instantsearch.js/cjs/lib/stateMappings';
import {history} from 'instantsearch.js/cjs/lib/routers';
import {Image} from '@shopify/hydrogen';
import {Insights} from './AlgoliaInsights.client';
import '../../styles/search.css';
import Filters from '../modules/Filters.client';
import '../../styles/theme.css';
import {getBlendMode} from '../../utils/getBlendMode';
const indexName = algoConfig.prefix + 'products';
const appId = algoConfig.appId;
const apiKey = algoConfig.appKey;
const recommendClient = recommend(appId, apiKey);

const imageLoader = ({src}) => {
  return `${src}?w=352&h=466 352w, ${src}?w=832&h=1101 832w`;
};

const RelatedItem = ({item, sendEvent}) => (
  <article className="">
    <a
      href={'/products/' + item.id}
      onClick={() => {
        // Using insights hook to send event
        sendEvent('click', item, 'Recommended - Product Clicked');
      }}
    >
      <header className="relative overflow-hidden rounded-md bg-gray">
        {item.image ? (
          <Image
            // data={item.image}
            loader={imageLoader}
            src={item.image}
            srcSet={`${item.image}?w=375&h=562.5 375w, ${item.image}?w=600&h=900 600w, ${item.image}?w=800&h=1200 800w`}
            alt={item.title}
            width="600"
            height="900"
            className="hit-image aspect-[3/4]"
            style={{mixBlendMode: getBlendMode(item)}}
          />
        ) : (
          <div className="hit-image aspect-[3/4] bg-gray"></div>
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

export default function Recommended({storefrontProduct, currentObjectID}) {
  var filters = [];

  const condition = storefrontProduct?.condition?.value
    ? JSON.parse(storefrontProduct?.condition?.value)
    : null;
  const era = storefrontProduct.era?.value;

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

  // if (condition) filters.push({type: 'condition', title: condition.value});
  if (era) filters.push({type: 'era', title: era});
  return (
    <div>
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row ">
        <h3 className="text-center">Shop more in</h3>
        {filters.length > 0 && <Filters filters={filters} />}
      </div>
      <RelatedProducts
        recommendClient={recommendClient}
        indexName={indexName}
        objectIDs={[currentObjectID]}
        maxRecommendations={10}
        itemComponent={RelatedItem}
        //   view={HorizontalSlider}
      />
    </div>
  );
}
