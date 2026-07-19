import {defineArrayMember, defineField, defineType} from 'sanity'
import {InfoOutlineIcon} from '@sanity/icons'
import {linkAnnotation} from './shared'

/**
 * Callout — a labelled, colour-coded aside embedded inside `blockContent`.
 * Mirrors the front-end `Callout.astro` variants. The body is its own
 * (deliberately simple) rich-text array so authors get bold/italic/links
 * without being able to nest images, code, or callouts inside a callout.
 */
export const calloutType = defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  icon: InfoOutlineIcon,
  // NOTE: the dialog modal is configured on the array-member reference in
  // blockContentType (the point of use), not here — a Portable Text block
  // object reads its modal presentation from the array, not the object type.
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      initialValue: 'info',
      options: {
        list: [
          {title: 'Note (info)', value: 'info'},
          {title: 'Warning', value: 'warning'},
          {title: 'Caution', value: 'caution'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description:
        'Optional — overrides the default label (e.g. "Note", "Warning") for this callout.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [linkAnnotation],
          },
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {variant: 'variant', title: 'title', body: 'body'},
    prepare({variant, title, body}) {
      const label = title || (variant ? variant[0].toUpperCase() + variant.slice(1) : 'Callout')
      const firstLine = body?.[0]?.children
        ?.map((child: {text?: string}) => child.text)
        .join('')
      return {title: `Callout · ${label}`, subtitle: firstLine}
    },
  },
})
