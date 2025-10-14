import clsx from 'clsx';

import {Link} from '@shopify/hydrogen';
// @ts-expect-error incompatibility with node16 resolution
import Tippy from '@tippyjs/react/headless';

import {ProductWithNodes} from '../../types';
import ProductTile from './Tile';

type Props = {
  storefrontProduct: ProductWithNodes;
  x: number;
  y: number;
};

export default function ProductHotspot({storefrontProduct, x, y}: Props) {
  if (!storefrontProduct) {
    return null;
  }

  return (
    <Tippy
      placement="top"
      render={() => {
        return <ProductTile storefrontProduct={storefrontProduct} />;
      }}
    >
      <Link
        className={clsx(
          'absolute left-[50%] top-[50%] z-10 flex h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 animate-pulse items-center justify-center rounded-full bg-theme duration-300 ease-out',
          'hover:scale-125 hover:animate-none',
        )}
        style={{
          left: `${x}%`,
          top: `${y}%`,
        }}
        aria-label={`View ${storefrontProduct.title}`}
        to={`/products/${storefrontProduct.id}`}
      >
        <div className="relative h-[4px] w-[4px] rounded-full bg-white" />
      </Link>
    </Tippy>
  );
}
