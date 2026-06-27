import {defineCliConfig} from 'sanity/cli'
import {dataset, projectId} from './src/sanity/lib/config'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
    appId: 'exz0b9v1m53k4osb36lvn6f4',
  },
})
