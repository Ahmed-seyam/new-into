import {Link} from 'react-router';
import Cart from '../icons/Cart';
import CartToggle from '../cart/CartToggle';
import SearchToggle from '../search/SearchToggle';
import SearchInput from '../search/SearchInput';

export default function HeaderActions() {
  return (
    <>
      <div className="right-0 flex h-full items-center gap-4 md:absolute md:mr-6">
        <SearchToggle onClick={() => {}} />
        <Link
          className="hidden hover:text-theme md:inline"
          to="locations/newyork"
          rel="noopener noreferrer"
          prefetch="intent"
        >
          Appointments
        </Link>
        <Link
          className="hidden hover:text-theme md:inline"
          to="/account"
          prefetch="intent"
        >
          Account
        </Link>
        <CartToggle />
      </div>
      <Cart />
      <SearchInput />
    </>
  );
}
