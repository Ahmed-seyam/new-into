import React from 'react';

import {DocumentVideoIcon, PackageIcon} from '@sanity/icons';

export default {
  name: 'module.video',
  title: 'Video',
  type: 'object',
  icon: DocumentVideoIcon,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Video file',
      name: 'video',
      type: 'mux.video',
    },
    {
      title: 'Filters',
      type: 'array',
      name: 'filters',
      of: [{type: 'linkFilter'}],
    },
    // Product hotspots
    {
      name: 'productHotspots',
      title: 'Hotspots',
      type: 'productHotspots',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'video',
    },
  },
};
