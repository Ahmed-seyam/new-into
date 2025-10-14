import {Link} from '@shopify/hydrogen';

import Cart from '../cart/Cart.client';
import CartToggle from '../cart/CartToggle.client';
// import CartIcon from '../icons/Cart';
// import MenuIcon from '../icons/Menu';
// import SearchIcon from '../icons/Search';
import SearchToggle from '../search/SearchToggle.client';
import SearchInput from '../search/SearchInput.client';
// import FilterToggle from '../filter/FilterToggle.client';

export default function HeaderActions() {
  return (
    <>
      <div className="right-0 flex h-full items-center gap-4 md:absolute md:mr-6">
        {/* Search */}
        <SearchToggle />
        <Link
          className="hidden hover:text-theme md:inline"
          to={'locations/newyork'}
          rel="noopener noreferrer"
        >
          Appointments
        </Link>
        {/* <button aria-label="search">
          <span className="hidden md:inline">Search</span>
          <span className="inline md:hidden">
            <SearchIcon />
          </span>
        </button> */}
        {/* Account */}
        <Link className="hidden hover:text-theme md:inline" to="/account">
          Account
        </Link>
        {/* Wishlist */}
        {/* <button aria-label="wishlist" className="hidden md:block">
          Wishlist
        </button> */}
        {/* Cart */}
        <CartToggle />
      </div>
      {/* Cart Widget */}
      <Cart />
      <SearchInput />
    </>
  );
}
