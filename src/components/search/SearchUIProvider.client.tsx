import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface ContextInterface {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  isFilterOpen: boolean;
  openFilter: () => void;
  closeFilter: () => void;
  toggleFilter: () => void;
}

export const SearchContext = createContext<ContextInterface | null>(null);

/**
 * A client component that defines the behavior that occurs when a user is interacting with a search (for example, opening or closing it)
 */
export default function SearchUIProvider({children}: {children: ReactNode}) {
  const [open, setOpen] = useState(false);
  const [openF, setOpenF] = useState(false);

  const openSearch = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const closeSearch = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const toggleSearch = useCallback(() => {
    setOpen(!open);
  }, [setOpen, open]);

  // Filters
  const openFilter = useCallback(() => {
    setOpenF(true);
  }, [setOpenF]);

  const closeFilter = useCallback(() => {
    setOpenF(false);
  }, [setOpenF]);

  const toggleFilter = useCallback(() => {
    setOpenF(!openF);
  }, [setOpenF, openF]);

  const contextValue = useMemo(() => {
    return {
      isSearchOpen: open,
      openSearch,
      closeSearch,
      toggleSearch,
      // Filters
      isFilterOpen: openF,
      openFilter,
      closeFilter,
      toggleFilter,
    };
  }, [
    open,
    openSearch,
    closeSearch,
    toggleSearch,
    openF,
    openFilter,
    closeFilter,
    toggleFilter,
  ]);

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchUI() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('No search context found');
  }

  return context;
}
