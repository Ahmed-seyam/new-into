import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import {urlFor} from '~/lib/sanity';
import type {SanityModuleGrid} from '~/types';
import PortableText from '../PortableText';

type Props = {
  node: PortableTextBlock & SanityModuleGrid;
};

export default function GridBlock({node}: Props) {
  return (
    <div
      className={clsx(
        'first:mt-0 last:mb-0',
        'my-8 grid grid-cols-1 gap-x-3',
        'md:grid-cols-2',
      )}
    >
      {node?.items?.map((item) => {
        const imageUrl = item.image?.asset?._ref
          ? urlFor(item.image.asset._ref)
              .auto('format')
              .width(200)
              .height(200)
              .fit('crop')
              .quality(80)
              .url()
          : null;

        return (
          <div
            className="flex items-start gap-3 border-t border-t-gray py-3"
            key={item._key}
          >
            <div className="relative flex aspect-square w-[5rem] shrink-0 items-center justify-center overflow-hidden rounded-sm bg-lightGray">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={item.image?.altText || ''}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="space-y-1">
              <div>{item.title}</div>
              <PortableText className="text-sm" blocks={item.body} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
