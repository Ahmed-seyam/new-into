import {Suspense} from 'react';

import {
  FileRoutes,
  PerformanceMetrics,
  PerformanceMetricsDebug,
  Route,
  Router,
  ShopifyAnalytics,
  ShopifyProvider,
  useRouteParams,
  useSession,
} from '@shopify/hydrogen';
import renderHydrogen from '@shopify/hydrogen/entry-server';

import ServerCartProvider from './components/cart/ServerCartProvider.server';
import DefaultSeo from './components/DefaultSeo.server';
import LoadingFallback from './components/global/LoadingFallback';
import NotFound from './components/global/NotFound.server';
// import StitchesStyleTag from './StitchesStyleTag.client';
import SearchUIProvider from './components/search/SearchUIProvider.client';
import FilterUIProvider from './components/filter/FilterUIProvider.client';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';
import Newsletter from './components/global/Newsletter.client';
function App() {
  const session = useSession();
  const {handle} = useRouteParams();
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <ShopifyProvider countryCode={session?.countryCode as CountryCode}>
          <ServerCartProvider>
            <SearchUIProvider>
              <FilterUIProvider>
                <DefaultSeo />
                <Router>
                  <FileRoutes />
                  {/* @ts-expect-error <NotFound> doesn't require response */}
                  <Route path="*" page={<NotFound />} />
                </Router>
                <Newsletter />
              </FilterUIProvider>
            </SearchUIProvider>
          </ServerCartProvider>
          <PerformanceMetrics />
          {import.meta.env.DEV && <PerformanceMetricsDebug />}
          <ShopifyAnalytics />
        </ShopifyProvider>
      </Suspense>
    </>
  );
}

export default renderHydrogen(App);
