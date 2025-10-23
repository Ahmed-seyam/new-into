import {type LoaderFunctionArgs, type MetaFunction} from 'react-router';
import {
  Meta,
  Links,
  Outlet,
  ScrollRestoration,
  Scripts,
  useRouteError,
  isRouteErrorResponse,
  type LinksFunction,
  useLoaderData,
} from 'react-router';
import {ShopifyProvider} from '@shopify/hydrogen-react';

import appStyles from '~/styles/app.css?url';
import Newsletter from '~/components/global/Newsletter';
import FilterUIProvider from '~/components/filter/FilterUIProvider';
import NotFound from '~/components/global/NotFound';
import SearchUIProvider from '~/components/search/SearchUIProvider';
import {CartProvider} from '~/contexts/CartContext';
import {sanityFetch} from '~/lib/sanity';
import groq from 'groq';
import {getSeoDefaults} from './components/DefaultSeo.server';

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: appStyles},
  {rel: 'preconnect', href: 'https://cdn.shopify.com'},
  {
    rel: 'stylesheet',
    href: 'https://assets.calendly.com/assets/external/widget.css',
  },
];

type LoaderData = {
  seoDefaults: {
    title: string;
    description?: string;
  };
  sanityData: {
    header: {
      collections: Array<{title: string}>;
    };
    footer: {
      footer: {
        links?: any[];
        text?: any[];
      };
      collections?: Array<{title: string}>;
    };
  };
  env: {
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PUBLIC_STOREFRONT_API_VERSION: string;
  };
};

export async function loader() {
  // Get SEO defaults from Sanity
  const seoDefaults: any = await getSeoDefaults();

  // Get header and footer data from Sanity
  const sanityData = await sanityFetch<{
    header: {
      collections: Array<{title: string}>;
    };
    footer: {
      footer: {
        links?: any[];
        text?: any[];
      };
      collections?: Array<{title: string}>;
    };
  }>(SANITY_DATA_QUERY);

  return Response.json({
    seoDefaults,
    sanityData,
    env: {
      PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN || '',
      PUBLIC_STOREFRONT_API_TOKEN:
        process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
      PUBLIC_STOREFRONT_API_VERSION:
        process.env.PUBLIC_STOREFRONT_API_VERSION || '2024-01',
    },
  });
}

export const meta: MetaFunction<typeof loader> = ({data}: any) => {
  return [
    {title: data?.seoDefaults?.title || 'INTO Archive'},
    {
      name: 'description',
      content: data?.seoDefaults?.description || '',
    },
  ];
};

export default function App() {
  const {env} = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <script
          src="https://assets.calendly.com/assets/external/widget.js"
          async
        />
        <Meta />
        <Links />
      </head>
      <body>
        <ShopifyProvider
          storeDomain={env.PUBLIC_STORE_DOMAIN}
          storefrontToken={env.PUBLIC_STOREFRONT_API_TOKEN}
          storefrontApiVersion={env.PUBLIC_STOREFRONT_API_VERSION}
          countryIsoCode="US"
          languageIsoCode="EN"
        >
          <CartProvider>
            <SearchUIProvider>
              <FilterUIProvider>
                <Outlet />
                <Newsletter />
              </FilterUIProvider>
            </SearchUIProvider>
          </CartProvider>
        </ShopifyProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const NotFoundPage = (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NotFound />
        <Scripts />
      </body>
    </html>
  );

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return NotFoundPage;

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <div className="container min-h-screen pt-12">
            <h1>Error {error.status}</h1>
            <p>{error.statusText}</p>
            {error.data && <pre>{JSON.stringify(error.data, null, 2)}</pre>}
          </div>
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="container min-h-screen pt-12">
          <h1>Unexpected Error</h1>
          <p>Something went wrong. Please try again later.</p>
          {process.env.NODE_ENV === 'development' && error instanceof Error && (
            <pre>{error.stack}</pre>
          )}
        </div>
        <Scripts />
      </body>
    </html>
  );
}

const SANITY_DATA_QUERY = groq`{
  "header": {
    "collections": *[_type=="collection" && store.title match "* - All" && store.title != "All" && (store.title match "*Rentals*" == false)]{
      "title": store.title
    }
  },
  "footer": {
    "footer": *[_type == 'settings'][0].footer {
      links[] {
        _key,
        _type,
        title,
        url,
        newWindow,
        slug
      },
      text[]
    },
    "collections": *[_type=="collection" && store.title match "* - All" && store.title != "All" && (store.title match "*Rentals*" == false)]{
      "title": store.title
    }
  }
}`;
