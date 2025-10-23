// productOptions.ts
import type {ProductOption} from '@shopify/hydrogen/storefront-api-types';
import pluralize from 'pluralize';

export const hasMultipleProductOptions = (options?: ProductOption[]) => {
  const firstOption = options?.[0];
  if (!firstOption) {
    return false;
  }

  return (
    firstOption.name !== 'Title' && 
    firstOption.optionValues?.[0]?.name !== 'Default Title'
  );
};

export const getProductOptionString = (options?: ProductOption[]) => {
  return options
    ?.map(({name, optionValues}) => 
      pluralize(name, optionValues?.length || 0, true)
    )
    .join(' / ');
};