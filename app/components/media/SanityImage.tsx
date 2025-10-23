import imageUrlBuilder from '@sanity/image-url';
import {SanityImageSource} from '@sanity/image-url/lib/types/types';

const BREAKPOINTS = [640, 768, 1024, 1280, 1536]; // px

type Layout = 'fill' | 'responsive';
type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

interface SanityImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  crop?: {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  dataset: string;
  height?: number;
  hotspot?: {
    x: number;
    y: number;
  };
  layout?: Layout;
  objectFit?: ObjectFit;
  options?: {
    blur?: number;
  };
  projectId: string;
  quality?: number;
  sizes?: string;
  src: string;
  width?: number;
}

export const findLastNonNullValue = (
  items: (string | null)[],
  currentIndex: number,
): string | undefined => {
  const sliced = items.slice(0, currentIndex);
  return sliced.filter((val): val is string => val !== null).pop();
};

const generateSrcSet = (
  urlBuilder: ReturnType<ReturnType<typeof imageUrlBuilder>['image']>,
  breakpoints: number[],
  {quality}: {quality: number},
): string => {
  return breakpoints
    .map((width) => {
      return `${urlBuilder
        .width(width)
        .auto('format')
        .quality(quality)
        .url()} ${width}w`;
    })
    .join(', ');
};

// Generate srcset sizes based off breakpoints
const generateSizes = (
  breakpoints: number[],
  sizes?: string | (string | null)[],
): string | undefined => {
  if (!sizes) {
    return undefined;
  }

  if (typeof sizes === 'string') {
    return sizes;
  }

  if (sizes.length === 1 && sizes[0] !== null) {
    return sizes[0];
  }

  return sizes
    .map((val, i) => {
      if (i === sizes.length - 1) {
        return sizes[i];
      }

      let current = val;
      if (val === null) {
        current = findLastNonNullValue(sizes, i);
      }

      return `(max-width: ${breakpoints?.[i]}px) ${current}`;
    })
    .join(', ');
};

/**
 * A simple image component that wraps around `@sanity/image-url`
 */
export default function SanityImage(props: SanityImageProps) {
  const {
    crop,
    dataset,
    height,
    hotspot,
    layout,
    objectFit,
    options,
    projectId,
    quality = 80,
    sizes,
    src,
    width,
    alt,
    ...rest
  } = props;

  if (!dataset) {
    throw new Error('SanityImage is missing required "dataset" property.');
  }
  if (!projectId) {
    throw new Error('SanityImage is missing required "projectId" property.');
  }
  if (!src) {
    return null;
  }

  // Strip out blacklisted props
  const cleanRest = {...rest};
  delete (cleanRest as any).decoding;
  delete (cleanRest as any).ref;
  delete (cleanRest as any).srcSet;
  delete (cleanRest as any).style;

  const urlBuilder = imageUrlBuilder({projectId, dataset}).image({
    _ref: src,
    crop,
    hotspot,
  } as SanityImageSource);

  // Generate srcset + sizes
  const srcSetSizes = generateSizes(BREAKPOINTS, sizes);
  const srcSet = generateSrcSet(urlBuilder, BREAKPOINTS, {quality});

  // Determine image aspect ratio (factoring in any potential crop)
  let aspectRatio: number | undefined;
  if (height && width) {
    const multiplierWidth = 1 - (crop?.left || 0) - (crop?.right || 0);
    const multiplierHeight = 1 - (crop?.bottom || 0) - (crop?.top || 0);
    aspectRatio = (width * multiplierWidth) / (height * multiplierHeight);
  }

  let urlDefault = urlBuilder.auto('format');

  // Apply blur option
  if (options?.blur) {
    urlDefault = urlDefault.blur(options.blur);
  }

  const finalUrl = urlDefault.quality(quality).url();

  return (
    <img
      {...cleanRest}
      decoding="async"
      sizes={srcSetSizes}
      src={finalUrl}
      srcSet={srcSet}
      alt={alt}
      style={{
        ...(layout === 'fill' && {
          bottom: 0,
          height: '100%',
          left: 0,
          objectFit,
          position: 'absolute',
          right: 0,
          top: 0,
          width: '100%',
        }),
        ...(layout === 'responsive' && {
          aspectRatio: aspectRatio?.toString(),
          width: '100%',
        }),
      }}
    />
  );
}
