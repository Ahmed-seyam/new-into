// app/routes/_index.tsx
import groq from 'groq';
import {LoaderFunctionArgs, MetaFunction, useLoaderData} from 'react-router';

import {HOME_PAGE} from '../fragments/sanity/pages/home';
import type {SanityHomePage} from '../types';
import ModuleGrid from '~/components/modules/ModuleGrid';
import {sanityFetch} from '~/lib/sanity';
import Layout from '~/components/global/Layout';

const QUERY_SANITY = groq`
  *[_type == 'home'][0]{
    ${HOME_PAGE}
  }
`;

export const meta: MetaFunction<typeof loader> = ({data}: any) => {
  return [
    {title: data?.seo?.title || 'Home'},
    {name: 'description', content: data?.seo?.description || ''},
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const SINGLE_LINE_QUERY = QUERY_SANITY.replace(/\n/g, ' ');

  const data = await sanityFetch<SanityHomePage>(SINGLE_LINE_QUERY);

  if (!data) {
    throw new Response('Not Found', {status: 404});
  }

  return Response.json({
    data,
    seo: data.seo,
  });
}

export default function IndexRoute() {
  const {data}: any = useLoaderData<typeof loader>();

  return (
    <Layout clean>
      {data?.modules && <ModuleGrid items={data.modules} />}
    </Layout>
  );
}
