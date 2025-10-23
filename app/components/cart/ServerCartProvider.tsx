import {useRouteLoaderData} from 'react-router';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';
import {ReactNode} from 'react';
import LocalCartProvider from './LocalCartProvider';

type Props = {
  children: ReactNode;
};

export default function ServerCartProvider({children}: Props) {
  const rootData = useRouteLoaderData<any>('root');
  const countryCode = rootData?.selectedLocale?.country?.isoCode as CountryCode;

  return (
    <LocalCartProvider countryCode={countryCode}>{children}</LocalCartProvider>
  );
}
