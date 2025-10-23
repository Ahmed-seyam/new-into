import {useStats} from 'react-instantsearch';

export default function Stats() {
  const {hitsPerPage, nbPages, page, nbHits} = useStats();

  const shownProducts = hitsPerPage * (page + 1);
  const totalProducts = nbHits;
  
  return (
    <div className="text-center">
      {shownProducts}/{totalProducts} items
    </div>
  );
}