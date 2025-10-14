import {Link} from '@shopify/hydrogen';

import LogoIcon from '../icons/Logo';
import HeaderActions from './HeaderActions.client';
import MobileNavigation from './MobileNavigation.client';
import Navigation from './Navigation.client';

import type {SanityMenuLink} from '../../types';
import useSanityQuery from '../../hooks/useSanityQuery';
import groq from 'groq';

type Props = {
  menuLinks?: SanityMenuLink[];
};

export interface CollectionTitle {
  title: string;
}

/**
 * A server component that specifies the content of the header on the website
 */

export default function Header({menuLinks}: Props) {
  const {data: footer} = useSanityQuery<{
    collections: CollectionTitle[];
  }>({query: QUERY_SANITY});

  return (
    <header
      className="container fixed top-0 z-40 flex h-12 w-full bg-white"
      role="banner"
    >
      <div className="md:flex-start flex h-full w-full items-center justify-between">
        {menuLinks && (
          <Navigation
            menuLinks={menuLinks}
            collectionTitles={footer?.collections}
          />
        )}
        {/* Logo */}
        <div className="top-0 py-3 md:absolute md:left-1/2 md:-translate-x-1/2 md:transform">
          <Link to="/" aria-label="INTO">
            <LogoIcon />
          </Link>
        </div>
        {/* Accounts + cart toggle */}
        <div className="flex items-center">
          <HeaderActions />
          {menuLinks && (
            <MobileNavigation
              menuLinks={menuLinks}
              collectionTitles={footer?.collections}
            />
          )}
        </div>
      </div>
    </header>
  );
}

const QUERY_SANITY = groq`{
  "collections": *[_type=="collection" && store.title match "* - All" && store.title != "All" && (store.title match "*Rentals*" == false)]{
    "title": store.title
  }
}
`;
