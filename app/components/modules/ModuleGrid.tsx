import ProductCard from '../product/Card';
import Module from './Module';

import type {
  ProductWithNodes,
  SanityColorTheme,
  SanityModule,
} from '../../types';

type Props = {
  colorTheme?: SanityColorTheme;
  items: (SanityModule | ProductWithNodes)[];
  variant?: 'grid' | 'list';
};

export default function ModuleGrid({colorTheme, items, variant}: Props) {
  return (
    <div
      className={`grid gap-4 md:gap-6 ${
        variant === 'grid'
          ? 'grid-cols-2 md:grid-cols-4  xl:grid-cols-5'
          : 'grid-flow-row gap-y-12 md:gap-y-16'
      }`}
    >
      {items.map((item, index) => {
        if (isModule(item)) {
          // Render modules
          return (
            <div key={item._key}>
              <Module
                colorTheme={colorTheme}
                // imageAspectClassName={productImageAspect}
                module={item}
              />
            </div>
          );
        } else {
          // Render product cards
          return (
            <div key={item.id}>
              <ProductCard
                // imageAspectClassName={productImageAspect}
                storefrontProduct={item}
              />
            </div>
          );
        }
      })}
    </div>
  );
}

const isModule = (
  item: SanityModule | ProductWithNodes,
): item is SanityModule => {
  return (item as SanityModule)._type?.startsWith('module');
};
