import {defineArrayMember, defineField, defineType} from 'sanity'
import {ClockIcon} from '@sanity/icons'
import {
  bodyField,
  formatPreviewDate,
  publishedAtField,
  publishedAtOrderings,
} from './shared'

/**
 * A "Now" entry — one per update. The newest renders as the live "Now"
 * card on /now; older ones become the "Previously" cards, so the page
 * keeps a running history (see the ruled-notebook design in now/index).
 *
 * `media` is the Watching / Reading / Playing / Obsessed-with list. Each
 * value is a single rich-text line so it can carry inline links (the
 * design relies on one-liners, so headings/lists are intentionally off).
 */
export const nowType = defineType({
  name: 'now',
  title: 'Now',
  type: 'document',
  icon: ClockIcon,
  orderings: publishedAtOrderings,
  fields: [
    publishedAtField,
    bodyField,
    defineField({
      name: 'media',
      title: 'Media',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'mediaRow',
          title: 'Row',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              description: 'e.g. Watching, Reading, Playing, Obsessed with',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'block',
                  styles: [{title: 'Normal', value: 'normal'}],
                  lists: [],
                  marks: {
                    decorators: [
                      {title: 'Strong', value: 'strong'},
                      {title: 'Emphasis', value: 'em'},
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [
                          {
                            name: 'href',
                            type: 'url',
                            title: 'URL',
                            validation: (rule) =>
                              rule.uri({scheme: ['http', 'https', 'mailto']}),
                          },
                        ],
                      },
                    ],
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'label'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {date: 'publishedAt'},
    prepare({date}) {
      return {title: formatPreviewDate(date) || 'Now', subtitle: 'Now entry'}
    },
  },
})
