import clsx from 'clsx';
import {urlFor} from '~/lib/sanity';
import Filters from '~/components/modules/Filters';

type Props = {
  editorialImage: {
    filters?: any[];
    image: {
      image: {
        asset: {
          _ref: string;
        };
        crop?: any;
        hotspot?: any;
        alt?: string;
      };
    };
  };
  cover?: boolean;
  fullscreen?: boolean;
};

export default function EditorialImage({
  editorialImage,
  cover = false,
  fullscreen = false,
}: Props) {
  const {
    filters,
    image: {image},
  } = editorialImage;

  // Build the image URL using urlFor
  const imageUrl = image?.asset?._ref
    ? urlFor(image.asset._ref)
        .auto('format')
        .fit('max')
        .width(fullscreen ? 1920 : 1200)
        .quality(90)
        .url()
    : null;

  return (
    <div className="relative grid h-full w-full grid-flow-row gap-2">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={image.alt || ''}
          className={clsx(
            'overflow-hidden rounded-lg',
            fullscreen && 'h-full w-full object-contain pb-12',
            cover && 'aspect-[3/4] object-cover',
          )}
          loading="lazy"
        />
      )}
      <div
        className={clsx(
          'overflow-x-auto',
          fullscreen &&
            'absolute left-0 bottom-0 flex w-full items-center justify-center',
        )}
      >
        <Filters filters={filters} />
      </div>
    </div>
  );
}
