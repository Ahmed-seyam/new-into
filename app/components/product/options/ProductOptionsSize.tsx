import {useProductOptions} from '~/contexts/ProductOptions';
import Tippy from '@tippyjs/react/headless';
import type {SanityCustomProductOptionSize} from '~/types';
import OptionButton from '~/components/elements/OptionButton';
import Tooltip from '~/components/elements/Tooltip';

type Props = {
  customProductOption: SanityCustomProductOptionSize;
  name: string;
  values: string[];
};

export default function ProductOptionsSize({
  customProductOption,
  name,
  values,
}: Props) {
  const {setSelectedOption, selectedOptions} = useProductOptions();

  const handleChange = (optionName: string, optionValue: string) => {
    setSelectedOption(optionName, optionValue);
  };

  return (
    <fieldset key={name} className="mt-4">
      <legend className="mb-2 text-xs text-darkGray">{name}</legend>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
        {values.map((value) => {
          const checked = selectedOptions?.[name] === value;
          const id = `option-${name}-${value}`;
          const foundCustomOptionValue = customProductOption.sizes.find(
            (size) => size.title === value,
          );

          return (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label key={id} htmlFor={id}>
              <input
                className="sr-only"
                type="radio"
                id={id}
                name={`option[${name}]`}
                value={value}
                checked={checked}
                onChange={() => handleChange(name, value)}
              />
              <Tippy
                placement="top"
                render={() => {
                  if (!foundCustomOptionValue) {
                    return null;
                  }
                  return (
                    <Tooltip
                      label={`${foundCustomOptionValue.width}cm x ${foundCustomOptionValue.height}cm`}
                    />
                  );
                }}
              >
                <div>
                  <OptionButton checked={checked} label={value} />
                </div>
              </Tippy>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
