import clsx from 'clsx';
import groq from 'groq';

import {
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
} from '@shopify/hydrogen';

import Layout from '../components/global/Layout.server';
import NotFound from '../components/global/NotFound.server';
import HomeHero from '../components/heroes/Home.server';
import ModuleGrid from '../components/modules/ModuleGrid.server';
import {HOME_PAGE} from '../fragments/sanity/pages/home';
import useSanityQuery from '../hooks/useSanityQuery';

import type {SanityHomePage} from '../types';
const QUERY_SANITY = groq`
  *[_type == 'home'][0]{
    ${HOME_PAGE}
  }
`;

export default function IndexRoute() {
  const SINGLE_LINE_QUERY = QUERY_SANITY.replace(/\n/g, ' ');
  const {data, error} = useSanityQuery<SanityHomePage>({
    hydrogenQueryOptions: {preload: true},
    query: SINGLE_LINE_QUERY,
  });

  // Shopify analytics
  useServerAnalytics({
    shopify: {pageType: ShopifyAnalyticsConstants.pageType.home},
  });

  if (error) {
    return (
      <div>
        {QUERY_SANITY}
        <hr />
        {SINGLE_LINE_QUERY}
        <hr />
        Error
        {error.message}
      </div>
    );
  }

  // if (!sanityHome) {
  //   // @ts-expect-error <NotFound> doesn't require response
  //   return <NotFound />;
  // }

  return (
    <Layout clean>
      {data?.modules && <ModuleGrid items={data.modules} />}
      <Seo
        data={{
          seo: {
            description: data.seo.description,
            title: data.seo.title,
          },
        }}
        type="page" // Note the usage of `page` instead of `homepage` to ensure the default title template comes through
      />
    </Layout>
  );
}
