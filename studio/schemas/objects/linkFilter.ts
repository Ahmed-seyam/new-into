import {EarthGlobeIcon} from '@sanity/icons';

export default {
  title: 'Filter Link',
  name: 'linkFilter',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    // Title
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    // URL
    // {
    //   name: 'url',
    //   title: 'URL',
    //   type: 'url',
    //   validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    // },
    // Filter type
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {
            title: 'Vendor',
            value: 'vendor',
          },
          {
            title: 'Category',
            value: 'category',
          },
          {
            title: 'Color',
            value: 'color',
          },
          {
            title: 'Material',
            value: 'material',
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      // url: 'url',
    },
    // prepare(selection) {
    //   const {title, url} = selection;

    //   let subtitle = [];
    //   if (url) {
    //     subtitle.push(`→ ${url}`);
    //   }

    //   return {
    //     // media: image,
    //     subtitle: subtitle.join(' '),
    //     title,
    //   };
    // },
  },
};
