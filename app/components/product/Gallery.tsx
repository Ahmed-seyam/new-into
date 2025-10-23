import useEmblaCarousel from 'embla-carousel-react';
import {useCallback, useEffect, useState} from 'react';

import {MediaFile} from '@shopify/hydrogen';
import type {MediaImage} from '@shopify/hydrogen/storefront-api-types';
import {getBlendMode} from '../../utils/getBlendMode';

import type {ProductWithNodes} from '../../types';
import {useProductOptions} from '~/contexts/ProductOptions';

type Props = {
  storefrontProduct: ProductWithNodes;
};

const MODEL_3D_PROPS = {
  interactionPromptThreshold: '0',
};

const DotButton = ({
  selected,
  onClick,
}: {
  selected: boolean;
  onClick: () => void;
}) => (
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
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: true,
    active: true,
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': {active: false},
    },
  });

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const handleNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const handlePrevious = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  useEffect(() => {
    if (!selectedVariant) return;

    const variantImageUrl = selectedVariant?.image?.url?.split('?')[0];
    const galleryIndex =
      media?.findIndex((mediaItem) => {
        if (mediaItem.mediaContentType === 'IMAGE') {
          return (
            (mediaItem as MediaImage)?.image?.url.split('?')[0] ===
            variantImageUrl
          );
        }
        return false;
      }) ?? -1;

    if (emblaApi && galleryIndex >= 0) {
      emblaApi.scrollTo(galleryIndex, true);
    }
  }, [emblaApi, media, selectedVariant]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

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

    return () => {
      window.removeEventListener('resize', onResize);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!media?.length) return null;

  return (
    <div>
      <div className="relative bg-lightGray md:bg-white" tabIndex={-1}>
        <div className="overflow-hidden md:overflow-visible" ref={emblaRef}>
          <div className="flex h-full md:grid md:h-auto md:gap-6 lg:grid-cols-2">
            {media.map((med) => {
              const extraProps =
                med.mediaContentType === 'MODEL_3D' ? MODEL_3D_PROPS : {};

              return (
                <div
                  key={med.id}
                  className="relative flex aspect-[3/4] w-full shrink-0 grow-0 select-none overflow-hidden rounded-md bg-gray"
                >
                  <MediaFile
                    className="bg-gray object-cover"
                    style={{mixBlendMode: getBlendMode(storefrontProduct)}}
                    data={med}
                    draggable={false}
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
