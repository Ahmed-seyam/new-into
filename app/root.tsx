import { type MetaFunction } from 'react-router';
import {
  Meta,
  Links,
  Outlet,
  ScrollRestoration,
  Scripts,
  useRouteError,
  isRouteErrorResponse,
  type LinksFunction,
} from 'react-router';
import { CartProvider, ShopifyProvider } from '@shopify/hydrogen-react';


import appStyles from '~/styles/app.css?url';
import resetStyles from '~/styles/reset.css?url';
import fontStyles from '~/styles/custom-font.css?url';
import themeStyles from '~/styles/theme.css?url';
// import NotFound from '~/components/global/NotFound';
import { sanityFetch } from '~/lib/sanity';
import groq from 'groq';
import { getSeoDefaults } from './components/DefaultSeo.server';
import Newsletter from './components/global/Newsletter';
import FilterUIProvider from './components/filter/FilterUIProvider';
import SearchUIProvider from './components/search/SearchUIProvider';
import Layout from './components/global/Layout';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: appStyles },
  { rel: 'stylesheet', href: resetStyles },
  { rel: 'stylesheet', href: fontStyles },
  { rel: 'stylesheet', href: themeStyles },
  { rel: 'preconnect', href: 'https://cdn.shopify.com' },
  {
    rel: 'stylesheet',
    href: 'https://assets.calendly.com/assets/external/widget.css',
  },
];


export async function loader() {
  // Get SEO defaults from Sanity
  const seoDefaults: any = await getSeoDefaults();

  // Get header and footer data from Sanity
  const sanityData = await sanityFetch<{
    header: {
      collections: Array<{ title: string }>;
    };
    footer: {
      footer: {
        links?: any[];
        text?: any[];
      };
      collections?: Array<{ title: string }>;
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

export const meta: MetaFunction<typeof loader> = ({ data }: any) => {
  return [
    { title: data?.seoDefaults?.title || 'INTO Archive' },
    {
      name: 'description',
      content: data?.seoDefaults?.description || '',
    },
  ];
};

export default function App() {
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


        <SearchUIProvider>
          <ShopifyProvider
            storeDomain={import.meta.env.VITE_PUBLIC_STORE_DOMAIN}
            storefrontToken={import.meta.env.VITE_PUBLIC_STOREFRONT_API_TOKEN}
            storefrontApiVersion={import.meta.env.VITE_PUBLIC_STOREFRONT_API_VERSION}
            countryIsoCode="US"
            languageIsoCode="EN"
          >
            <CartProvider>
              <Layout>
                <FilterUIProvider>
                  <Outlet />
                  <Newsletter />
                </FilterUIProvider>
              </Layout>
            </CartProvider>

          </ShopifyProvider>
        </SearchUIProvider>


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
        {/* <NotFound /> */}
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
