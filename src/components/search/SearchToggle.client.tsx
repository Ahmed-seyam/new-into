import SearchIcon from '../icons/Search';
import {useState} from 'react';
import algoliasearch from 'algoliasearch/lite';
// @ts-ignore
import algoConfig from '../../../algolia.config.json';
import {
  InstantSearch,
  useSearchBox,
  Hits,
  Highlight,
  useInstantSearch,
} from 'react-instantsearch-hooks-web';
import {Image} from '@shopify/hydrogen';
// @ts-ignore
import {getBlendMode} from '../../utils/getBlendMode';
import {useSearchUI} from './SearchUIProvider.client';

type Props = {
  onClick?: () => void;
};

const indexName = algoConfig.prefix + 'products';
const searchClient = algoliasearch(algoConfig.appId, algoConfig.appKey);

const imageLoader = ({src}: {src: string}) => {
  return `${src}?w=352&h=466 352w, ${src}?w=832&h=1101 832w`;
};

const Hit = ({hit, sendEvent}: {hit: any, sendEvent?: Function}) => (
  <article className="flex p-2 hover:bg-gray-50">
    <a
      href={'/products/' + hit.id}
      className="flex items-start gap-4 w-full"
      onClick={() => {
        sendEvent?.('click', hit, 'Search - Product Clicked');
      }}
    >
      <header
        className="relative w-12 flex-shrink-0 overflow-hidden rounded-md"
        style={{backgroundColor: '#F6F6F6'}}
      >
        {hit.image ? (
          <Image
            loader={imageLoader}
            src={hit.image}
            alt={hit.title}
            width="48"
            height="64"
            className="aspect-[3/4] object-cover"
            style={{
              backgroundColor: '#F6F6F6',
              mixBlendMode: getBlendMode(hit),
            }}
          />
        ) : (
          <div className="aspect-[3/4] bg-gray-200"></div>
        )}
      </header>
      <div className="flex-1 min-w-0">
        <p className="mb-1 text-xs font-bold text-gray-600">{hit.vendor}</p>
        <div className="text-sm">
          <Highlight attribute="title" hit={hit} />
        </div>
        {hit.price > 0 ? (
          <footer className="text-sm">
            {hit.inventory_available ? (
              <p className="font-semibold">${hit.price}</p>
            ) : (
              <p className="text-gray-500">
                <s>${hit.price}</s> Sold out
              </p>
            )}
          </footer>
        ) : (
          <footer className="text-sm text-gray-600">For rent</footer>
        )}
      </div>
    </a>
  </article>
);

function SearchBox({searchValue, setSearchValue, onFocus, onBlur, isActive, setIsActive}: {
  searchValue: string;
  setSearchValue: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}) {
  const {refine} = useSearchBox();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    refine(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/search?shopify_products[query]=${encodeURIComponent(searchValue)}`;
    }
  };

  const handleFocus = () => {
    setIsActive(true);
    onFocus();
  };

  const handleBlur = () => {
    setIsActive(false);
    setSearchValue('');
    refine('');
    onBlur();
  };

  const handleTextClick = () => {
    setIsActive(true);
  };

  if (!isActive && !searchValue) {
    return (
      <span 
        className="hidden hover:text-theme md:inline cursor-text"
        onClick={handleTextClick}
      >
        Search
      </span>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="hidden md:inline">
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search"
        className="bg-transparent border-none outline-none hover:text-theme text-right"
        style={{
          width: searchValue ? `${Math.min(Math.max(searchValue.length * 8 + 20, 60), 200)}px` : '120px'
        }}
        maxLength={50}
        aria-label="search"
        autoFocus
      />
    </form>
  );
}

function SearchResults({searchValue, isVisible}: {searchValue: string; isVisible: boolean}) {
  const {results} = useInstantSearch();

  if (!isVisible || !searchValue || !results?.hits?.length) {
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent the input from losing focus when clicking in the dropdown
    e.preventDefault();
  };

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-md shadow-lg border overflow-hidden z-50 search-results-container"
      onMouseDown={handleMouseDown}
    >
      <div className="max-h-96 overflow-y-auto">
        <div className="p-3 border-b">
          <h3 className="text-xs font-bold text-gray-600">Products</h3>
        </div>
        <div className="desktop-search-results">
          <Hits hitComponent={Hit} />
        </div>
        {results.nbHits > 6 && (
          <div className="p-3 border-b">
            <a
              href={`/search?shopify_products[query]=${encodeURIComponent(searchValue)}`}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all {results.nbHits} results →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}


/**
 * A client component that defines the behavior when a user toggles a cart
 */
export default function SearchToggle({onClick}: Props) {
  const [searchValue, setSearchValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const {openSearch} = useSearchUI();

  const handleFocus = () => {
    setShowResults(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Check if the new focus target is within the search results
    if (e.relatedTarget && (e.relatedTarget as Element).closest('.search-results-container')) {
      return;
    }
    // Delay hiding to allow clicks on results
    setTimeout(() => setShowResults(false), 200);
  };

  const handleMobileSearchClick = () => {
    if (onClick) {
      onClick();
    } else {
      openSearch();
    }
  };

  return (
    <>
      <div className="hidden md:block relative">
        <InstantSearch
          searchClient={searchClient}
          indexName={indexName}
          routing={false}
        >
          <SearchBox
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            isActive={isActive}
            setIsActive={setIsActive}
          />
          <SearchResults searchValue={searchValue} isVisible={showResults} />
        </InstantSearch>
      </div>
      <button
        onClick={handleMobileSearchClick}
        aria-label="search"
        className="inline md:hidden"
      >
        <SearchIcon />
      </button>
    </>
  );
}
