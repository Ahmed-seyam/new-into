import {useRefinementList} from 'react-instantsearch-hooks-web';
import clsx from 'clsx';
export default function CustomRefinementList({
  attr,
  transformFn,
  sortBy,
  limit,
}) {
  const refinementListApi = useRefinementList({
    attribute: attr,
    transformItems: transformFn,
    sortBy,
    limit,
  });

  return (
    <ul className="ais-RefinementList-list">
      {refinementListApi.items.map((item) => (
        <li
          className={clsx(
            'ais-RefinementList-item',
            item.isRefined && 'ais-RefinementList-item--selected',
          )}
          key={item.label}
        >
          <label className="ais-RefinementList-label">
            <input
              className="ais-RefinementList-checkbox"
              type="checkbox"
              checked={item.isRefined}
              onChange={(event) => {
                refinementListApi.refine(item.value);
              }}
            />
            <span className="ais-RefinementList-labelText">{item.label}</span>
            <span className="ais-RefinementList-count">{item.count}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
