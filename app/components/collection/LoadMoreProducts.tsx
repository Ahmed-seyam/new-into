import {useState} from 'react';
import {COLLECTION_PAGE_SIZE} from '../../constants';
import SpinnerIcon from '../icons/Spinner';

type Props = {
  startingCount: number;
  onLoadMore: (count: number) => Promise<void>;
};

export default function LoadMoreProducts({startingCount, onLoadMore}: Props) {
  const [count, setCount] = useState(startingCount);
  const [loading, setLoading] = useState(false);

  async function handleLoadMore() {
    setLoading(true);
    const newCount = count + COLLECTION_PAGE_SIZE;
    await onLoadMore(newCount);
    setCount(newCount);
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center py-24">
      {loading ? (
        <SpinnerIcon />
      ) : (
        <button
          className="btn-tertiary"
          disabled={loading}
          onClick={() => handleLoadMore}
          type="button"
        >
          Load more
        </button>
      )}
    </div>
  );
}
