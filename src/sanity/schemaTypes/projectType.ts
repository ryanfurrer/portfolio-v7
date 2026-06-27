import {defineField, defineType} from 'sanity'
import {FolderIcon} from '@sanity/icons'
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

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: FolderIcon,
  orderings: publishedAtOrderings,
  fields: [
    titleField,
    slugField,
    publishedAtField,
    updatedAtField,
    defineField({
      name: 'projectUrl',
      type: 'url',
      title: 'Live Site URL',
    }),
    defineField({
      name: 'githubUrl',
      type: 'url',
      title: 'GitHub Repo URL',
    }),
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
