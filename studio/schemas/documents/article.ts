import {DocumentIcon} from '@sanity/icons';

import {validateSlug} from '../../utils/validateSlug';

export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {
      name: 'theme',
      title: 'Theme',
    },
    {
      default: true,
      name: 'editorial',
      title: 'Editorial',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    // Title
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    // Slug
    {
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: validateSlug,
    },
    // Color theme
    {
      name: 'blog',
      title: 'Blog',
      type: 'reference',
      to: [{type: 'blog'}],
      group: 'editorial',
    },
    // Body
    {
      name: 'body',
      title: 'Body',
      type: 'body',
      group: 'editorial',
    },
    {
      name: 'credits',
      title: 'Credits',
      type: 'body',
      group: 'editorial',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'editorialImage'}],
      group: 'editorial',
    },
    // SEO
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
      group: 'seo',
    },
  ],
  preview: {
    select: {
      active: 'active',
      seoImage: 'seo.image',
      title: 'title',
    },
    prepare(selection) {
      const {seoImage, title} = selection;

      return {
        media: seoImage,
        title,
      };
    },
  },
};
