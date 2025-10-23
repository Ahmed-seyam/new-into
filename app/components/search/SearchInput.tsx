import algoConfig from '../../../algolia.config.json';
import {algoliasearch} from 'algoliasearch';
import {autocomplete} from '@algolia/autocomplete-js';
import {
  Highlight,
  Hits,
  InstantSearch,
  useSearchBox,
  usePagination,
  HitsPerPage,
  useHierarchicalMenu,
  useInstantSearch,
} from 'react-instantsearch';
import {createLocalStorageRecentSearchesPlugin} from '@algolia/autocomplete-plugin-recent-searches';
import {useEffect, useRef, useState, useMemo, Fragment} from 'react';
import {
  INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES,
  INSTANT_SEARCH_QUERY_SUGGESTIONS,
  INSTANT_SEARCH_INDEX_NAME,
} from './constants';
import {createQuerySuggestionsPlugin} from '@algolia/autocomplete-plugin-query-suggestions';
import clsx from 'clsx';
import {getBlendMode} from '~/utils/getBlendMode';
import {Dialog, Transition} from '@headlessui/react';
import {useConnector} from 'react-instantsearch';
import connectStats from 'instantsearch.js/es/connectors/stats/connectStats';
import CloseIcon from '~/components/icons/Close';
import {useSearchUI} from '~/components/search/SearchUIProvider';
import '~/styles/search.css';
import {href} from 'react-router';
import {div} from 'three/src/nodes/TSL.js';

function debounce<T extends (...args: any[]) => any>(fn: T, time: number) {
  let timerId: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => fn(...args), time);
  };
}

type AutocompleteProps = {
  searchClient: any;
  searchText: string;
  setSearchText: (text: string) => void;
  className?: string;
};

function Autocomplete({
  searchClient,
  searchText,
  setSearchText,
  className,
  ...autocompleteProps
}: AutocompleteProps) {
  const autocompleteContainer = useRef<HTMLDivElement>(null);
  const {query, refine: setQuery} = useSearchBox();
  const {items: categories, refine: setCategory} = useHierarchicalMenu({
    attributes: INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES,
  });
  const {refine: setPage} = usePagination();
  const [instantSearchUiState, setInstantSearchUiState] = useState({query});

  const debouncedSetInstantSearchUiState = useMemo(
    () => debounce(setInstantSearchUiState, 250),
    [],
  );

  useEffect(() => {
    setQuery(instantSearchUiState.query);
    setSearchText(instantSearchUiState.query);
    if (instantSearchUiState.category) {
      setCategory(instantSearchUiState.category);
    }
    setPage(0);
  }, [instantSearchUiState, setQuery, setSearchText, setCategory, setPage]);

  const currentCategory = useMemo(
    () => categories.find(({isRefined}) => isRefined)?.value,
    [categories],
  );

  const plugins = useMemo(() => {
    const recentSearches = createLocalStorageRecentSearchesPlugin({
      key: 'instantsearch',
      limit: 3,
      transformSource({source}) {
        return {
          ...source,
          onSelect({item}: any) {
            setInstantSearchUiState({
              query: item.label,
              category: item.category,
            });
          },
        };
      },
    });

    const querySuggestionsInCategory = createQuerySuggestionsPlugin({
      searchClient,
      indexName: INSTANT_SEARCH_QUERY_SUGGESTIONS,
      getSearchParams() {
        return recentSearches.data!.getAlgoliaSearchParams({
          hitsPerPage: 3,
          facetFilters: [
            `${INSTANT_SEARCH_INDEX_NAME}.facets.exact_matches.${INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0]}.value:${currentCategory}`,
          ],
        });
      },
      transformSource({source}) {
        return {
          ...source,
          sourceId: 'querySuggestionsInCategoryPlugin',
          onSelect({item}: any) {
            setInstantSearchUiState({
              query: item.query,
              category: item.__autocomplete_qsCategory,
            });
          },
          getItems(params: any) {
            if (!currentCategory) {
              return [];
            }
            return source.getItems(params);
          },
          templates: {
            ...source.templates,
            header({items}: any) {
              if (items.length === 0) {
                return null;
              }
              return (
                <>
                  <span className="aa-SourceHeaderTitle">
                    In {currentCategory}
                  </span>
                  <span className="aa-SourceHeaderLine" />
                </>
              );
            },
          },
        };
      },
    });

    const querySuggestions = createQuerySuggestionsPlugin({
      searchClient,
      indexName: INSTANT_SEARCH_QUERY_SUGGESTIONS,
      getSearchParams() {
        if (!currentCategory) {
          return recentSearches.data!.getAlgoliaSearchParams({
            hitsPerPage: 6,
          });
        }
        return recentSearches.data!.getAlgoliaSearchParams({
          hitsPerPage: 3,
          facetFilters: [
            `${INSTANT_SEARCH_INDEX_NAME}.facets.exact_matches.${INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0]}.value:-${currentCategory}`,
          ],
        });
      },
      categoryAttribute: [
        INSTANT_SEARCH_INDEX_NAME,
        'facets',
        'exact_matches',
        INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0],
      ],
      transformSource({source}) {
        return {
          ...source,
          sourceId: 'querySuggestionsPlugin',
          onSelect({item}: any) {
            setInstantSearchUiState({
              query: item.query,
              category: item.__autocomplete_qsCategory || '',
            });
          },
          getItems(params: any) {
            if (!params.state.query) {
              return [];
            }
            return source.getItems(params);
          },
          templates: {
            ...source.templates,
            header({items}: any) {
              if (!currentCategory || items.length === 0) {
                return null;
              }
              return (
                <>
                  <span className="aa-SourceHeaderTitle">
                    In other categories
                  </span>
                  <span className="aa-SourceHeaderLine" />
                </>
              );
            },
          },
        };
      },
    });

    return [recentSearches, querySuggestionsInCategory, querySuggestions];
  }, [currentCategory, searchClient]);

  useEffect(() => {
    if (!autocompleteContainer.current) {
      return;
    }

    const autocompleteInstance = autocomplete({
      ...autocompleteProps,
      container: autocompleteContainer.current,
      initialState: {query},
      plugins,
      onReset() {
        setInstantSearchUiState({query: '', category: currentCategory});
      },
      onSubmit({state}) {
        setInstantSearchUiState({query: state.query});
      },
      onStateChange({prevState, state}) {
        if (prevState.query !== state.query) {
          debouncedSetInstantSearchUiState({
            query: state.query,
          });
        }
      },
    });

    return () => autocompleteInstance.destroy();
  }, [plugins, query, currentCategory, debouncedSetInstantSearchUiState]);

  return <div className={className} ref={autocompleteContainer} />;
}

type HitProps = {
  hit: any;
  sendEvent: (eventName: string, hit: any, eventLabel: string) => void;
};

const Hit = ({hit, sendEvent}: HitProps) => (
  <article className="flex">
    <a
      href={'/products/' + hit.id}
      className="flex items-start gap-4"
      onClick={() => {
        sendEvent('click', hit, 'PLP - Product Clicked');
      }}
    >
      <header
        className="relative w-12 flex-shrink-0 overflow-hidden rounded-md"
        style={{backgroundColor: '#F6F6F6'}}
      >
        {hit.image ? (
          <img
            src={`${hit.image}?w=600&h=900`}
            srcSet={`${hit.image}?w=375&h=562.5 375w, ${hit.image}?w=600&h=900 600w, ${hit.image}?w=800&h=1200 800w`}
            alt={hit.title}
            width="600"
            height="900"
            className="hit-image aspect-[3/4] flex-shrink-0"
            style={{
              backgroundColor: '#F6F6F6',
              mixBlendMode: getBlendMode(hit),
            }}
            loading="lazy"
          />
        ) : (
          <div className="hit-image aspect-[3/4] bg-gray" />
        )}
      </header>
      <div>
        <p className="mb-1 text-xxs font-bold">{hit.vendor}</p>
        <Highlight attribute="title" hit={hit} />
        {hit.price > 0 ? (
          <footer>
            {hit.inventory_available ? (
              <p>${hit.price}</p>
            ) : (
              <p>
                <s>${hit.price}</s> Sold out
              </p>
            )}
          </footer>
        ) : (
          <footer>For rent</footer>
        )}
      </div>
    </a>
  </article>
);

const indexName = algoConfig.prefix + 'products';
const appId = algoConfig.appId;
const apiKey = algoConfig.appKey;
const searchClient = algoliasearch(appId, apiKey);

export default function SearchInput() {
  const {isSearchOpen, closeSearch} = useSearchUI();
  const [searchText, setSearchText] = useState('');

  return (
    <Transition show={isSearchOpen}>
      <Dialog onClose={closeSearch}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-40 bg-lightGray bg-opacity-60"
          />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in-out duration-500"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="fixed inset-0 z-40 overflow-y-auto">
            <Dialog.Panel
              className={clsx(
                'bottom-0 left-0 right-0 top-0 z-40 flex h-auto w-full flex-col overflow-hidden rounded-md md:fixed md:bottom-auto md:left-auto md:mt-12 md:w-4/12',
              )}
            >
              <div className="relative top-0 z-40 mb-24 shadow-lg md:mr-6">
                <div className="container overflow-hidden rounded-md bg-white drop-shadow-lg">
                  <InstantSearch
                    searchClient={searchClient}
                    indexName={indexName}
                    routing={false}
                  >
                    <SearchHeader>
                      <div className="w-full flex-1">
                        <Autocomplete
                          searchText={searchText}
                          setSearchText={setSearchText}
                          searchClient={searchClient}
                          placeholder="Search designer, color, category..."
                          detachedMediaQuery="none"
                          openOnFocus
                          className="w-full p-2"
                        />
                      </div>
                    </SearchHeader>
                    <div>
                      <EmptyQueryBoundary fallback={null}>
                        <NoResultsBoundary fallback={<NoResults />}>
                          <Results searchText={searchText} />
                        </NoResultsBoundary>
                      </EmptyQueryBoundary>
                    </div>
                    <HitsPerPage
                      className="hidden"
                      items={[
                        {
                          label: '60 hits per page',
                          value: 6,
                          default: true,
                        },
                      ]}
                    />
                  </InstantSearch>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

function SearchHeader({children}: {children: React.ReactNode}) {
  const {closeSearch} = useSearchUI();
  return (
    <div className="flex items-center justify-between gap-6 py-6">
      {children}
      <button type="button" onClick={closeSearch}>
        <CloseIcon />
      </button>
    </div>
  );
}

export function useStats() {
  return useConnector(connectStats);
}

function Results({searchText}: {searchText: string}) {
  const {nbHits} = useStats();

  return (
    <div className="pt-0">
      <h3 className="mb-6 text-xxs font-bold">Products</h3>
      <Hits hitComponent={Hit} />
      <br />
      <br />
      {nbHits > 6 ? (
        <a
          href={`/search?shopify_products[query]=${searchText}`}
          className="btn-primary block truncate text-ellipsis"
        >
          Show ({nbHits}) more results for&nbsp;<em>{searchText}</em>
        </a>
      ) : (
        <button
          disabled
          className="btn-primary block w-full truncate text-ellipsis"
        >
          Displaying all ({nbHits}) results
        </button>
      )}
      <br />
    </div>
  );
}

function EmptyQueryBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const {indexUiState} = useInstantSearch();
  if (!indexUiState.query) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}

function NoResultsBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const {results} = useInstantSearch();
  if (!(results as any).__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }
  return <>{children}</>;
}

function NoResults() {
  const {indexUiState} = useInstantSearch();
  return (
    <div className="pb-4">
      <p>
        No results for <q>{indexUiState.query}</q>.
      </p>
    </div>
  );
}
