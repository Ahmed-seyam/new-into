import {useUrl, useQuery} from '@shopify/hydrogen';

import Layout from '../components/global/Layout.server';
import {getServerState} from 'react-instantsearch-hooks-server';
import {SearchPage} from '../components/search/SearchPage.client';

type ShopifyPayload = {
  collection: Collection;
};

export default function SearchRoute({params}) {
  const {href} = useUrl();

  const {serverState} = useQuery(href, async () => {
    getServerState(<SearchPage serverUrl={href} />, {renderToString});
  });

  return (
    <Layout>
      {/* <h1>{handle}</h1> */}
      <SearchPage serverState={serverState} serverUrl={href}></SearchPage>
    </Layout>
  );
}
