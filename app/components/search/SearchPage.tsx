'use client';
import {
  InstantSearch,
  InstantSearchSSRProvider,
  Configure,
  RefinementList,
  ClearRefinements,
  CurrentRefinements,
  useSearchBox,
  InfiniteHits,
} from 'react-instantsearch';
import {Suspense, useEffect, useState} from 'react';

import {simple} from 'instantsearch.js/es/lib/stateMappings';
import {history} from 'instantsearch.js/es/lib/routers';

import {Disclosure, Transition} from '@headlessui/react';

import {toTitleCase} from '~/utils/toTitleCase';
import {sortClothingSizes} from '~/utils/search/sortClothingSizes';
import {transformShoeRefineItems} from '~/utils/search/transformShoeRefineItems';
import {transformClothingRefineItems} from '~/utils/search/transformClothingRefineItems';
import {indexName, searchClient} from '~/utils/search/algoliaSettings';
import {sortShoeSizes} from '~/utils/search/sortShoeSizes';
import {sortAlphabetical} from '~/utils/search/sortAlphabetical';

import Stats from './Stats';
import Hit from './Hit';
import CustomRefinementList from './CustomRefinementList';

import '~/styles/search.css';
import '~/styles/theme.css';
import Insights from 'instantsearch.js/es/helpers/insights';
import FilterDialog from '../filter/FilterDialog';
import FilterToggle from '../filter/FilterToggle';
import SortBy from './SortBy';

interface SearchPageProps {
  serverState?: any;
  serverUrl?: string;
  collection?: string;
}

function CustomSearchBox(props: any) {
  const [mounted, setMounted] = useState(false);
  const {query, refine} = useSearchBox(props);
  const [searchValue, setSearchValue] = useState(query);

  useEffect(() => {
    const queryParameters = window?.location?.search;
    const defaultValue = queryParameters?.split('[query]=');
    if (defaultValue[1]) {
      setSearchValue(decodeURI(defaultValue[1]));
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    refine(e.target.value);
    setSearchValue(e.target.value);
  };

  const onReset = () => {
    refine('');
    setSearchValue('');
  };

  return (
    <div className="ais-SearchBox">
      <form action="" className="ais-SearchBox-form" noValidate>
        <input
          className="ais-SearchBox-input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Search designer, color, category..."
          spellCheck="false"
          maxLength={512}
          type="search"
          value={searchValue}
          onChange={onChange}
        />
        <button
          className="ais-SearchBox-submit"
          type="submit"
          title="Submit the search query"
        >
          <svg
            className="ais-SearchBox-submitIcon"
            width="10"
            height="10"
            viewBox="0 0 40 40"
            aria-hidden="true"
          >
            <path d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z"></path>
          </svg>
        </button>
        <button
          className="ais-SearchBox-reset"
          type="reset"
          title="Clear the search query"
          hidden={!query}
          onClick={onReset}
        >
          <svg
            className="ais-SearchBox-resetIcon"
            viewBox="0 0 20 20"
            width="10"
            height="10"
            aria-hidden="true"
          >
            <path d="M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
}

export function SearchPage({
  serverState,
  serverUrl,
  collection,
}: SearchPageProps) {
  const [filtersLength, setFiltersLength] = useState(0);

  const onStateChange = ({uiState, setUiState}: any) => {
    let len = 0;
    if (uiState.shopify_products?.refinementList) {
      Object.entries(uiState.shopify_products?.refinementList)?.forEach(
        (item: any) => {
          len += item[1].length;
        },
      );
    }

    setFiltersLength(len);
    setUiState(uiState);

    setTimeout(() => setActiveFilters(), 50);
    setTimeout(() => setActiveFilters(), 250);
    setTimeout(() => setActiveFilters(), 500);
    setTimeout(() => setActiveFilters(), 1000);
  };

  const setActiveFilters = () => {
    const labels = document.getElementsByClassName(
      'ais-CurrentRefinements-label',
    );
    Array.from(labels).forEach(function (label) {
      switch (label.textContent) {
        case 'product_type:':
          label.className = 'ais-CurrentRefinements-label label-product-type';
          if (label.parentElement) {
            label.parentElement.className =
              'ais-CurrentRefinements-item flex order-2';
            const cats = label.parentElement.getElementsByClassName(
              'ais-CurrentRefinements-category',
            );
            Array.from(cats).forEach(function (cat) {
              cat.className = 'ais-CurrentRefinements-category filter-1';
            });
          }
          break;
        case 'vendor:':
          if (label.parentElement) {
            label.parentElement.className =
              'ais-CurrentRefinements-item flex order-1';
            const catsVendor = label.parentElement.getElementsByClassName(
              'ais-CurrentRefinements-category',
            );
            Array.from(catsVendor).forEach(function (cat) {
              cat.className = 'ais-CurrentRefinements-category button-vendor';
            });
          }
          break;
        case 'options.color:':
          label.className = 'ais-CurrentRefinements-label';
          if (label.parentElement) {
            label.parentElement.className =
              'ais-CurrentRefinements-item flex order-3';
            const catsColorOption = label.parentElement.getElementsByClassName(
              'ais-CurrentRefinements-category',
            );
            Array.from(catsColorOption).forEach(function (cat) {
              cat.className = 'ais-CurrentRefinements-category button-options';
              const color = cat.getElementsByClassName(
                'ais-CurrentRefinements-categoryLabel',
              );
              if (color[0]) {
                cat.setAttribute(
                  'data-color',
                  toTitleCase(color[0].textContent || ''),
                );
              }
            });
          }
          break;
        case 'options.material':
          label.className = 'ais-CurrentRefinements-label';
          if (label.parentElement) {
            label.parentElement.className =
              'ais-CurrentRefinements-item flex order-3';
            const catsMaterialOption =
              label.parentElement.getElementsByClassName(
                'ais-CurrentRefinements-category',
              );
            Array.from(catsMaterialOption).forEach(function (cat) {
              cat.className = 'ais-CurrentRefinements-category button-options';
            });
          }
          break;
        case 'options.size:':
          label.className = 'ais-CurrentRefinements-label';
          if (label.parentElement) {
            label.parentElement.className =
              'ais-CurrentRefinements-item flex order-3';
            const catsSizeOption = label.parentElement.getElementsByClassName(
              'ais-CurrentRefinements-category',
            );
            Array.from(catsSizeOption).forEach(function (cat) {
              cat.className = 'ais-CurrentRefinements-category button-options';
            });
          }
          break;
        case 'meta.product.era:':
          label.className = 'ais-CurrentRefinements-label label-product-type';
          if (label.parentElement) {
            label.parentElement.className =
              'ais-CurrentRefinements-item flex order-4';
            const catsEra = label.parentElement.getElementsByClassName(
              'ais-CurrentRefinements-category',
            );
            Array.from(catsEra).forEach(function (cat) {
              cat.className = 'ais-CurrentRefinements-category filter-1';
            });
          }
          break;
        default:
          break;
      }
    });
  };

  return (
    <>
      <InstantSearchSSRProvider {...serverState}>
        <InstantSearch
          searchClient={searchClient}
          indexName={indexName}
          routing={{
            router: history({
              getLocation() {
                if (typeof window === 'undefined') {
                  return new URL(serverUrl!) as unknown as Location;
                }
                return window.location;
              },
            }),
            stateMapping: simple(),
          }}
          onStateChange={onStateChange}
          insights={true}
        >
          <Configure clickAnalytics />

          <Suspense fallback={<div>Loading filters...</div>}>
            <FilterDialog filtersLength={filtersLength}>
              <main className="container mx-auto p-4">
                <div className="flex flex-col gap-4">
                  {/* Search Box and Controls */}
                  <div className="flex flex-col gap-4">
                    <CustomSearchBox />
                    <div className="flex items-center justify-between">
                      <FilterToggle />
                      <SortBy />
                    </div>
                    <CurrentRefinements />
                    <ClearRefinements />
                  </div>

                  {/* Filters Section */}
                  <div>
                    <section>
                      {/* Mobile Filters */}
                      <div className="flex flex-col gap-2 md:hidden">
                        <div className="bg-panelBg hover:bg-gray">
                          <Disclosure unmount={false}>
                            {({open}) => (
                              <>
                                <Disclosure.Button className="block w-full cursor-pointer p-4 text-left text-xxs font-bold">
                                  Categories
                                </Disclosure.Button>
                                <Transition
                                  unmount={false}
                                  enter="transition duration-100 ease-out"
                                  enterFrom="transform opacity-0"
                                  enterTo="transform scale-100 opacity-100"
                                  leave="transition duration-75 ease-out"
                                  leaveFrom="transform scale-100 opacity-100"
                                  leaveTo="transform opacity-0"
                                >
                                  <Disclosure.Panel
                                    className="p-4"
                                    unmount={false}
                                  >
                                    <RefinementList
                                      sortBy={['name:asc']}
                                      attribute="product_type"
                                      limit={10}
                                    />
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        </div>

                        <div className="bg-panelBg hover:bg-gray">
                          <Disclosure unmount={false}>
                            {({open}) => (
                              <>
                                <Disclosure.Button className="block w-full cursor-pointer p-4 text-left text-xxs font-bold">
                                  Colors
                                </Disclosure.Button>
                                <Transition
                                  unmount={false}
                                  enter="transition duration-100 ease-out"
                                  enterFrom="transform opacity-0"
                                  enterTo="transform scale-100 opacity-100"
                                  leave="transition duration-75 ease-out"
                                  leaveFrom="transform scale-100 opacity-100"
                                  leaveTo="transform opacity-0"
                                >
                                  <Disclosure.Panel
                                    className="p-4"
                                    unmount={false}
                                  >
                                    <RefinementList
                                      sortBy={sortAlphabetical}
                                      attribute="options.color"
                                      limit={100}
                                    />
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        </div>

                        <div className="bg-panelBg hover:bg-gray">
                          <Disclosure unmount={false}>
                            {({open}) => (
                              <>
                                <Disclosure.Button className="block w-full cursor-pointer p-4 text-left text-xxs font-bold">
                                  Shoe sizes
                                </Disclosure.Button>
                                <Transition
                                  unmount={false}
                                  enter="transition duration-100 ease-out"
                                  enterFrom="transform opacity-0"
                                  enterTo="transform scale-100 opacity-100"
                                  leave="transition duration-75 ease-out"
                                  leaveFrom="transform scale-100 opacity-100"
                                  leaveTo="transform opacity-0"
                                >
                                  <Disclosure.Panel
                                    className="p-4"
                                    unmount={false}
                                  >
                                    <CustomRefinementList
                                      attr="options.size"
                                      transformFn={transformShoeRefineItems}
                                      limit={100}
                                      sortBy={sortShoeSizes}
                                    />
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        </div>

                        <div className="bg-panelBg hover:bg-gray">
                          <Disclosure unmount={false}>
                            {({open}) => (
                              <>
                                <Disclosure.Button className="block w-full cursor-pointer p-4 text-left text-xxs font-bold">
                                  Clothing sizes
                                </Disclosure.Button>
                                <Transition
                                  unmount={false}
                                  enter="transition duration-100 ease-out"
                                  enterFrom="transform opacity-0"
                                  enterTo="transform scale-100 opacity-100"
                                  leave="transition duration-75 ease-out"
                                  leaveFrom="transform scale-100 opacity-100"
                                  leaveTo="transform opacity-0"
                                >
                                  <Disclosure.Panel
                                    className="p-4"
                                    unmount={false}
                                  >
                                    <CustomRefinementList
                                      attr="options.size"
                                      transformFn={transformClothingRefineItems}
                                      limit={100}
                                      sortBy={sortClothingSizes}
                                    />
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        </div>

                        <div className="bg-panelBg hover:bg-gray">
                          <Disclosure unmount={false}>
                            {({open}) => (
                              <>
                                <Disclosure.Button className="block w-full cursor-pointer p-4 text-left text-xxs font-bold">
                                  Designer
                                </Disclosure.Button>
                                <Transition
                                  unmount={false}
                                  enter="transition duration-100 ease-out"
                                  enterFrom="transform opacity-0"
                                  enterTo="transform scale-100 opacity-100"
                                  leave="transition duration-75 ease-out"
                                  leaveFrom="transform scale-100 opacity-100"
                                  leaveTo="transform opacity-0"
                                >
                                  <Disclosure.Panel
                                    className="p-4"
                                    unmount={false}
                                  >
                                    <RefinementList
                                      sortBy={['name:asc']}
                                      attribute="vendor"
                                      limit={100}
                                      id="DesignerList"
                                    />
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        </div>

                        <div className="bg-panelBg hover:bg-gray">
                          <Disclosure unmount={false}>
                            {({open}) => (
                              <>
                                <Disclosure.Button className="block w-full cursor-pointer p-4 text-left text-xxs font-bold">
                                  Material
                                </Disclosure.Button>
                                <Transition
                                  unmount={false}
                                  enter="transition duration-100 ease-out"
                                  enterFrom="transform opacity-0"
                                  enterTo="transform scale-100 opacity-100"
                                  leave="transition duration-75 ease-out"
                                  leaveFrom="transform scale-100 opacity-100"
                                  leaveTo="transform opacity-0"
                                >
                                  <Disclosure.Panel
                                    className="p-4"
                                    unmount={false}
                                  >
                                    <RefinementList
                                      id="MaterialList"
                                      sortBy={['name:asc']}
                                      attribute="options.material"
                                      limit={100}
                                    />
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        </div>

                        <div className="bg-panelBg hover:bg-gray">
                          <Disclosure unmount={false}>
                            {({open}) => (
                              <>
                                <Disclosure.Button className="block w-full cursor-pointer p-4 text-left text-xxs font-bold">
                                  Eras
                                </Disclosure.Button>
                                <Transition
                                  unmount={false}
                                  enter="transition duration-100 ease-out"
                                  enterFrom="transform opacity-0"
                                  enterTo="transform scale-100 opacity-100"
                                  leave="transition duration-75 ease-out"
                                  leaveFrom="transform scale-100 opacity-100"
                                  leaveTo="transform opacity-0"
                                >
                                  <Disclosure.Panel
                                    className="p-4"
                                    unmount={false}
                                  >
                                    <RefinementList
                                      sortBy={['name:asc']}
                                      attribute="meta.product.era"
                                    />
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        </div>
                      </div>

                      {/* Desktop Filters */}
                      <div className="hidden grid-flow-col gap-8 md:grid">
                        <div className="flex flex-col gap-6">
                          {/* Category */}
                          <div className="flex flex-col gap-3">
                            <h2>Categories</h2>
                            <RefinementList
                              sortBy={['name:asc']}
                              attribute="product_type"
                              limit={10}
                            />
                          </div>
                          {/* Era */}
                          <div className="flex flex-col gap-3">
                            <h2>Eras</h2>
                            <RefinementList
                              sortBy={['name:asc']}
                              attribute="meta.product.era"
                            />
                          </div>
                        </div>
                        {/* Color */}
                        <div className="flex flex-col gap-3">
                          <h2>Colors</h2>
                          <RefinementList
                            sortBy={sortAlphabetical}
                            attribute="options.color"
                            limit={100}
                          />
                        </div>
                        {/* Sizes */}
                        <div id="ShoeSize" className="flex flex-col gap-6">
                          {/* Shoe Size */}
                          <div className="flex flex-col gap-3">
                            <h2>Shoe sizes</h2>
                            <CustomRefinementList
                              attr="options.size"
                              transformFn={transformShoeRefineItems}
                              sortBy={sortShoeSizes}
                              limit={100}
                            />
                          </div>
                          {/* Clothing Size */}
                          <div className="flex flex-col gap-3">
                            <h2>Clothing sizes</h2>
                            <CustomRefinementList
                              attr="options.size"
                              transformFn={transformClothingRefineItems}
                              limit={100}
                              sortBy={sortClothingSizes}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <h2>Designers</h2>
                          <RefinementList
                            sortBy={['name:asc']}
                            attribute="vendor"
                            limit={100}
                            id="DesignerDesktopList"
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <h2>Materials</h2>
                          <RefinementList
                            sortBy={['name:asc']}
                            attribute="options.material"
                            showMoreLimit={100}
                            showMore={true}
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </main>
            </FilterDialog>
          </Suspense>

          {!collection ? (
            <Configure distinct clickAnalytics />
          ) : (
            <Configure
              filters={`collections:'${collection}'`}
              distinct
              clickAnalytics
            />
          )}

          <div className="pt-12">
            <InfiniteHits showPrevious={false} hitComponent={Hit} />
            <Stats />
          </div>
        </InstantSearch>
      </InstantSearchSSRProvider>
    </>
  );
}
