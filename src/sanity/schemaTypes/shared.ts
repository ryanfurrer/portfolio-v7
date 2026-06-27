import {defineField} from 'sanity'

/**
 * Field definitions shared across every content document
 * (post, project, appearance). Keeping them here means a new content
 * type is "these shared fields + its own specifics" rather than a
 * copy of ~90 lines, and a change to e.g. the description rules
 * applies everywhere at once.
 */

export const titleField = defineField({
  name: 'title',
  type: 'string',
  validation: (rule) => rule.required(),
})

export const slugField = defineField({
  name: 'slug',
  type: 'slug',
  options: {source: 'title'},
  validation: (rule) => rule.required(),
})

export const publishedAtField = defineField({
  name: 'publishedAt',
  title: 'Published At',
  type: 'datetime',
  initialValue: () => new Date().toISOString(),
  validation: (rule) => rule.required(),
})

export const updatedAtField = defineField({
  name: 'updatedAt',
  title: 'Updated At',
  type: 'datetime',
  initialValue: () => new Date().toISOString(),
})

export const descriptionField = defineField({
  name: 'description',
  title: 'Description',
  type: 'text',
  validation: (rule) => [
    rule.required(),
    rule.max(160).warning('Description should be 160 characters or less'),
  ],
})

export const ogImageField = defineField({
  name: 'ogImage',
  title: 'OG Image',
  type: 'image',
  validation: (rule) => rule.required(),
})

export const headerImageField = defineField({
  name: 'headerImage',
  title: 'Header Image',
  type: 'image',
})

export const bodyField = defineField({
  name: 'body',
  title: 'Body',
  type: 'blockContent',
})

/** Studio sort options shared by every content type. */
export const publishedAtOrderings = [
  {
    title: 'Published, newest first',
    name: 'publishedAtDesc',
    by: [{field: 'publishedAt', direction: 'desc' as const}],
  },
  {
    title: 'Published, oldest first',
    name: 'publishedAtAsc',
    by: [{field: 'publishedAt', direction: 'asc' as const}],
  },
]

/** Human-friendly date for Studio preview subtitles. */
export const formatPreviewDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : undefined
