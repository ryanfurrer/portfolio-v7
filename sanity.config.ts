import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {CogIcon} from '@sanity/icons/Cog'
import {UserIcon} from '@sanity/icons/User'
import {schemaTypes} from './src/sanity/schemaTypes'
import {codeInput} from '@sanity/code-input'
import {dataset, projectId} from './src/sanity/lib/config'
import {publishWithUpdatedAt} from './src/sanity/lib/publishWithUpdatedAt'

export default defineConfig({
  name: 'default',
  title: 'portfolio',

  projectId,
  dataset,

  plugins: [
    codeInput(),
    structureTool({
      // `about` and `uses` are singletons: surface each as one fixed
      // document instead of a create-able list, and omit them from the
      // type list below so a second one can't be made. Everything else is
      // a normal list.
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('About')
              .id('about')
              .icon(UserIcon)
              .child(
                S.document()
                  .schemaType('about')
                  .documentId('about')
                  .title('About'),
              ),
            S.listItem()
              .title('Uses')
              .id('uses')
              .icon(CogIcon)
              .child(
                S.document()
                  .schemaType('uses')
                  .documentId('uses')
                  .title('Uses'),
              ),
            S.divider(),
            S.documentTypeListItem('post').title('Posts'),
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('appearance').title('Appearances'),
            S.documentTypeListItem('now').title('Now'),
            S.documentTypeListItem('company').title('Companies'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Stamp `updatedAt` on publish, but only for already-published docs
    // (so new entries don't get it). See publishWithUpdatedAt.
    actions: (prev) =>
      prev.map((action) =>
        action.action === 'publish' ? publishWithUpdatedAt(action) : action,
      ),
  },
})
