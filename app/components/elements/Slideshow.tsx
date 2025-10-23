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
  slideshowProps,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const defaultOptions: EmblaOptionsType = {
    loop: true,
    skipSnaps: true,
    dragFree: true,
    breakpoints: {
      '(min-width: 768px)': {
        slidesToScroll: 1,
      },
    },
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(
    slideshowProps || defaultOptions,
  );

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

  if (landingPage) {
    return (
      <div className="relative">
        <div className="mb-6 w-screen overflow-hidden" ref={emblaRef}>
          <div className="mx-1 flex gap-1 pl-3 md:mx-6 md:gap-6 md:pl-6">
            {items.map((item, index) => (
              <div
                className="mx-2 w-3/5 flex-shrink-0 md:mx-3 md:w-1/4"
                key={`slideshow-item-${index}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

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

  if (!fullscreen) {
    return (
      <div className="relative w-screen overflow-hidden">
        <div className="-mx-3 mb-6 md:-mx-6" ref={emblaRef}>
          <div className="mx-3 flex gap-3 pl-3 md:mx-6 md:gap-6 md:pl-6">
            {items.map((item, index) => (
              <div className="embla__slide" key={`slideshow-item-${index}`}>
                {item}
              </div>
            ))}
          </div>
        </div>

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

  return (
    <div className="relative">
      <div className="mb-6 w-screen overflow-hidden" ref={emblaRef}>
        <div className="mx-3 flex gap-3 pl-3 md:mx-6 md:gap-6 md:pl-6">
          {items.map((item, index) => (
            <div
              className="mx-6 w-full flex-shrink-0 md:w-1/2"
              key={`slideshow-item-${index}`}
              style={{height: 'calc(100vh - 9rem)'}}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

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
