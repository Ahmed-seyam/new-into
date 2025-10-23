import groq from 'groq';
import {COLOR_THEME} from '../colorTheme';
import {PORTABLE_TEXT} from '../portableText/portableText';
import {SEO} from '../seo';
import {PRODUCT_HOTSPOT} from '../productHotspot';

export const EDITORIAL_INDEX = groq`
  body[]{
    ${PORTABLE_TEXT}
  },
  colorTheme->{
    ${COLOR_THEME}
  },
  images[]{
    ${PRODUCT_HOTSPOT}
  },
  tags[]{
    ...,
  },
  ${SEO},
  title,
`;
