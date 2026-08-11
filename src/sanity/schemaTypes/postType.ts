import { defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'
import { MarkdownPostInput } from '../components/MarkdownPostInput'
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
  components: { input: MarkdownPostInput },
  preview: {
    select: { title: 'title', date: 'publishedAt', media: 'headerImage' },
    prepare({ title, date, media }) {
      return { title, subtitle: formatPreviewDate(date), media }
    },
  },
})
