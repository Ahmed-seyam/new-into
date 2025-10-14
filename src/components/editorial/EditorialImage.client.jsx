import clsx from 'clsx';
import SanityImage from '../media/SanityImage.client';
import Filters from '../modules/Filters.client';
import sanityConfig from '../../../sanity.config';
export default function EditorialImage({
  editorialImage,
  cover = false,
  fullscreen = false,
}) {
  const {
    filters,
    image: {image},
  } = editorialImage;

  return (
    <div className="relative grid h-full w-full grid-flow-row gap-2">
      {image && (
        <SanityImage
          crop={image?.crop}
          dataset={sanityConfig.dataset}
          hotspot={image?.hotspot}
          layout={fullscreen && !cover ? 'fill' : 'responsive'}
          projectId={sanityConfig.projectId}
          sizes={['50vw, 100vw']}
          src={image?.asset._ref}
          alt={'Image'}
          className={clsx(
            'overflow-hidden rounded-lg',
            fullscreen && 'h-full w-full object-contain pb-12',
            cover && 'aspect-[3/4]  object-cover',
          )}
        />
      )}
      <div
        className={clsx(
          'overflow-x-auto',
          fullscreen &&
            'absolute left-0 bottom-0 flex w-full  items-center justify-center ',
        )}
      >
        <Filters filters={filters} />
      </div>
    </div>
  );
}
