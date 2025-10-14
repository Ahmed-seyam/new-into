import connectStats from 'instantsearch.js/es/connectors/stats/connectStats';

import {useConnector} from 'react-instantsearch-hooks-web';
function useStats(props) {
  return useConnector(connectStats, props);
}

export default function Stats(props) {
  const {hitsPerPage, nbPages, page, nbHits} = useStats(props);
  // const data = useStats(props);
  // console.log(data);

  const shownProducts = hitsPerPage * (page + 1);
  const totalProducts = nbHits;
  return (
    <div className="text-center">
      {shownProducts}/{totalProducts} items
    </div>
  );
}
