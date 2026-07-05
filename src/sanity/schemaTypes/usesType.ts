import {defineType, defineField, defineArrayMember} from 'sanity'
import {CogIcon} from '@sanity/icons'
import {descriptionField, titleField} from './shared'

/**
 * The Uses page — the gear/software I use. A singleton (exactly one exists,
 * enforced by the custom Studio structure in sanity.config.ts). Content is a
 * list of categories (e.g. Hardware, Software), each holding a list of items.
 * Categories are an array rather than fixed fields so new sections can be added
 * and reordered in the Studio without a schema change.
 */
export const usesType = defineType({
  name: 'uses',
  title: 'Uses',
  type: 'document',
  icon: CogIcon,
  fields: [
    titleField,
    descriptionField,
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'usesCategory',
          title: 'Category',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'usesItem',
                  title: 'Item',
                  fields: [
                    defineField({
                      name: 'name',
                      title: 'Name',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      rows: 2,
                    }),
                    defineField({
                      name: 'url',
                      title: 'URL',
                      type: 'url',
                    }),
                  ],
                  preview: {
                    select: {title: 'name', subtitle: 'description'},
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'title', items: 'items'},
            prepare({title, items}) {
              const count = Array.isArray(items) ? items.length : 0
              return {
                title: title || 'Category',
                subtitle: `${count} item${count === 1 ? '' : 's'}`,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Uses'}
    },
  },
})
