import {useFilterUI} from './FilterUIProvider';

type Props = {
  onClick?: () => void;
};

/**
 * A client component that defines the behavior when a user toggles a cart
 */
export default function FilterToggle({onClick}: Props) {
  const {isFilterOpen, toggleFilter} = useFilterUI();

  return (
    <button
      aria-expanded={isFilterOpen}
      aria-controls="filter"
      className="btn-tertiary"
      onClick={() => {
        toggleFilter();
        onClick?.();
      }}
      aria-label="filter"
    >
      <span className=" inline">Filter</span>
    </button>
  );
}
