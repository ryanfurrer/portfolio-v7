import {defineCliConfig} from 'sanity/cli'
import {dataset, projectId} from './src/sanity/lib/config'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
})
