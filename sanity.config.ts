import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/sanity/schemaTypes'
import {codeInput} from '@sanity/code-input'
import {dataset, projectId} from './src/sanity/lib/config'

export default defineConfig({
  name: 'default',
  title: 'portfolio',

  projectId,
  dataset,

  plugins: [codeInput(), structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
