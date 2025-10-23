// app/routes/search.tsx
import {type LoaderFunctionArgs} from '@shopify/hydrogen';
import {useLoaderData} from 'react-router';
import Layout from '../components/global/Layout';
import {SearchPage} from '../components/search/SearchPage';

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  
  return Response.json({
    serverUrl: url.href,
  });
}

export default function SearchRoute() {
  const {serverUrl} = useLoaderData<typeof loader>();

  return (
    <Layout>
      <SearchPage serverUrl={serverUrl} />
    </Layout>
  );
}