import groq from 'groq';

import {HydrogenRouteProps, Seo} from '@shopify/hydrogen';

import EditorialImage from '../../components/editorial/EditorialImage.client';
import Slideshow from '../../components/elements/Slideshow.client';
import Layout from '../../components/global/Layout.server';
import NotFound from '../../components/global/NotFound.server';
import PortableText from '../../components/portableText/PortableText.server';
import {EDITORIAL} from '../../fragments/sanity/pages/editorial';
import useSanityQuery from '../../hooks/useSanityQuery';

import type {SanityPage} from '../../types';
// This demo doesn't use Shopify Online Store pages.
// For this reason we don't use Shopify Analytics here.
export default function EditorialPageRoute({params}: HydrogenRouteProps) {
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
    <Layout clean>
      <Slideshow
        fullscreen={true}
        slideshowProps={{
          // align: 'center',
          draggable: true,
          loop: true,
          skipSnaps: false,
          slidesToScroll: 1,
          speed: 20,
          dragFree: false,
          active: true,
          breakpoints: {
            '(min-width: 768px)': {slidesToScroll: 1},
          },
        }}
        items={sanityPage.images?.map((image) => (
          <EditorialImage key={image._key} fullscreen editorialImage={image} />
        ))}
      />
      <div className="container pt-6 sm:max-w-md md:pt-0">
        <h1>{sanityPage.title}</h1>
        <br />
        {sanityPage.body && <PortableText blocks={sanityPage.body} />}
        <br />
        {sanityPage.credits && <PortableText blocks={sanityPage.credits} />}
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
    _type == 'article'
    && slug.current == $slug
  ][0]{
    ${EDITORIAL}
  }
`;
