import {useProductOptions} from '~/contexts/ProductOptions';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import type {SanityCustomProductOptionColor} from '~/types';
import OptionButton from '~/components/elements/OptionButton';
import Tooltip from '~/components/elements/Tooltip';

type Props = {
  customProductOption: SanityCustomProductOptionColor;
  name: string;
  values: string[];
};

const ColorChip = ({hex, selected}: {hex: string; selected: boolean}) => {
  return (
    <div
      className={clsx([
        'flex h-8 w-8 items-center justify-center rounded-full border',
        selected
          ? 'border-offBlack'
          : 'cursor-pointer border-transparent hover:border-black hover:border-opacity-30',
      ])}
    >
      <div
        className="rounded-full"
        style={{
          background: hex,
          height: 'calc(100% - 4px)',
          width: 'calc(100% - 4px)',
        }}
      />
    </div>
  );
};

export default function ProductOptionsColor({
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
          const foundCustomOptionValue = customProductOption.colors.find(
            (color) => color.title === value,
          );

          return (
            <label key={id} htmlFor={id}>
              <input
                checked={checked}
                className="sr-only"
                id={id}
                name={`option[${name}]`}
                onChange={() => handleChange(name, value)}
                type="radio"
                value={value}
              />
              {foundCustomOptionValue ? (
                <Tippy
                  placement="top"
                  render={() => (
                    <Tooltip label={foundCustomOptionValue.title} />
                  )}
                >
                  <div>
                    <ColorChip
                      hex={foundCustomOptionValue.hex}
                      selected={checked}
                    />
                  </div>
                </Tippy>
              ) : (
                <OptionButton checked={checked} label={value} />
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
