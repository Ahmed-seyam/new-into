import {useSortBy} from 'react-instantsearch-hooks-web';
import {Transition, Menu} from '@headlessui/react';
import clsx from 'clsx';
import algoConfig from '../../../algolia.config.json';
import {Fragment} from 'react';
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

  const onClick = (e) => {
    e.preventDefault();
    refine(e.currentTarget.getAttribute('data-value'));
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
              <Menu.Items
                static
                className=" shadow-lg absolute right-0 mt-2 w-56 origin-top-right divide-y divide-darkGray rounded-md bg-gray px-4 ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                {options?.map((link) => (
                  <Menu.Item
                    className="flex cursor-pointer items-center gap-2 py-3 hover:underline"
                    key={link.value}
                    as={Fragment}
                    data-value={link.value}
                    onClick={onClick}
                  >
                    {() => (
                      <div className="flex items-center justify-center gap-1">
                        <div
                          className={clsx(
                            'h-4 w-4 flex-grow-0 rounded-xs border',
                            currentRefinement === link.value && 'bg-black',
                          )}
                        ></div>

                        <div className="flex-1">{link.label}</div>
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </>
  );
}
