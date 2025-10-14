import {Image} from '@shopify/hydrogen';
import {imageLoader} from '../../utils/search/imageLoader';
import {getBlendMode} from '../../utils/getBlendMode';
import {Highlight} from 'react-instantsearch-hooks-web';
export default function Hit({hit, sendEvent}) {
  return (
    <article className="">
      <a
        href={'/products/' + hit.id}
        onClick={() => {
          // Using insights hook to send event
          sendEvent('click', hit, 'PLP - Product Clicked');
        }}
      >
        <header
          className="relative overflow-hidden rounded-md"
          style={{backgroundColor: '#F6F6F6'}}
        >
          {hit.image ? (
            <Image
              // data={hit.image}
              loader={imageLoader}
              src={hit.image}
              srcSet={`${hit.image}?w=375&h=562.5 375w, ${hit.image}?w=600&h=900 600w, ${hit.image}?w=800&h=1200 800w`}
              alt={hit.title}
              width="600"
              height="900"
              className="hit-image aspect-[3/4]"
              style={{
                backgroundColor: '#F6F6F6',
                mixBlendMode: getBlendMode(hit),
              }}
            />
          ) : (
            <div className="hit-image aspect-[3/4] bg-gray"></div>
          )}
        </header>
        <div>
          <p className="mb-1 mt-4 text-xxs font-bold">{hit.vendor}</p>

          <Highlight attribute="title" hit={hit} />

          {hit.price > 0 && (
            <footer>
              {hit.inventory_available ? (
                <p>${hit.price}</p>
              ) : (
                <p>
                  <s>${hit.price}</s> Sold out
                </p>
              )}
            </footer>
          )}
        </div>
      </a>
    </article>
  );
}
