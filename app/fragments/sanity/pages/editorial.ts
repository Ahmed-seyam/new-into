import groq from 'groq';
import {PORTABLE_TEXT} from '../portableText/portableText';
import {SEO} from '../seo';
import {IMAGE_WITH_PRODUCT_HOTSPOTS} from '../imageWithProductHotspots';

export const EDITORIAL = groq`
slug{
  current
},
  body[]{
    ${PORTABLE_TEXT}
  },
  credits[]{
    ${PORTABLE_TEXT}
  },
  images[]{
    image {
      ${IMAGE_WITH_PRODUCT_HOTSPOTS}
    },
    filters[]{
        ...,
      },
      
  },
  ${SEO},
  title,
`;
