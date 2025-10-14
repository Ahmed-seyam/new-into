import clsx from 'clsx';
import groq from 'groq';

import {
  Link,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
} from '@shopify/hydrogen';

import EditorialImage from '../../components/editorial/EditorialImage.client';
import Layout from '../../components/global/Layout.server';
import PortableText from '../../components/portableText/PortableText.client';
import {EDITORIAL} from '../../fragments/sanity/pages/editorial';
// import HomeHero from '../components/heroes/Home.server';
// import ModuleGrid from '../components/modules/ModuleGrid.server';
// import { HOME_PAGE } from '../fragments/sanity/pages/home';
import useSanityQuery from '../../hooks/useSanityQuery';
import NotFound from '../components/global/NotFound.server';

const QUERY_SANITY = groq`
  *[_type == 'article']{
    ${EDITORIAL}
  }
`;

export default function EditorialIndexRoute() {
  const SINGLE_LINE_QUERY = QUERY_SANITY.replace(/\n/g, ' ');
  const {data, error} = useSanityQuery({
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
    <Layout>
      <EditorialIndexGrid data={data} />
      {/* {data?.modules && <ModuleGrid items={data.modules} />} */}
      <Seo
        data={{
          seo: {
            description: data?.seo?.description || '',
            title: data?.seo?.title || data.title,
          },
        }}
        type="page" // Note the usage of `page` instead of `homepage` to ensure the default title template comes through
      />
    </Layout>
  );
}

function EditorialIndexGrid({data}) {
  return (
    <div className="grid grid-flow-row gap-6 gap-y-24 ">
      {data.map((item) => (
        <div
          key={item.title}
          className="flex flex-col gap-6 sm:grid md:grid-cols-3 xl:grid-cols-4"
        >
          <div className="rte order-last md:order-first">
            <h2>{item.title}</h2>
            <br />
            {item.body && <PortableText blocks={item.body} />}
            <br />
            <div className="flex justify-center md:justify-start">
              <div className="hidden md:inline-block">
                <Link
                  className="btn-text"
                  to={`/editorials/${item.slug?.current}`}
                >
                  View Editorial
                </Link>
              </div>
              <div className="inline-block md:hidden">
                <Link
                  className="btn-secondary"
                  to={`/editorials/${item.slug?.current}`}
                >
                  View Editorial
                </Link>
              </div>
            </div>
          </div>
          {item.images?.splice(0, 3).map((image, index) => (
            <Link
              to={`/editorials/${item.slug?.current}`}
              className={clsx(
                index === 1 && 'hidden md:block',
                index === 2 && 'hidden xl:block',
              )}
            >
              <EditorialImage
                key={image._key}
                editorialImage={image}
                slug={item.slug?.current}
                cover
              />
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
