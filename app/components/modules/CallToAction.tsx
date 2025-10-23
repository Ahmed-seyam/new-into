import clsx from 'clsx';
import {urlFor} from '../../lib/sanity'; // adjust import path if needed
import type {
  SanityAssetImage,
  SanityModuleCallToAction,
  SanityProductWithVariant,
} from '../../types';
import Link from '../elements/Link';
import ProductHero from '../product/ProductHero';

type Props = {
  module: SanityModuleCallToAction;
};

export default function CallToActionModule({module}: Props) {
  const layoutClass =
    module.layout === 'left'
      ? 'flex-col md:flex-row'
      : module.layout === 'right'
        ? 'flex-col-reverse md:flex-row-reverse'
        : '';

  return (
    <div className={clsx('flex gap-5 md:gap-[5vw]', layoutClass)}>
      <div className="relative aspect-[864/485] grow">
        {module.content && <ModuleContent content={module.content} />}
      </div>

      <div className="mr-auto flex w-full shrink-0 flex-col items-start md:max-w-[20rem]">
        {module.title && (
          <div className="text-xl font-bold md:text-2xl">{module.title}</div>
        )}
        {module.body && (
          <div className="mt-4 leading-paragraph">{module.body}</div>
        )}
        {module.link && (
          <div className="mt-4">
            <Link
              className="font-bold underline hover:no-underline"
              link={module.link}
            >
              {module.link.title}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ModuleContent({
  content,
}: {
  content: SanityAssetImage | SanityProductWithVariant;
}) {
  switch (content?._type) {
    case 'image': {
      const imageUrl = content?.asset?._ref
        ? urlFor(content.asset).url()
        : null;
      if (!imageUrl) return null;

      return (
        <img
          src={imageUrl}
          alt={content?.altText || ''}
          className="object-cover"
          sizes="100vw"
        />
      );
    }
    case 'productWithVariant': {
      if (!content?.gid || !content.variantGid) return null;
      return <ProductHero gid={content.gid} variantGid={content.variantGid} />;
    }
    default:
      return null;
  }
}
