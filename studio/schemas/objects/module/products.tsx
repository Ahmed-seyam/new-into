import pluralize from 'pluralize';

import {TagIcon} from '@sanity/icons';

export default {
  name: 'module.products',
  title: 'Products',
  type: 'object',
  icon: TagIcon,
  fields: [
    // Modules (products)
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'modules',
      title: 'Products',
      type: 'array',
      of: [{type: 'module.product'}],
      validation: (Rule) => Rule.required().min(2),
    },
    // Layout
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      initialValue: 'card',
      options: {
        direction: 'horizontal',
        layout: 'radio',
        list: [
          {
            title: 'Grid',
            value: 'grid',
          },
          {
            title: 'Carousel',
            value: 'carousel',
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    // Filters
    {
      title: 'Filters',
      type: 'array',
      name: 'filters',
      of: [{type: 'linkFilter'}],
    },
  ],
  preview: {
    select: {
      productCount: 'modules.length',
    },
    prepare(selection) {
      const {productCount} = selection;
      return {
        subtitle: 'Products',
        title: productCount
          ? pluralize('product', productCount, true)
          : 'No products',
      };
    },
  },
};
