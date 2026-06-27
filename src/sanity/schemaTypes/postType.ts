import {defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'
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

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  orderings: publishedAtOrderings,
  fields: [
    titleField,
    slugField,
    publishedAtField,
    updatedAtField,
    descriptionField,
    ogImageField,
    headerImageField,
    bodyField,
  ],
  preview: {
    select: {title: 'title', date: 'publishedAt', media: 'ogImage'},
    prepare({title, date, media}) {
      return {title, subtitle: formatPreviewDate(date), media}
    },
  },
})
