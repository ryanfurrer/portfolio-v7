import {defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'
import {bodyField, descriptionField, titleField} from './shared'

/**
 * The About page. A singleton — exactly one of these exists (enforced by
 * the custom Studio structure in sanity.config.ts, which opens it as a
 * single fixed document rather than a create-able list). The page's
 * Signature flourish stays in the template; only the prose lives here.
 */
export const aboutType = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  icon: UserIcon,
  fields: [titleField, descriptionField, bodyField],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'About'}
    },
  },
})
