import {defineField, defineType} from 'sanity'
import {VideoIcon} from '@sanity/icons'
import {
  bodyField,
  descriptionField,
  formatPreviewDate,
  headerImageField,
  ogImageField,
  publishedAtField,
  publishedAtOrderings,
  slugField,
  titleField,
  updatedAtField,
} from './shared'

export const appearanceType = defineType({
  name: 'appearance',
  title: 'Appearance',
  type: 'document',
  icon: VideoIcon,
  orderings: publishedAtOrderings,
  fields: [
    titleField,
    slugField,
    publishedAtField,
    updatedAtField,
    defineField({
      name: 'appearanceType',
      type: 'string',
      title: 'Appearance Type',
      options: {
        list: [
          {title: 'Podcast', value: 'podcast'},
          {title: 'Video', value: 'video'},
          {title: 'Talk', value: 'talk'},
          {title: 'Presentation', value: 'presentation'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'externalUrl',
      type: 'url',
      title: 'External URL',
      validation: (rule) =>
        rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),
    descriptionField,
    ogImageField,
    headerImageField,
    bodyField,
  ],
  preview: {
    select: {
      title: 'title',
      date: 'publishedAt',
      type: 'appearanceType',
      media: 'ogImage',
    },
    prepare({title, date, type, media}) {
      const label = type
        ? type.charAt(0).toUpperCase() + type.slice(1)
        : undefined
      const subtitle = [label, formatPreviewDate(date)]
        .filter(Boolean)
        .join(' · ')
      return {title, subtitle: subtitle || undefined, media}
    },
  },
})
