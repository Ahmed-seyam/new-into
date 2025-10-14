import clsx from 'clsx';
import {Fragment} from 'react';
import {ClearRefinements} from 'react-instantsearch-hooks-web';
// @ts-expect-error incompatibility with node16 resolution
import {Dialog, Transition} from '@headlessui/react';

import CloseIcon from '../icons/Close';
import {useFilterUI} from './FilterUIProvider.client';

/**
 * A client component that contains the merchandise that a customer intends to purchase, and the estimated cost associated with the cart
 */

export default function FilterDialog({children, filtersLength = 0}: any) {
  const {isFilterOpen, closeFilter} = useFilterUI();

  return (
    <Transition show={isFilterOpen} unmount={false}>
      <Dialog unmount={false} onClose={closeFilter}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          unmount={false}
        >
          <div
            aria-hidden="true"
            className="  fixed inset-0 z-40 bg-white bg-opacity-50"
          />
        </Transition.Child>

        {/* Panel */}
        <Transition.Child
          unmount={false}
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom=" -translate-y-full "
          enterTo=" translate-y-0"
          leave="ease-in-out duration-500"
          leaveFrom=" -translate-y-full  "
          leaveTo="-translate-y-full  "
        >
          <div className="fixed inset-0 z-40 overflow-y-auto">
            <Dialog.Panel
              className={clsx(
                'fixed bottom-0 left-0 right-0 top-0 z-40 flex h-auto w-full flex-col overflow-y-auto rounded-md md:bottom-auto md:left-auto md:mt-12',
                '',
              )}
            >
              <div className="relative mb-24 rounded-md border border-gray bg-white backdrop-blur-md md:mx-6 md:bg-opacity-70">
                <div className="container flex flex-col justify-between">
                  <FilterHeader />
                  <div className="md:mb-4">{children}</div>
                  <FilterFooter filtersLength={filtersLength} />
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

function FilterHeader() {
  const {closeFilter} = useFilterUI();
  return (
    <div className=" flex items-center justify-between py-4">
      <h4>Filter </h4>
      <button type="button" onClick={closeFilter}>
        <CloseIcon />
      </button>
    </div>
  );
}

function FilterFooter(_props: {filtersLength: number}) {
  const {closeFilter} = useFilterUI();

  return (
    <div className="mobile-filter-actions sticky bottom-0 flex gap-3 bg-white pb-4 pt-4 md:ml-auto md:w-1/3 md:bg-transparent">
      <ClearRefinements
        className="flex-1"
        translations={{
          resetButtonText: 'Clear',
        }}
      />

      <button
        onClick={closeFilter}
        className={clsx('btn-primary flex-1 p-0', 'active:bg-neutral-800')}
      >
        Confirm
      </button>
    </div>
  );
}
