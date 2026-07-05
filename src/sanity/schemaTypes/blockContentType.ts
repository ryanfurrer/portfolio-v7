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
    // Edit callouts/embeds in a full dialog, not the default popover. For a
    // block-level object inside Portable Text, the editor reads the modal option
    // from the array-member reference (the point of use), NOT from the object
    // type's own `options` — otherwise the popover dismisses itself when a field
    // interaction (radio select, URL commit) moves focus, closing it early.
    defineArrayMember({type: 'callout', options: {modal: {type: 'dialog'}}}),
    defineArrayMember({type: 'youtube', options: {modal: {type: 'dialog'}}}),
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
