import groq from 'groq';

import {PRODUCT_HOTSPOT} from '../productHotspot';

export const MODULE_VIDEO = groq`
  video {
    asset->{...,},
  },
  filters[]{...,},
  productHotspots[] {
    _key,
    ${PRODUCT_HOTSPOT}
  }
`;
