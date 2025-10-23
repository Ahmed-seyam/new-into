import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface ContextInterface {
  isFilterOpen: boolean;
  openFilter: () => void;
  closeFilter: () => void;
  toggleFilter: () => void;
}

export const FilterContext = createContext<ContextInterface | null>(null);

/**
 * A client component that defines the behavior that occurs when a user is interacting with a search (for example, opening or closing it)
 */
export default function FilterUIProvider({children}: {children: ReactNode}) {
  const [open, setOpen] = useState(false);

  const openFilter = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const closeFilter = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const toggleFilter = useCallback(() => {
    setOpen(!open);
  }, [setOpen, open]);

  const contextValue = useMemo(() => {
    return {
      isFilterOpen: open,
      openFilter,
      closeFilter,
      toggleFilter,
    };
  }, [open, openFilter, closeFilter, toggleFilter]);

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterUI() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('No filter context found');
  }

  return context;
}
