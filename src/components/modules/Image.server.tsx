import clsx from 'clsx';
import {Suspense} from 'react';

import {gql, useLocalization, useShopQuery} from '@shopify/hydrogen';

import sanityConfig from '../../../sanity.config';
import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';
import Button from '../elements/Button';
import Link from '../elements/Link';
import SanityImage from '../media/SanityImage.client';
import ProductCard from '../product/Card.server';
import ProductHotspot from '../product/Hotspot.client';
import CardFlip from '../editorial/CardFlip.client';

import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import type {
  ProductWithNodes,
  SanityModuleImage,
  SanityProductWithVariant,
} from '../../types';
type ShopifyPayload = {
  products: Partial<Product>[];
  productVariants: Partial<ProductVariant>[];
};

type Props = {
  module: SanityModuleImage;
};

export default function ImageModule({module}: Props) {
  if (!module.image) {
    return null;
  }

  // Conditionally fetch Shopify products if this is an image module that references products
  let storefrontProducts: ProductWithNodes[];
  if (['productHotspots', 'productGrid'].includes(module.variant)) {
    const {
      language: {isoCode: languageCode},
      country: {isoCode: countryCode},
    } = useLocalization();

    let products: SanityProductWithVariant[] | undefined = undefined;
    if (module.variant === 'productHotspots') {
      products = module.productHotspots?.map((hotspot) => hotspot.product);
    }
    if (module.variant === 'productGrid') {
      products = module.productGrid;
    }

    if (products) {
      const [productGids, productVariantGids] = products.reduce<
        [string[], string[]]
      >(
        (acc, val) => {
          if (val) {
            acc[0].push(val.gid);
            acc[1].push(val.variantGid);
          }
          return acc;
        },
        [[], []],
      );

      const {data} = useShopQuery<ShopifyPayload>({
        query: QUERY_SHOPIFY,
        variables: {
          country: countryCode,
          ids: productGids,
          language: languageCode,
          variantIds: productVariantGids,
        },
      });
      // Attach variant nodes
      storefrontProducts = data.products?.map((product, index) => {
        const productVariant = data.productVariants[index];
        return {
          ...product,
          variants: {nodes: [productVariant as ProductVariant]},
        };
      });
    }
  }

  if (module.variant === 'productGrid') {
    return (
      <>
        <div className="md:hidden">
          <CardFlip
            title={module.caption}
            front={
              <div className="aspect-[4/6]">
                <ImageContent module={module} />
              </div>
            }
            back={
              <div className="grid aspect-[4/6] grid-cols-2 gap-3 overflow-hidden p-3">
                {module.productGrid?.map((product, index) => (
                  <ProductCard
                    key={product._key}
                    storefrontProduct={storefrontProducts[index]}
                    hideText
                  />
                ))}
              </div>
            }
          />
        </div>
        <div className="hidden w-screen overflow-x-auto md:block">
          <div className="w-full pr-3 md:mx-auto md:pr-0 lg:w-3/4">
            <div className="relative mx-3 flex grid-cols-2 rounded-md bg-lightGray md:mx-6   md:grid md:overflow-hidden">
              <div className="absolute z-10 h-full w-11/12 flex-shrink-0 overflow-hidden  rounded-md md:relative md:w-full">
                <ImageContent module={module} />
              </div>
              <div className="relative left-11/12 mb-auto w-full flex-shrink-0 flex-col-reverse bg-lightGray p-3 pb-0 md:left-0  md:-ml-2 md:flex md:w-auto md:p-6 md:pl-8 md:pt-0">
                <div className="grid grid-cols-2 gap-3 md:gap-8 ">
                  {module.productGrid?.map((product, index) => (
                    <ProductCard
                      key={product._key}
                      storefrontProduct={storefrontProducts[index]}
                    />
                  ))}
                </div>
                <div className="flex h-12 items-center justify-between">
                  {/* Caption */}
                  {module.caption && (
                    <div className="mx-auto text-center text-sm leading-caption">
                      {module.caption}
                    </div>
                  )}
                  {/* <button className="md:hidden" aria-label="Shop the look">
                  Shop the look
                </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="relative mx-auto px-3 md:px-6 lg:w-3/4">
      {module.variant === 'callToAction' && module.callToAction?.link ? (
        <Link className="group" link={module.callToAction.link}>
          <ImageContent module={module} />
        </Link>
      ) : (
        <ImageContent module={module} />
      )}

      {/* Caption */}
      {module.caption && (
        <div className="mt-2 text-center text-sm leading-caption">
          {module.caption}
        </div>
      )}
      {/* Product hotspots */}
      {module.variant === 'productHotspots' && (
        <>
          {module.productHotspots?.map((hotspot, index) => (
            <ProductHotspot
              key={hotspot._key}
              storefrontProduct={storefrontProducts[index]}
              x={hotspot.x}
              y={hotspot.y}
            />
          ))}
        </>
      )}
      {/* Product tags */}
      {module.variant === 'productGrid' && (
        <div className="grid grid-cols-2 gap-6">
          {module.productGrid?.map((product, index) => (
            <ProductCard
              key={product._key}
              storefrontProduct={storefrontProducts[index]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const ImageContent = ({module}: Props) => {
  const {image, caption} = module;

  return (
    <div
      className={clsx(
        'relative h-full overflow-hidden transition-[border-radius] duration-500 ease-out',
        'group-hover:rounded-xl',
      )}
    >
      <SanityImage
        crop={image?.crop}
        dataset={sanityConfig.dataset}
        hotspot={image?.hotspot}
        layout="responsive"
        projectId={sanityConfig.projectId}
        sizes={['50vw, 100vw']}
        src={image?.asset._ref}
        alt={caption || 'Image'}
        className="absolute h-full w-full object-cover"
      />

      {/* Call to action */}
      {module.variant === 'callToAction' && (
        <div
          className={clsx(
            'absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-20 duration-500 ease-out',
            'group-hover:bg-opacity-30',
          )}
        >
          <div className="mt-[1em] flex flex-col items-center gap-5">
            {/* Title */}
            <div
              className={clsx(
                'max-w-[30rem] text-xl text-white', //
                'lg:text-2xl',
                'xl:text-3xl',
              )}
            >
              {module.callToAction?.title}
            </div>

            {/* Button */}
            {module.callToAction?.link && (
              <Button
                className={clsx('pointer-events-none bg-white text-offBlack')}
              >
                {module.callToAction.title}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const QUERY_SHOPIFY = gql`
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query products(
    $country: CountryCode
    $language: LanguageCode
    $ids: [ID!]!
    $variantIds: [ID!]!
  ) @inContext(country: $country, language: $language) {
    products: nodes(ids: $ids) {
      ... on Product {
        ...ProductFields
      }
    }
    productVariants: nodes(ids: $variantIds) {
      ... on ProductVariant {
        ...ProductVariantFields
      }
    }
  }
`;
