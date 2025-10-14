import groq from 'groq';

import {HydrogenRouteProps, Seo, type} from '@shopify/hydrogen';

import Layout from '../../components/global/Layout.server';
import NotFound from '../../components/global/NotFound.server';
import PageHero from '../../components/heroes/Page.server';
import PortableText from '../../components/portableText/PortableText.server';
import {PAGE} from '../../fragments/sanity/pages/page';
import useSanityQuery from '../../hooks/useSanityQuery';

import type {SanityPage} from '../../types';
// This demo doesn't use Shopify Online Store pages.
// For this reason we don't use Shopify Analytics here.
export default function PageRoute({params}: HydrogenRouteProps) {
  const {handle} = params;
  const {data: sanityPage} = useSanityQuery<SanityPage>({
    query: QUERY_SANITY,
    params: {slug: handle},
  });

  if (!sanityPage) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  const sanitySeo = sanityPage.seo;

  return (
    <Layout>
      <h1>{sanityPage.title}</h1>
      <br />
      {/* Body */}
      <div className="rte md:max-w-xl">
        {sanityPage.body && (
          <PortableText
            blocks={sanityPage.body}
            // colorTheme={sanityPage.colorTheme}
          />
        )}
      </div>
      <Seo
        data={{
          seo: {
            description: sanitySeo.description,
            title: sanitySeo.title,
          },
        }}
        type="page"
      />
    </Layout>
  );
}
const QUERY_SANITY = groq`
  *[
    _type == 'page'
    && slug.current == $slug
  ][0]{
    ${PAGE}
  }
`;
