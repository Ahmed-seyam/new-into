'use client';
import {useSortBy} from 'react-instantsearch';
import {Transition, Menu, MenuItem, MenuItems} from '@headlessui/react';
import clsx from 'clsx';
import {Fragment} from 'react';
import algoConfig from ',/../../algolia.config.json';

const sortByMenuLinks = [
  {
    label: 'Featured',
    value: algoConfig.prefix + 'products',
  },
  // Alphabetically
  {
    label: 'Alphabetically (A-Z)',
    value: algoConfig.prefix + 'products_alphabetical_asc',
  },
  {
    label: 'Alphabetically (Z-A)',
    value: algoConfig.prefix + 'products_alphabetical_desc',
  },
  // Price
  {
    label: 'Price (low to high)',
    value: algoConfig.prefix + 'products_price_asc',
  },
  {
    label: 'Price (high to low)',
    value: algoConfig.prefix + 'products_price_desc',
  },
  // Date
  {
    label: 'Date (old to new)',
    value: algoConfig.prefix + 'products_date_asc',
  },
  {
    label: 'Date (new to old)',
    value: algoConfig.prefix + 'products_published_at_desc',
  },
];

export default function SortBy() {
  const {currentRefinement, options, refine} = useSortBy({
    items: sortByMenuLinks,
  });

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const value = e.currentTarget.getAttribute('data-value');
    if (value) {
      refine(value);
    }
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        {({open}) => (
          <>
            <Menu.Button className="btn-tertiary">Sort</Menu.Button>
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform opacity-0"
            >
              <MenuItems
                static
                className="shadow-lg absolute right-0 mt-2 w-56 origin-top-right divide-y divide-darkGray rounded-md bg-gray px-4 ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                {options?.map((link) => (
                  <MenuItem key={link.value} as={Fragment}>
                    {({close}) => (
                      <button
                        className="flex cursor-pointer items-center gap-2 py-3 hover:underline w-full text-left"
                        data-value={link.value}
                        onClick={onClick}
                      >
                        <div
                          className={clsx(
                            'h-4 w-4 flex-grow-0 rounded-xs border',
                            currentRefinement === link.value && 'bg-black',
                          )}
                        ></div>
                        <div className="flex-1">{link.label}</div>
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </>
        )}
      </Menu>
    </>
  );
}
