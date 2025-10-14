import {
  InstantSearch,
  InstantSearchSSRProvider,
  Configure,
  RefinementList,
  HitsPerPage,
  ClearRefinements,
  CurrentRefinements,
} from 'react-instantsearch-hooks-web';
import {InfiniteHits} from 'react-instantsearch-hooks-web';
import clsx from 'clsx';
import {Fragment} from 'react';

import {simple} from 'instantsearch.js/es/lib/stateMappings';
import {history} from 'instantsearch.js/es/lib/routers';

import {Insights} from './AlgoliaInsights.client';
import '../../styles/search.css';
import '../../styles/theme.css';
import {Suspense, useEffect, useState} from 'react';
import FilterToggle from '../filter/FilterToggle.client';
import FilterDialog from '../filter/FilterDialog.client';
import SortBy from './SortBy.client';
import {Disclosure, Transition} from '@headlessui/react';
import {toTitleCase} from '../../utils/toTitleCase';
import {sortClothingSizes} from '../../utils/search/sortClothingSizes';
import {transformShoeRefineItems} from '../../utils/search/transformShoeRefineItems';
import {transformClothingRefineItems} from '../../utils/search/transformClothingRefineItems';
import {indexName, searchClient} from '../../utils/search/algoliaSettings';
import Stats from './Stats';
import Hit from './Hit';
import CustomRefinementList from './CustomRefinementList';
import {transformItems} from '../../utils/search/transformItems';
import {sortShoeSizes} from '../../utils/search/sortShoeSizes';
import {sortAlphabetical} from '../../utils/search/sortAlphabetical';

export function CollectionSearchPage({
  serverState,
  serverUrl,
  collection,
  description,
  title,
}) {
  const [filtersLength, setFiltersLength] = useState(0);
  const onStateChange = ({uiState, setUiState}) => {
    let len = 0;
    if (uiState.shopify_products?.refinementList) {
      Object.entries(uiState.shopify_products?.refinementList)?.forEach(
        (item) => {
          len += item[1].length;
        },
      );
    }

    setFiltersLength(len);
    // window.scrollTo(0, 0);
    // Find if filters are set
    // If so, reorder them and color based on the category
    setUiState(uiState);

    setTimeout(() => setActiveFilters(), 50);
    setTimeout(() => setActiveFilters(), 250);
    setTimeout(() => setActiveFilters(), 500);
    setTimeout(() => setActiveFilters(), 1000);
  };

  const setActiveFilters = () => {
    var labels = document.getElementsByClassName(
      'ais-CurrentRefinements-label',
    );
    Array.from(labels).forEach(function (label) {
      switch (label.innerText) {
        case 'product_type:':
          label.className = 'ais-CurrentRefinements-label label-product-type';
          label.parentElement.className =
            'ais-CurrentRefinements-item flex order-2';
          let cats = label.parentElement.getElementsByClassName(
            'ais-CurrentRefinements-category',
          );
          Array.from(cats).forEach(function (cat) {
            cat.className = 'ais-CurrentRefinements-category filter-1';
          });
          break;
        case 'vendor:':
          label.parentElement.className =
            'ais-CurrentRefinements-item flex order-1';
          let catsVendor = label.parentElement.getElementsByClassName(
            'ais-CurrentRefinements-category',
          );
          Array.from(catsVendor).forEach(function (cat) {
            cat.className = 'ais-CurrentRefinements-category button-vendor';
          });
          break;
        case 'options.color:':
          label.className = 'ais-CurrentRefinements-label';
          label.parentElement.className =
            'ais-CurrentRefinements-item flex order-3';
          let catsColorOption = label.parentElement.getElementsByClassName(
            'ais-CurrentRefinements-category',
          );
          Array.from(catsColorOption).forEach(function (cat) {
            cat.className = 'ais-CurrentRefinements-category button-options';
            let color = cat.getElementsByClassName(
              'ais-CurrentRefinements-categoryLabel',
            );
            cat.setAttribute('data-color', toTitleCase(color[0].innerText));
          });
          break;
        case 'options.material':
        case 'options.size:':
          label.className = 'ais-CurrentRefinements-label';
          label.parentElement.className =
            'ais-CurrentRefinements-item flex order-3';
          let catsOption = label.parentElement.getElementsByClassName(
            'ais-CurrentRefinements-category',
          );
          Array.from(catsOption).forEach(function (cat) {
            cat.className = 'ais-CurrentRefinements-category button-options';
          });
        case 'price:':
          label.className = 'ais-CurrentRefinements-label';
          label.parentElement.className =
            'ais-CurrentRefinements-item flex order-4';
          Array.from(catsOption).forEach(function (cat) {
            cat.className = 'ais-CurrentRefinements-category button-options';
          });
        case 'meta.product.era:':
          label.className = 'ais-CurrentRefinements-label';
          label.parentElement.className =
            'ais-CurrentRefinements-item flex order-3';
          let catsEra = label.parentElement.getElementsByClassName(
            'ais-CurrentRefinements-category',
          );
          Array.from(catsEra).forEach(function (cat) {
            cat.className = 'ais-CurrentRefinements-category button-options';
          });
      }
    });
  };

  useEffect(() => {
    setActiveFilters();
    setTimeout(() => setActiveFilters(), 50);
    setTimeout(() => setActiveFilters(), 250);
    setTimeout(() => setActiveFilters(), 500);
    setTimeout(() => setActiveFilters(), 1000);
  }, []);

  const formattedTitle = title ? title.replace(/into archive - /gi, '') : '';

  return (
    <>
      <InstantSearchSSRProvider {...serverState}>
        <InstantSearch
          searchClient={searchClient}
          indexName={indexName}
          onStateChange={onStateChange}
          routing={{
            stateMapping: simple(),
            router: history({
              getLocation: () =>
                typeof window === 'undefined' && serverUrl
                  ? new URL(serverUrl)
                  : window.location,
            }),
          }}
        >
          <Insights />

          <div className="sticky left-0 top-12 z-10 flex w-full gap-3">
            <div className=" mb-4 flex  w-full justify-between gap-1">
              <div className="-ml-6 w-full flex-1 items-center gap-1 overflow-x-auto md:-mx-0 md:flex">
                <div className=" flex gap-1 pl-6 md:mx-0 md:mt-0 md:pl-0">
                  <Suspense>
                    <FilterToggle />
                  </Suspense>
                  <CurrentRefinements
                    classNames={{
                      item: 'hidden',
                      category: 'hidden',
                    }}
                    transformItems={transformItems}
                  />

                  <ClearRefinements
                    translations={{
                      resetButtonText: 'Clear',
                    }}
                  />
                </div>
              </div>
              <section className="flex  items-center">
                <header className="flex justify-end gap-8">
                  <SortBy />
                  <HitsPerPage
                    className="hidden"
                    items={[
                      {
                        label: '16 hits per page',
                        value: 16,
                      },
                      {
                        label: '32 hits per page',
                        value: 32,
                      },
                      {
                        label: '60 hits per page',
                        value: 60,
                        default: true,
                      },
                    ]}
                  />
                </header>
              </section>
            </div>
          </div>
          <div className="hidden">
            <RefinementList
              sortBy={['name:asc']}
              attribute="product_type"
              limit={10}
            />

            <RefinementList
              sortBy={['name:asc']}
              attribute="options.color"
              limit={100}
            />

            <RefinementList
              sortBy={['name:asc']}
              attribute="options.size"
              limit={100}
            />

            <RefinementList
              sortBy={['name:asc']}
              attribute="vendor"
              limit={100}
            />
            <RefinementList
              sortBy={['name:asc']}
              attribute="options.material"
              limit={100}
            />
            <RefinementList
              sortBy={['name:asc']}
              attribute="meta.product.era"
            />
          </div>
          <Suspense>
            <FilterDialog filtersLength={filtersLength}>
              <main>
                <div className="relative flex-1">
                  <div>
                    <section>
                      {/* Mobile */}
                      <div className="grid grid-flow-row gap-y-2 md:hidden">
                        <div className="bg-panelBg  hover:bg-gray">
                          <Disclosure unmount={false}>
                            <Disclosure.Button className="block w-full  cursor-pointer   p-4 text-left text-xxs font-bold">
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
                              <Disclosure.Panel className="p-4" unmount={false}>
                                <RefinementList
                                  sortBy={['name:asc']}
                                  attribute="product_type"
                                  limit={10}
                                />
                              </Disclosure.Panel>
                            </Transition>
                          </Disclosure>
                        </div>
                        <div className="bg-panelBg  hover:bg-gray">
                          <Disclosure unmount={false}>
                            <Disclosure.Button className="block w-full  cursor-pointer   p-4 text-left text-xxs font-bold">
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
                              <Disclosure.Panel className="p-4" unmount={false}>
                                <RefinementList
                                  sortBy={sortAlphabetical}
                                  attribute="options.color"
                                  limit={100}
                                />
                              </Disclosure.Panel>
                            </Transition>
                          </Disclosure>
                        </div>

                        <div className="bg-panelBg  hover:bg-gray">
                          <Disclosure unmount={false}>
                            <Disclosure.Button className="block w-full  cursor-pointer   p-4 text-left text-xxs font-bold">
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
                              <Disclosure.Panel className="p-4" unmount={false}>
                                <CustomRefinementList
                                  attr="options.size"
                                  transformFn={transformShoeRefineItems}
                                  sortBy={sortShoeSizes}
                                  limit={100}
                                />
                              </Disclosure.Panel>
                            </Transition>
                          </Disclosure>
                        </div>

                        <div className="bg-panelBg  hover:bg-gray">
                          <Disclosure unmount={false}>
                            <Disclosure.Button className="block w-full  cursor-pointer   p-4 text-left text-xxs font-bold">
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
                              <Disclosure.Panel className="p-4" unmount={false}>
                                <CustomRefinementList
                                  attr="options.size"
                                  transformFn={transformClothingRefineItems}
                                  limit={100}
                                  sortBy={sortClothingSizes}
                                />
                              </Disclosure.Panel>
                            </Transition>
                          </Disclosure>
                        </div>

                        <div className="bg-panelBg  hover:bg-gray">
                          <Disclosure unmount={false}>
                            <Disclosure.Button className="block  w-full cursor-pointer   p-4 text-left text-xxs font-bold">
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
                              <Disclosure.Panel className="p-4" unmount={false}>
                                <RefinementList
                                  sortBy={['name:asc']}
                                  attribute="vendor"
                                  limit={100}
                                  id="DesignerList"
                                />
                              </Disclosure.Panel>
                            </Transition>
                          </Disclosure>
                        </div>
                        <div className="bg-panelBg  hover:bg-gray">
                          <Disclosure unmount={false}>
                            <Disclosure.Button className="block  w-full cursor-pointer   p-4 text-left text-xxs font-bold">
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
                              <Disclosure.Panel className="p-4" unmount={false}>
                                <RefinementList
                                  id="MaterialList"
                                  sortBy={['name:asc']}
                                  attribute="options.material"
                                  limit={100}
                                />
                              </Disclosure.Panel>
                            </Transition>
                          </Disclosure>
                        </div>

                        <div className="bg-panelBg  hover:bg-gray">
                          <Disclosure unmount={false}>
                            <Disclosure.Button className="block w-full  cursor-pointer   p-4 text-left text-xxs font-bold">
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
                              <Disclosure.Panel className="p-4" unmount={false}>
                                <RefinementList
                                  sortBy={['name:asc']}
                                  attribute="meta.product.era"
                                />
                              </Disclosure.Panel>
                            </Transition>
                          </Disclosure>
                        </div>
                      </div>
                      {/* Desktop */}
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
                            // id="MaterialDesktopList"
                            sortBy={['name:asc']}
                            attribute="options.material"
                            // limit={100}
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
              filters={"collections:'" + collection + "'"}
              distinct
              clickAnalytics
            />
          )}
          {title && (
            <div className={clsx('text-2xl', 'md:text-3xl')}>
              {formattedTitle}
            </div>
          )}
          {description && (
            <div className="mt-4" style={{lineHeight: 1.3}}>
              {description.split('/n').map((line, index) => (
                <div
                  className="mb-3 max-w-full text-md md:max-w-3/4"
                  key={index}
                >
                  {line}
                </div>
              ))}
            </div>
          )}
          <div className="min-h-screen pt-8">
            <InfiniteHits showPrevious={false} hitComponent={Hit} />
            <Stats />
          </div>
        </InstantSearch>
      </InstantSearchSSRProvider>
    </>
  );
}
