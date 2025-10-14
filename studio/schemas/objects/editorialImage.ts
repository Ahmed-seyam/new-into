import {EarthGlobeIcon} from '@sanity/icons';

export default {
  title: 'Editorial Image',
  name: 'editorialImage',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    // Title
    {
      name: 'image',
      title: 'Image',
      type: 'imageWithProductHotspots',
    },
    {
      title: 'Tags',
      description:
        'Add the filter tags. Grab the filter link from the live site',
      type: 'array',
      name: 'filters',
      of: [{type: 'linkFilter'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
};
