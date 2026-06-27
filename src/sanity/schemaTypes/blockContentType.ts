import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Canonical rich-text body type, referenced by every content
 * document via `type: 'blockContent'`. Previously each document
 * inlined this same array definition, so they could (and did) drift
 * apart — this keeps the body identical everywhere.
 */
export const blockContentType = defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    defineArrayMember({type: 'block'}),
    defineArrayMember({type: 'code'}),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }),
      ],
    }),
  ],
})
