import useEmblaCarousel from 'embla-carousel-react';
import {useCallback, useEffect, useState} from 'react';

import {MediaFile, useProductOptions} from '@shopify/hydrogen';
import {
  MediaContentType,
  MediaImage,
} from '@shopify/hydrogen/storefront-api-types';
import {getBlendMode} from '../../utils/getBlendMode';
import CircleButton from '../elements/CircleButton';
import {ArrowRightIcon} from '../icons/ArrowRight';

import type {ProductWithNodes} from '../../types';
/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */

type Props = {
  storefrontProduct: ProductWithNodes;
};

const MODEL_3D_PROPS = {
  interactionPromptThreshold: '0',
};

const DotButton = ({selected, onClick}) => (
  <button
    className={`embla__dot ${selected ? 'is-selected' : ''}`}
    type="button"
    onClick={onClick}
  />
);

export default function ProductGallery({storefrontProduct}: Props) {
  const media = storefrontProduct?.media?.nodes;
  const {selectedVariant} = useProductOptions();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    draggable: media && media.length > 1,
    loop: false,
    skipSnaps: true,
    speed: 20,
    active: true,
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': {active: false},
    },
  });

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const handleNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  };

  const handlePrevious = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  };

  useEffect(() => {
    if (!selectedVariant) {
      return;
    }

    const variantImageUrl = selectedVariant?.image?.url?.split('?')[0];
    const galleryIndex =
      media?.findIndex((mediaItem) => {
        if (mediaItem.mediaContentType === MediaContentType.Image) {
          return (
            (mediaItem as MediaImage)?.image?.url.split('?')[0] ===
            variantImageUrl
          );
        }
        return false;
      }) ?? -1;

    if (emblaApi && galleryIndex >= 0) {
      emblaApi.scrollTo(galleryIndex, true); // instantly scroll
    }
  }, [emblaApi, media, selectedVariant]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  const onResize = () => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
  };
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    window.addEventListener('resize', onResize);
  }, [emblaApi, setScrollSnaps, onSelect]);

  if (!media?.length) {
    return null;
  }

  return (
    <div>
      <div className="relative bg-lightGray md:bg-white" tabIndex={-1}>
        <div className=" overflow-hidden md:overflow-visible" ref={emblaRef}>
          <div className="flex h-full md:grid md:h-auto md:gap-6 lg:grid-cols-2">
            {/* Slides */}
            {media.map((med) => {
              let extraProps = {};
              if (med.mediaContentType === MediaContentType.Model_3D) {
                extraProps = MODEL_3D_PROPS;
              }

              return (
                <div
                  key={med.id}
                  className="relative flex aspect-[3/4] w-full shrink-0 grow-0 select-none overflow-hidden rounded-md bg-gray"
                >
                  <MediaFile
                    // @ts-expect-error options should accept className
                    className=" bg-gray object-cover"
                    style={{mixBlendMode: getBlendMode(storefrontProduct)}}
                    data={med}
                    draggable={false}
                    fetchpriority="high"
                    alt={storefrontProduct.title}
                    // options={{crop: 'center'}}
                    tabIndex={0}
                    {...extraProps}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Dots */}
      <div className="embla__dots md:hidden">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
