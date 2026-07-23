import {defineField, defineType} from 'sanity'
import {VideoIcon} from '@sanity/icons/Video'
import {
  bodyField,
  descriptionField,
  formatPreviewDate,
  headerImageField,
  publishedAtField,
  publishedAtOrderings,
  slugField,
  titleField,
  updatedAtField,
} from './shared'

// Single source of truth for the appearance kinds: drives both the Studio
// radio list and the preview subtitle label (so e.g. "Live Stream" reads
// correctly instead of a naive capitalize of the stored value).
const APPEARANCE_TYPES = [
  {title: 'Podcast', value: 'podcast'},
  {title: 'Video', value: 'video'},
  {title: 'Live Stream', value: 'livestream'},
  {title: 'Talk', value: 'talk'},
  {title: 'Presentation', value: 'presentation'},
]
const APPEARANCE_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  APPEARANCE_TYPES.map((t) => [t.value, t.title]),
)

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
        list: APPEARANCE_TYPES,
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
    headerImageField,
    bodyField,
  ],
  preview: {
    select: {
      title: 'title',
      date: 'publishedAt',
      type: 'appearanceType',
      media: 'headerImage',
    },
    prepare({title, date, type, media}) {
      const label = type ? (APPEARANCE_TYPE_LABELS[type] ?? type) : undefined
      const subtitle = [label, formatPreviewDate(date)]
        .filter(Boolean)
        .join(' · ')
      return {title, subtitle: subtitle || undefined, media}
    },
  },
})
