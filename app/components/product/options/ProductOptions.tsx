import {useProductOptions} from '~/contexts/ProductOptions';
import type {SanityCustomProductOption} from '~/types';
import ProductOptionsColor from './ProductOptionsColor';
import ProductOptionsDefault from './ProductOptionsDefault';
import ProductOptionsSize from './ProductOptionsSize';

type Props = {
  customProductOptions?: SanityCustomProductOption[];
};

export default function ProductOptions({customProductOptions}: Props) {
  const {product} = useProductOptions();

  return (
    <>
      <div>
        {product.options?.map((option) => {
          const customProductOption = customProductOptions?.find(
            (opt) => opt.title === option.name,
          );

          switch (customProductOption?._type) {
            case 'customProductOption.color':
              return (
                <ProductOptionsColor
                  customProductOption={customProductOption}
                  key={option.name}
                  name={option.name}
                  values={option.values}
                />
              );
            case 'customProductOption.size':
              return (
                <ProductOptionsSize
                  customProductOption={customProductOption}
                  key={option.name}
                  name={option.name}
                  values={option.values}
                />
              );
            default:
              return (
                <ProductOptionsDefault
                  key={option.name}
                  name={option.name}
                  values={option.values}
                />
              );
          }
        })}
      </div>
      <div className="my-4 w-full border-b border-gray" />
    </>
  );
}
