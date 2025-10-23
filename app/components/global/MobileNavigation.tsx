import clsx from 'clsx';
import {Fragment, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {Link} from 'react-router';
import CloseIcon from '~/components/icons/Close';
import MenuIcon from '~/components/icons/Menu';
import type {SanityMenuLink} from '~/types';
import DropdownLinkMobile from '~/components/dropdown/DropdownLinkMobile';
import {navigationDropdowns} from '~/components/dropdown/navigationDropdown';
import {CollectionTitle} from '~/components/global/Header';

type Props = {
  menuLinks: SanityMenuLink[];
  collectionTitles?: CollectionTitle[];
};

export default function MobileNavigation({menuLinks, collectionTitles}: Props) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <div className="block md:hidden">
      <button
        className={clsx(
          'flex h-header-sm items-center p-4 text-sm font-bold duration-200',
          'hover:opacity-50',
          'md:ml-4',
          'lg:hidden',
        )}
        aria-label="menu"
        onClick={handleOpen}
      >
        <MenuIcon />
      </button>
      <Transition show={open}>
        <Dialog onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-40 bg-black bg-opacity-90"
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Panel
              style={{
                backdropFilter: 'blur(5px)',
                backgroundColor: 'rgba(37, 130, 79, .6)',
              }}
              className="fixed bottom-0 left-0 right-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center overflow-y-auto text-white"
            >
              <header className="fixed right-0 top-0 flex h-12 justify-center px-4">
                <button className="ml-auto" type="button" onClick={handleClose}>
                  <CloseIcon fill={'#ffffff'} />
                </button>
              </header>
              <div className="flex w-full flex-col justify-between gap-6 overflow-auto py-6 pl-18">
                <Link
                  className="linkTextNavigation"
                  onClick={handleClose}
                  to="/collections/all"
                  prefetch="intent"
                >
                  Shop All
                </Link>
                <DropdownLinkMobile
                  dropdownItem={navigationDropdowns.shopDropdown}
                />
                {collectionTitles && (
                  <DropdownLinkMobile
                    dropdownItem={navigationDropdowns.brandDropdown(
                      collectionTitles,
                    )}
                  />
                )}
                <Link
                  className="linkTextNavigation"
                  onClick={handleClose}
                  to="/editorials"
                  prefetch="intent"
                >
                  Editorials
                </Link>
                <Link
                  className="linkTextNavigation"
                  onClick={handleClose}
                  to="/collections/rentals"
                  prefetch="intent"
                >
                  Rentals
                </Link>
                <Link
                  onClick={handleClose}
                  to="locations/newyork"
                  prefetch="intent"
                >
                  Appointments
                </Link>
                <Link onClick={handleClose} to="/account" prefetch="intent">
                  Account
                </Link>
                <Link onClick={handleClose} to="/pages/about" prefetch="intent">
                  About
                </Link>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
}
