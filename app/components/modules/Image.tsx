import {useEffect, useState} from 'react';
import clsx from 'clsx';
import {urlFor} from '../../lib/sanity';
import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';

import Button from '../elements/Button';
import Link from '../elements/Link';
import SanityImage from '../media/SanityImage';
import ProductCard from '../product/Card';
import ProductHotspot from '../product/Hotspot';
import CardFlip from '../editorial/CardFlip';

import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen-react/storefront-api-types';
import type {
  ProductWithNodes,
  SanityModuleImage,
  SanityProductWithVariant,
} from '../../types';
import {client} from '~/lib/storfrontFetch';

type ShopifyPayload = {
  products: Partial<Product>[];
  productVariants: Partial<ProductVariant>[];
};

type Props = {
  module: SanityModuleImage;
};

const QUERY_SHOPIFY = `
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

export default function ImageModule({module}: Props) {
  const [storefrontProducts, setStorefrontProducts] = useState<
    ProductWithNodes[] | null
  >(null);

  useEffect(() => {
    if (!['productHotspots', 'productGrid'].includes(module.variant)) return;

    const products: SanityProductWithVariant[] =
      module.variant === 'productHotspots'
        ? module?.productHotspots?.map((h) => h.product) || []
        : module?.productGrid || [];

    const [productGids, variantGids] = products.reduce<[string[], string[]]>(
      (acc, val) => {
        if (val) {
          acc[0].push(val.gid);
          acc[1].push(val.variantGid);
        }
        return acc;
      },
      [[], []],
    );

    if (productGids.length === 0) return;

    const fetchProducts = async () => {
      const res = await fetch(client.getStorefrontApiUrl(), {
        method: 'POST',
        headers: client.getPublicTokenHeaders(),
        body: JSON.stringify({
          query: QUERY_SHOPIFY,
          variables: {
            country: 'US',
            language: 'EN',
            ids: productGids,
            variantIds: variantGids,
          },
        }),
      });

      const json = await res.json();
      const data: ShopifyPayload = json.data;
      if (!data?.products) return;

      const merged = data.products.map((p, i) => ({
        ...p,
        variants: {nodes: [data.productVariants[i] as ProductVariant]},
      }));
      setStorefrontProducts(merged);
    };

    void fetchProducts();
  }, [module]);

  if (!module.image) return null;

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
                {storefrontProducts?.map((product, index) => (
                  <ProductCard
                    key={module.productGrid?.[index]?._key || index}
                    storefrontProduct={product}
                    hideText
                  />
                ))}
              </div>
            }
          />
        </div>

        <div className="hidden w-screen overflow-x-auto md:block">
          <div className="w-full pr-3 md:mx-auto md:pr-0 lg:w-3/4">
            <div className="relative mx-3 flex grid-cols-2 rounded-md bg-lightGray md:mx-6 md:grid md:overflow-hidden">
              <div className="absolute z-10 h-full w-11/12 flex-shrink-0 overflow-hidden rounded-md md:relative md:w-full">
                <ImageContent module={module} />
              </div>
              <div className="relative left-11/12 mb-auto w-full flex-shrink-0 flex-col-reverse bg-lightGray p-3 pb-0 md:left-0 md:-ml-2 md:flex md:w-auto md:p-6 md:pl-8 md:pt-0">
                <div className="grid grid-cols-2 gap-3 md:gap-8">
                  {storefrontProducts?.map((product, index) => (
                    <ProductCard
                      key={module.productGrid?.[index]?._key || index}
                      storefrontProduct={product}
                    />
                  ))}
                </div>
                {module.caption && (
                  <div className="mx-auto mt-2 text-center text-sm leading-caption">
                    {module.caption}
                  </div>
                )}
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

      {module.caption && (
        <div className="mt-2 text-center text-sm leading-caption">
          {module.caption}
        </div>
      )}

      {module.variant === 'productHotspots' &&
        module.productHotspots?.map((hotspot, index) => (
          <ProductHotspot
            key={hotspot._key}
            storefrontProduct={storefrontProducts?.[index]}
            x={hotspot.x}
            y={hotspot.y}
          />
        ))}
    </div>
  );
}
const ImageContent = ({module}: Props) => {
  const {image, caption} = module;
  const imageUrl = image?.asset?._ref ? urlFor(image).width(1200).url() : null;

  return (
    <div
      className={clsx(
        'relative h-full overflow-hidden transition-[border-radius] duration-500 ease-out',
        'group-hover:rounded-xl',
      )}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={caption || 'Image'}
          className="absolute h-full w-full object-cover"
          loading="lazy"
        />
      )}

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
                'max-w-[30rem] text-xl text-white',
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
