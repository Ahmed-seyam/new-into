import {useServerProps} from '@shopify/hydrogen';

import {COLLECTION_PAGE_SIZE} from '../../constants';
// import Button from '../elements/Button';
import SpinnerIcon from '../icons/Spinner';

/**
 * A client component that provides functionality to initially show a subset of products and a button to load more products
 */

type Props = {
  startingCount: number;
};

export default function LoadMoreProducts({startingCount}: Props) {
  const {pending, serverProps, setServerProps} = useServerProps();

  return (
    <div className="flex items-center justify-center py-24">
      {pending ? (
        <SpinnerIcon />
      ) : (
        <button
          className="btn-tertiary"
          disabled={pending}
          onClick={() => {
            setServerProps(
              'collectionProductCount',
              serverProps.collectionProductCount
                ? serverProps.collectionProductCount + COLLECTION_PAGE_SIZE
                : startingCount + COLLECTION_PAGE_SIZE,
            );
          }}
          type="button"
        >
          Load more
        </button>
      )}
    </div>
  );
}
