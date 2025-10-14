import {Suspense} from 'react';

import {CacheLong, fetchSync} from '@shopify/hydrogen';

export default function Wishlist() {
  return (
    <Suspense fallback="Loading...">
      <MyThings />
    </Suspense>
  );
}
function MyThings() {
  const things = fetchSync(
    'https://prod-api.wishlist.plutocracy.io/api/wishlist/event/c57f7a46-2405-42b0-9907-036fa25b96ee',
    {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        eventType: 'wishlist/add',
        event: {
          id: 'gid://shopify/Product/7803341144276',
          productObject: {
            productId: 'gid://shopify/Product/7803341144276',
            productHandle: 'alaia-90s-black-knit-dress',
            price: 0,
          },
          anything:
            'put whatever you want here. Set arbitrary property names, any values',
          priceInstructions:
            'To include the price in wishlist analytics, include the price in cents',
        },
        meta: {
          anything:
            'put whatever you want here. Set arbitrary property names, any values',
        },
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      // preload: true,
      // cache: CacheLong(),
    },
  ).json();

  return <h2>wishlist loaded</h2>;
}
