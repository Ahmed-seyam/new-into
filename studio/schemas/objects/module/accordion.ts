import { StackCompactIcon } from '@sanity/icons'
import pluralize from 'pluralize'
import blocksToText from '../../../utils/blocksToText'

export default {
  name: 'module.accordion',
  title: 'Accordion',
  type: 'object',
  icon: StackCompactIcon,
  fields: [
    {
      name: 'groups',
      title: 'Groups',
      type: 'array',
      of: [
        {
          name: 'group',
          title: 'Group',
          type: 'object',
          icon: false,
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'body',
              title: 'Body',
              type: 'array',
              of: [
                {
                  type: 'block',
                  lists: [],
                  styles: [],
                  marks: {
                    annotations: [
                      { name: 'annotationLinkEmail', type: 'annotationLinkEmail' },
                      { name: 'annotationLinkInternal', type: 'annotationLinkInternal' },
                      { name: 'annotationLinkExternal', type: 'annotationLinkExternal' },
                    ],
                    decorators: [
                      { title: 'Italic', value: 'em' },
                      { title: 'Strong', value: 'strong' },
                    ],
                  },
                },
              ],
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              body: 'body',
              title: 'title',
            },
            prepare(selection: { body?: any[]; title?: string }) {
              const { body, title } = selection
              return {
                subtitle: body ? blocksToText(body) : '',
                title,
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      groupCount: 'groups.length',
    },
    prepare(selection: { groupCount?: number }) {
      const { groupCount } = selection
      return {
        subtitle: 'Accordion',
        title: groupCount ? pluralize('group', groupCount, true) : 'No groups',
      }
    },
  },
}
