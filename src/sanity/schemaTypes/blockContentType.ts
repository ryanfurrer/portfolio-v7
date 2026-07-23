import {defineArrayMember, defineField, defineType} from 'sanity'
import {linkAnnotation} from './shared'

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
    // The body uses Sanity's default block, but with an explicit link
    // annotation so links can carry `openInNewTab`. Overriding `marks` means
    // the default decorators would be dropped, so they're re-declared here;
    // `styles` and `lists` are omitted and keep their defaults.
    defineArrayMember({
      type: 'block',
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'},
          {title: 'Underline', value: 'underline'},
          {title: 'Strike', value: 'strike-through'},
        ],
        annotations: [linkAnnotation],
      },
    }),
    defineArrayMember({type: 'code'}),
    // Edit callouts in a full dialog, not the default popover. For a block-level
    // object inside Portable Text, the editor reads the modal option from the
    // array-member reference (the point of use), NOT from the object type's own
    // `options` — otherwise the popover dismisses itself when a field interaction
    // (e.g. selecting the variant) moves focus, closing it early.
    defineArrayMember({type: 'callout', options: {modal: {type: 'dialog'}}}),
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
    defineArrayMember({type: 'youtube'}),
    defineArrayMember({type: 'video'}),
  ],
})
