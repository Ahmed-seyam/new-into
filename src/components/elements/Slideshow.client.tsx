import type {HTMLAttributes} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {useCallback, useEffect, useState} from 'react';
import {A11y, Navigation, Pagination, Scrollbar} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';

import CircleButton from '../elements/CircleButton';
import {ArrowRightIcon} from '../icons/ArrowRight';

// import Slider from '@ant-design/react-slick';

type Props = {
  items: any[];
} & HTMLAttributes<HTMLElement>;

const DotButton = ({selected, onClick}) => (
  <button
    className={`embla__dot ${selected ? 'is-selected' : ''}`}
    type="button"
    onClick={onClick}
  />
);

export default function Slideshow({
  children,
  items,
  fullscreen = false,
  landingPage = false,
  slideshowProps = {
    // align: 'center',
    draggable: items && items.length > 1,
    loop: true,
    skipSnaps: true,
    slidesToScroll: 1,
    speed: 20,
    dragFree: true,
    active: true,
    breakpoints: {
      '(min-width: 768px)': {slidesToScroll: 1},
    },
  },
  ...rest
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const [emblaRef, emblaApi] = useEmblaCarousel(slideshowProps);

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

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  const onResize = () => {
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

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  if (landingPage) {
    return (
      <div className="relative">
        <div className="mb-6 w-screen overflow-hidden" ref={emblaRef}>
          <div className="mx-1 flex gap-1 pl-3 md:mx-6 md:gap-6 md:pl-6">
            {/* Slides */}
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
  } else if (!fullscreen) {
    return (
      <div className="relative w-screen overflow-hidden">
        <div className="-mx-3 mb-6  md:-mx-6" ref={emblaRef}>
          <div className="mx-3 flex gap-3 pl-3 md:mx-6 md:gap-6 md:pl-6">
            {/* Slides */}
            {items.map((item, index) => (
              <div className="embla__slide" key={`slideshow-item-${index}`}>
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
  } else {
    return (
      <div className="relative">
        <div className="mb-6 w-screen overflow-hidden" ref={emblaRef}>
          <div className="mx-3 flex gap-3 pl-3 md:mx-6 md:gap-6 md:pl-6">
            {/* Slides */}
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
}

{
  /* Navigation */
}
{
  /* {items.length > 1 && (
        <div className="  bottom-8 left-8 flex gap-3 md:hidden">
          <CircleButton onClick={handlePrevious}>
            <ArrowRightIcon className="rotate-180" />
          </CircleButton>
          <CircleButton onClick={handleNext}>
            <ArrowRightIcon />
          </CircleButton>
        </div>
      )} */
}
