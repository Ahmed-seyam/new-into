'use client';
import clsx from 'clsx';
import {Suspense, useMemo, useState} from 'react';
import {Listbox} from '@headlessui/react';
import {ChevronDownIcon} from '../icons/ChevronDown';
import RadioIcon from '../icons/Radio';
import SpinnerIcon from '../icons/Spinner';

type SortOption = {
  collectionSortOrder: string;
  name: string;
  productSort: {
    key?: string;
    reverse?: boolean;
  };
};

export const SORT_OPTIONS: SortOption[] = [
  {name: 'Default', collectionSortOrder: 'MANUAL', productSort: {}},
  {
    name: 'Price (low to high)',
    collectionSortOrder: 'PRICE_ASC',
    productSort: {key: 'PRICE', reverse: false},
  },
  {
    name: 'Price (high to low)',
    collectionSortOrder: 'PRICE_DESC',
    productSort: {key: 'PRICE', reverse: true},
  },
  {
    name: 'Title (A to Z)',
    collectionSortOrder: 'ALPHA_ASC',
    productSort: {key: 'TITLE', reverse: false},
  },
  {
    name: 'Title (Z to A)',
    collectionSortOrder: 'ALPHA_DESC',
    productSort: {key: 'TITLE', reverse: true},
  },
  {
    name: 'New arrivals',
    collectionSortOrder: 'CREATED',
    productSort: {key: 'CREATED', reverse: false},
  },
];

type Props = {
  initialSortOrder: string;
  onSortChange: (sort: SortOption['productSort']) => void;
};

export default function SortOrderSelect({
  initialSortOrder,
  onSortChange,
}: Props) {
  const sortOptions = useMemo(() => {
    return initialSortOrder === 'MANUAL'
      ? SORT_OPTIONS
      : SORT_OPTIONS.filter((o) => o.collectionSortOrder !== 'MANUAL');
  }, [initialSortOrder]);

  const [listboxOpen, setListboxOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(
    sortOptions.find((o) => o.collectionSortOrder === initialSortOrder) ??
      sortOptions[0],
  );

  const handleChange = (sortOption: SortOption) => {
    setSelectedSortOption(sortOption);
    onSortChange(sortOption.productSort);
  };

  return (
    <Listbox onChange={handleChange} value={selectedSortOption}>
      {({open}: {open: boolean}) => {
        setTimeout(() => setListboxOpen(open));
        return (
          <div className="relative inline-flex">
            <Listbox.Button className="select">
              <span className="mr-2">Sort by: {selectedSortOption?.name}</span>
              <ChevronDownIcon className={open ? 'rotate-180' : 'rotate-0'} />
            </Listbox.Button>

            <Listbox.Options
              className={clsx(
                'absolute top-full left-0 right-auto z-10 mt-3 min-w-[150px] overflow-hidden rounded shadow',
                'md:left-auto md:right-0',
              )}
            >
              <div className="overflow-y-auto bg-white">
                {listboxOpen && (
                  <Suspense
                    fallback={
                      <div className="flex justify-center overflow-hidden">
                        <SpinnerIcon />
                      </div>
                    }
                  >
                    <SortOptions
                      selectedSortOption={selectedSortOption}
                      getClassName={(active) =>
                        clsx(
                          'p-3 flex justify-between items-center text-left font-bold text-sm cursor-pointer whitespace-nowrap',
                          active ? 'bg-lightGray' : null,
                        )
                      }
                      options={sortOptions}
                    />
                  </Suspense>
                )}
              </div>
            </Listbox.Options>
          </div>
        );
      }}
    </Listbox>
  );
}

export function SortOptions({
  selectedSortOption,
  getClassName,
  options,
}: {
  selectedSortOption?: SortOption;
  getClassName: (active: boolean) => string;
  options: SortOption[];
}) {
  return (
    <>
      {options.map((sortOption) => {
        const isSelected = sortOption === selectedSortOption;
        return (
          <Listbox.Option key={sortOption.name} value={sortOption}>
            {({active}: {active: boolean}) => (
              <div className={getClassName(active)}>
                <span className="mr-8">{sortOption.name}</span>
                <RadioIcon checked={isSelected} hovered={active} />
              </div>
            )}
          </Listbox.Option>
        );
      })}
    </>
  );
}
