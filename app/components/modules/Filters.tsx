import {Link} from 'react-router';

function Filter({filter}: any) {
  switch (filter.type) {
    case 'vendor':
      return (
        <Link
          to={`/collections/all?shopify_products[refinementList][vendor][0]=${filter.title}`}
          className="btn-primary"
        >
          {filter.title}
        </Link>
      );
    case 'category':
      return (
        <Link
          to={`/collections/all?shopify_products[refinementList][product_type][0]=${filter.title}`}
          className="btn-tertiary filter-1"
        >
          {filter.title}
        </Link>
      );
    case 'color':
      return (
        <Link
          to={`/collections/all?shopify_products[refinementList][options.color][0]=${filter.title}`}
          className="btn-tertiary"
          data-color={filter.title}
        >
          {filter.title}
        </Link>
      );
    case 'material':
      return (
        <Link
          to={`/collections/all?shopify_products[refinementList][options.material][0]=${filter.title}`}
          className="btn-tertiary"
          data-color={filter.title}
        >
          {filter.title}
        </Link>
      );
    case 'era':
      return (
        <Link
          to={`/collections/all?shopify_products[refinementList][meta.product.era][0]=${filter.title}`}
          className="btn-tertiary"
        >
          {filter.title}
        </Link>
      );
    case 'condition':
      return (
        <Link
          to={`/collections/all?shopify_products[refinementList][meta.product.condition][0]=${filter.title}`}
          className="btn-tertiary"
        >
          {filter.title}
        </Link>
      );
  }
}

export default function Filters({filters}: any) {
  if (filters.length > 0) {
    return (
      <div
        style={{maxWidth: 'calc(100vw - 2rem)'}}
        className="flex gap-1 overflow-x-auto"
      >
        {filters.map((filter: any, index) => {
          return (
            <Filter key={`filter-${filter.type}-${index}`} filter={filter} />
          );
        })}
      </div>
    );
  } else {
    return <></>;
  }
}
