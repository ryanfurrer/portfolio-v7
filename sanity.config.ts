import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {UserIcon} from '@sanity/icons'
import {schemaTypes} from './src/sanity/schemaTypes'
import {codeInput} from '@sanity/code-input'
import {dataset, projectId} from './src/sanity/lib/config'

export default defineConfig({
  name: 'default',
  title: 'portfolio',

  projectId,
  dataset,

  plugins: [
    codeInput(),
    structureTool({
      // `about` is a singleton: surface it as one fixed document instead
      // of a create-able list, and omit it from the type list below so a
      // second one can't be made. Everything else is a normal list.
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
})
