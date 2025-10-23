import clsx from 'clsx';

import BlockContent from '@sanity/block-content-to-react';

import LinkEmailAnnotation from './annotations/LinkEmail';
import LinkExternalAnnotation from './annotations/LinkExternal';
import LinkInternalAnnotation from './annotations/LinkInternal';
import ProductAnnotation from './annotations/Product';
import AccordionBlock from './blocks/Accordion';
import Block from './blocks/Block';
import CalloutBlock from './blocks/Callout';
import GridBlock from './blocks/Grid';
import ImagesBlock from './blocks/Images';
import InstagramBlock from './blocks/Instagram';
import ListBlock from './blocks/List';
import ProductsBlock from './blocks/Products';

import type {SanityColorTheme} from '../../types';
type Props = {
  blocks: any;
  className?: string;
  centered?: boolean;
  colorTheme?: SanityColorTheme;
};

export default function PortableText({
  blocks,
  centered,
  className,
  colorTheme,
}: Props) {
  return (
    <BlockContent
      blocks={blocks}
      renderContainerOnSingleChild
      serializers={{
        // Lists
        list: ListBlock,
        // Marks
        marks: {
          annotationLinkEmail: LinkEmailAnnotation,
          annotationLinkExternal: LinkExternalAnnotation,
          annotationLinkInternal: LinkInternalAnnotation,
          annotationProduct: (props: any) => (
            <ProductAnnotation colorTheme={colorTheme} {...props} />
          ),
        },
        // Block types
        types: {
          block: Block,
          blockAccordion: AccordionBlock,
          blockCallout: (props: any) => (
            <CalloutBlock
              centered={centered}
              colorTheme={colorTheme}
              {...props}
            />
          ),
          blockGrid: GridBlock,
          blockImages: (props: any) => (
            <ImagesBlock centered={centered} {...props} />
          ),
          blockInstagram: InstagramBlock,
          blockProducts: ProductsBlock,
        },
      }}
    />
  );
}
