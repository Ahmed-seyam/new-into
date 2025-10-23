import groq from 'groq';
import {useLoaderData} from 'react-router';
import {mergeSeo} from '~/components/DefaultSeo.server';

import Layout from '~/components/global/Layout';
import PortableText from '~/components/portableText/PortableText.client';
import {PAGE} from '~/fragments/sanity/pages/page';
import {sanityFetch} from '~/lib/sanity';
import {SanityPage} from '~/types';

export async function loader({params}) {
  const {handle} = params;

  const page = await sanityFetch<SanityPage>(QUERY_SANITY, {
    slug: handle,
  });

  if (!page) {
    throw new Response('Page Not Found', {status: 404});
  }

  return Response.json({page});
}

export const meta = ({data, matches}) => {
  if (!data?.page) {
    return [
      {title: 'Page Not Found'},
      {
        name: 'description',
        content: 'The page you are looking for does not exist.',
      },
    ];
  }

  // Get SEO defaults from root loader
  const rootData = matches.find((match) => match.id === 'root')?.data;
  const seoDefaults = rootData?.seoDefaults;

  const seo = mergeSeo(seoDefaults, {
    title: data.page.seo?.title || data.page.title,
    description: data.page.seo?.description,
  });

  return [
    {title: seo.title},
    {name: 'description', content: seo.description || ''},
    {property: 'og:title', content: data.page.title},
    {property: 'og:description', content: seo.description || ''},
    {property: 'og:type', content: 'website'},
  ];
};

export default function PageRoute() {
  const {page} = useLoaderData();

  return (
    <Layout>
      <div className="container">
        <h1>{page.title}</h1>
        <br />
        {/* Body */}
        <div className="rte md:max-w-xl">
          {page.body && <PortableText blocks={page.body} />}
        </div>
      </div>
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
