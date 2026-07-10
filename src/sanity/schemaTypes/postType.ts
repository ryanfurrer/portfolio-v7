import {defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'
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
    headerImageField,
    bodyField,
  ],
  preview: {
    select: {title: 'title', date: 'publishedAt', media: 'headerImage'},
    prepare({title, date, media}) {
      return {title, subtitle: formatPreviewDate(date), media}
    },
  },
})
