import {Link} from 'react-router';
import type {SanityMenuLink} from '../../types';

import DropdownLink from '../dropdown/DropdownLink';
import {navigationDropdowns} from '../dropdown/navigationDropdown';
import {CollectionTitle} from './Header';
/**
 * A server component that defines the navigation for a web storefront
 */
type Props = {
  menuLinks: SanityMenuLink[];
  collectionTitles?: CollectionTitle[];
};

export default function Navigation({menuLinks, collectionTitles}: Props) {
  const onShopClick = (e) => {
    if (window.location.pathname.includes('/collections/all')) {
      const $clearBtn = document.querySelector('.ais-ClearRefinements-button');
      if ($clearBtn) {
        $clearBtn.click();
      }
    }
  };

  return (
    <div className="hidden gap-4 md:flex">
      <Link
        className="hover:text-theme"
        onClick={onShopClick}
        to={'/collections/all'}
      >
        Shop All
      </Link>
      <DropdownLink dropdownItem={navigationDropdowns.shopDropdown} />
      {collectionTitles && (
        <DropdownLink
          dropdownItem={navigationDropdowns.brandDropdown(collectionTitles)}
        />
      )}
      <Link className="hover:text-theme" to={'/editorials'}>
        Editorials
      </Link>
      <Link className="hover:text-theme" to={'/collections/rentals'}>
        Rentals
      </Link>
    </div>
  );
}
