import type {HTMLAttributes} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {useCallback, useEffect, useState} from 'react';
import type {EmblaOptionsType} from 'embla-carousel';

type Props = {
  items: any[];
  fullscreen?: boolean;
  landingPage?: boolean;
  slideshowProps?: EmblaOptionsType;
} & HTMLAttributes<HTMLElement>;

type DotButtonProps = {
  selected: boolean;
  onClick: () => void;
};

const DotButton = ({selected, onClick}: DotButtonProps) => (
  <button
    className={`embla__dot ${selected ? 'is-selected' : ''}`}
    type="button"
    onClick={onClick}
  />
);

export default function Slideshow({
  items,
  fullscreen = false,
  landingPage = false,
  slideshowProps = {
    loop: true,
    skipSnaps: true,
    slidesToScroll: 1,
    startIndex: 1,
    dragFree: true,
    active: true,
    breakpoints: {
      '(min-width: 768px)': {slidesToScroll: 1},
    },
  },
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel(slideshowProps);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const onResize = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    window.addEventListener('resize', onResize);

    return () => {
      emblaApi.off('select', onSelect);
      window.removeEventListener('resize', onResize);
    };
  }, [emblaApi, onSelect, onResize]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  return (
    <div className="relative">
      <div className="mb-6 w-screen overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {/* Slides */}
          {items.map((item, index) => (
            <div
              className="w-3/5 flex-shrink-0 gap-3 pl-12 md:w-1/3"
              key={`slideshow-item-${index}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="embla__dots">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={`dotbutton-${index}`}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
