import {Link, useRouteLoaderData} from 'react-router';
import LogoIcon from '~/components/icons/Logo';
import type {SanityMenuLink} from '~/types';
import HeaderActions from './HeaderActions';
import MobileNavigation from './MobileNavigation';
import Navigation from './Navigation';

type Props = {
  menuLinks?: SanityMenuLink[];
};

export interface CollectionTitle {
  title: string;
}

export default function Header({menuLinks}: Props) {
  const rootData = useRouteLoaderData<any>('root');
  const collections = rootData?.sanityData?.header?.collections || [];

  return (
    <header
      className="container fixed top-0 z-40 flex h-12 w-full bg-white"
      role="banner"
    >
      <div className="md:flex-start flex h-full w-full items-center justify-between">
        {menuLinks && (
          <Navigation menuLinks={menuLinks} collectionTitles={collections} />
        )}
        <div className="top-0 py-3 md:absolute md:left-1/2 md:-translate-x-1/2 md:transform">
          <Link to="/" aria-label="INTO" prefetch="intent">
            <LogoIcon />
          </Link>
        </div>
        <div className="flex items-center">
          <HeaderActions />
          {menuLinks && (
            <MobileNavigation
              menuLinks={menuLinks}
              collectionTitles={collections}
            />
          )}
        </div>
      </div>
    </header>
  );
}
