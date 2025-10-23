import {autocomplete, getAlgoliaResults} from '@algolia/autocomplete-js';
import {useEffect, useRef, Fragment} from 'react';
import {createLocalStorageRecentSearchesPlugin} from '@algolia/autocomplete-plugin-recent-searches';
import {createAlgoliaInsightsPlugin} from '@algolia/autocomplete-plugin-algolia-insights';
import {Image} from '@shopify/hydrogen-react';
import '@algolia/autocomplete-theme-classic';
import algoConfig from '../../../algolia.config.json';
import {searchClient} from '../../utils/search/algoliaSettings';
import '../../styles/search.css';
import {Link} from 'react-router';

// Define item types for Algolia hits
interface QuerySuggestionItem {
  query: string; // Change to queryString if LegacySearchQuery requires it (e.g., { queryString: string })
}

interface CollectionItem {
  handle: string;
  title: string;
}

interface PageItem {
  handle: string;
  title: string;
}

interface ProductItem {
  id: string;
  title: string;
  image: string;
  product_type: string;
  price: number;
}

interface EditorialItem {
  title: string;
  url: string;
}

type AlgoliaItem =
  | QuerySuggestionItem
  | CollectionItem
  | PageItem
  | ProductItem
  | EditorialItem;

// Use the same searchClient as CollectionSearchPage
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'hydrogen-algolia',
  limit: 3,
});

function ProductItem({hit, components}: {hit: ProductItem; components: any}) {
  return (
    <Link to={`/products/${hit.id}`} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
          <Image
            src={hit.image}
            alt={hit.title}
            width={40}
            height={40}
            loading="lazy"
          />
        </div>
        <div className="aa-ItemContentBody">
          <p className="hit-category">{hit.product_type}</p>
          <div className="aa-ItemContentTitle">
            <components.ReverseHighlight hit={hit} attribute="title" />
          </div>
          <div className="aa-ItemContentDescription">
            <p>
              <span className="hit-em">$</span> <strong>{hit.price}</strong>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function AlgoliaAutocomplete() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const insightsClient = (window as any).aa;
    // Initialize insights client
    insightsClient('init', {
      appId: algoConfig.appId,
      apiKey: algoConfig.appKey,
      useCookie: true,
    });
    const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({insightsClient});

    const search = autocomplete<any>({
      container: containerRef.current,
      placeholder: 'Search',
      plugins: [recentSearchesPlugin, algoliaInsightsPlugin],
      onSubmit({state}) {
        window.location.replace(
          `/search?query=${encodeURIComponent(state.query)}`,
        );
      },
      getSources({query}) {
        return [
          {
            sourceId: 'querySuggestions',
            getItemInputValue: ({item}: {item: QuerySuggestionItem}) =>
              item.query, // Change to item.queryString if needed
            getItems({query}) {
              return getAlgoliaResults<QuerySuggestionItem>({
                searchClient,
                queries: [
                  {
                    indexName: algoConfig.QSindex,
                    params: {
                      query,
                      hitsPerPage: 4,
                    },
                  },
                ],
              });
            },
            getItemUrl({item}: {item: QuerySuggestionItem}) {
              return `/search?query=${encodeURIComponent(item.query)}`; // Change to item.queryString if needed
            },
            templates: {
              header() {
                return (
                  <Fragment>
                    <span className="aa-SourceHeaderTitle">Suggestions</span>
                    <div className="aa-SourceHeaderLine" />
                  </Fragment>
                );
              },
              item({item, components}) {
                return (
                  <Link
                    to={`/search?query=${encodeURIComponent(item.query)}`} // Change to item.queryString if needed
                    className="aa-ItemLink"
                  >
                    <components.ReverseHighlight hit={item} attribute="query" />{' '}
                    {/* Change to queryString if needed */}
                  </Link>
                );
              },
              noResults() {
                return 'No suggestions found';
              },
            },
          },
          {
            sourceId: 'collections',
            getItemInputValue: ({item}: {item: CollectionItem}) => item.title,
            getItems({query}) {
              return getAlgoliaResults<CollectionItem>({
                searchClient,
                queries: [
                  {
                    indexName: `${algoConfig.prefix}collections`,
                    params: {
                      query,
                      hitsPerPage: 3,
                    },
                  },
                ],
              });
            },
            getItemUrl({item}: {item: CollectionItem}) {
              return `/collections/${item.handle}`;
            },
            templates: {
              header() {
                return (
                  <Fragment>
                    <span className="aa-SourceHeaderTitle">Collections</span>
                    <div className="aa-SourceHeaderLine" />
                  </Fragment>
                );
              },
              item({item}) {
                return (
                  <Link
                    to={`/collections/${item.handle}`}
                    className="aa-ItemLink"
                  >
                    <div className="aa-ItemContent">
                      <div className="aa-ItemContentBody">{item.title}</div>
                    </div>
                  </Link>
                );
              },
              noResults() {
                return 'No collections found';
              },
            },
          },
          {
            sourceId: 'pages',
            getItemInputValue: ({item}: {item: PageItem}) => item.title,
            getItems({query}) {
              return getAlgoliaResults<PageItem>({
                searchClient,
                queries: [
                  {
                    indexName: `${algoConfig.prefix}pages`,
                    params: {
                      query,
                      hitsPerPage: 3,
                    },
                  },
                ],
              });
            },
            getItemUrl({item}: {item: PageItem}) {
              return `/pages/${item.handle}`;
            },
            templates: {
              header() {
                return (
                  <Fragment>
                    <span className="aa-SourceHeaderTitle">Pages</span>
                    <div className="aa-SourceHeaderLine" />
                  </Fragment>
                );
              },
              item({item}) {
                return (
                  <Link to={`/pages/${item.handle}`} className="aa-ItemLink">
                    <div className="aa-ItemContent">
                      <div className="aa-ItemContentBody">{item.title}</div>
                    </div>
                  </Link>
                );
              },
              noResults() {
                return 'No pages found';
              },
            },
          },
          {
            sourceId: 'products',
            getItemInputValue: ({item}: {item: ProductItem}) => item.title,
            getItems({query}) {
              return getAlgoliaResults<ProductItem>({
                searchClient,
                queries: [
                  {
                    indexName:
                      algoConfig.QSindex || `${algoConfig.prefix}products`, // Align with CollectionSearchPage
                    params: {
                      hitsPerPage: 4,
                      query,
                      distinct: true,
                      clickAnalytics: true,
                    },
                  },
                ],
              });
            },
            getItemUrl({item}: {item: ProductItem}) {
              return `/products/${item.id}`;
            },
            templates: {
              header() {
                return (
                  <Fragment>
                    <span className="aa-SourceHeaderTitle">Products</span>
                    <div className="aa-SourceHeaderLine" />
                  </Fragment>
                );
              },
              item({item, components}) {
                return <ProductItem hit={item} components={components} />;
              },
              noResults() {
                return 'No products found';
              },
            },
          },
          {
            sourceId: 'editorial',
            getItemInputValue: ({item}: {item: EditorialItem}) => item.title,
            getItems({query}) {
              return [
                {
                  title: 'Search in all products',
                  url: `/search?query=${encodeURIComponent(query)}`,
                },
              ];
            },
            getItemUrl({item}: {item: EditorialItem}) {
              return item.url;
            },
            templates: {
              header() {
                return (
                  <Fragment>
                    <span className="aa-SourceHeaderTitle">Search</span>
                    <div className="aa-SourceHeaderLine" />
                  </Fragment>
                );
              },
              item({item}) {
                return (
                  <Link to={item.url} className="aa-ItemLink">
                    <div className="aa-ItemContent">
                      <div className="aa-ItemContentBody">
                        <div className="font-semibold m-3 text-sm text-blue-800">
                          {item.title}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              },
              noResults() {
                return 'No results found';
              },
            },
          },
        ];
      },
    });

    return () => {
      search.destroy();
    };
  }, []);

  return <div ref={containerRef} id="autocomplete" />;
}
