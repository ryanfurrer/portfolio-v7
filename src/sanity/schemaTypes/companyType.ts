import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'

/**
 * A company / brand a project was done for. Projects reference one of
 * these (or none, for personal work); the `/work/[tag]` hub pages are
 * built from these documents, so the logo/url/description here is what
 * lets a hub show real branding rather than just a name.
 */
export const companyType = defineType({
  name: 'company',
  title: 'Company',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      type: 'url',
      title: 'Website',
    }),
    defineField({
      name: 'logo',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'url', media: 'logo'},
  },
})
