import clsx from 'clsx';
import {ReactNode, Suspense} from 'react';

import {
  CacheNone,
  gql,
  HydrogenRouteProps,
  Seo,
  type,
  useLocalization,
  useSession,
  useShopQuery,
} from '@shopify/hydrogen';

import AccountAddressBook from '../../components/account/AddressBook.client';
import LogoutButton from '../../components/account/LogoutButton.client';
import AccountOrderHistory from '../../components/account/OrderHistory.client';
import AccountProfile from '../../components/account/Profile.client';
import Layout from '../../components/global/Layout.server';

import type {CustomerWithNodes} from '../../types';
export default function Account({response}: HydrogenRouteProps) {
  response.cache(CacheNone());

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();
  const {customerAccessToken} = useSession();

  // Redirect to login if no custom access token found
  if (!customerAccessToken) return response.redirect('/account/login');

  // Fetch customer data
  const {data} = useShopQuery<{
    customer: CustomerWithNodes;
  }>({
    query: QUERY_SHOPIFY_CUSTOMER,
    variables: {
      country: countryCode,
      customerAccessToken,
      language: languageCode,
    },
    cache: CacheNone(),
  });

  const {customer} = data;

  // Redirect to login if no customer found
  if (!customer) return response.redirect('/account/login');

  const addresses = customer.addresses.nodes.map((address) => ({
    ...address,
    id: address?.id?.substring(0, address?.id?.lastIndexOf('?')),
    originalId: address.id,
  }));

  const defaultAddressGid = customer?.defaultAddress?.id?.substring(
    0,
    customer.defaultAddress.id.lastIndexOf('?'),
  );

  const orders = customer?.orders?.nodes || [];

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}.`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{title: 'Account details'}} />
      </Suspense>
      <div className="mx-auto max-w-lg divide-y divide-gray">
        <AccountSection>
          <div>Account</div>
          <h1>{heading}</h1>
          <br />
          <LogoutButton />
        </AccountSection>
        <AccountSection>
          <AccountOrderHistory orders={orders} />
        </AccountSection>
        <AccountSection>
          <AccountProfile
            email={customer.email as string}
            firstName={customer.firstName as string}
            lastName={customer.lastName as string}
            phone={customer.phone as string}
          />
        </AccountSection>
        <AccountSection>
          <AccountAddressBook
            addresses={addresses}
            defaultAddressGid={defaultAddressGid}
          />
        </AccountSection>
      </div>
    </Layout>
  );
}

const AccountSection = ({children}: {children: ReactNode}) => {
  return (
    <div>
      <div className={'mx-auto grid w-full py-8'}>{children}</div>
    </div>
  );
};

const QUERY_SHOPIFY_CUSTOMER = gql`
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      addresses(first: 6) {
        nodes {
          address1
          address2
          city
          company
          country
          firstName
          formatted
          id
          lastName
          phone
          province
          zip
        }
      }
      defaultAddress {
        formatted
        id
      }
      email
      firstName
      lastName
      orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          currentTotalPrice {
            amount
            currencyCode
          }
          financialStatus
          fulfillmentStatus
          id
          lineItems(first: 2) {
            nodes {
              variant {
                image {
                  altText
                  height
                  url
                  width
                }
              }
              title
            }
          }
          orderNumber
          processedAt
        }
      }
      phone
    }
  }
`;
