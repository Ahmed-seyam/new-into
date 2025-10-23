import {createStorefrontClient} from '@shopify/hydrogen-react';

export const client = createStorefrontClient({
  storeDomain: import.meta.env.PUBLIC_STORE_DOMAIN!,
  storefrontApiVersion: import.meta.env.PUBLIC_STOREFRONT_API_VERSION!,
  publicStorefrontToken: import.meta.env.PUBLIC_STOREFRONT_API_TOKEN!,
});
