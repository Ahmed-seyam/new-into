import {defineCliConfig} from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'p4s7nr9h',
    dataset: 'production',
  },

  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    appId: 'uo2yq72pu3q2o6854ha3isdt',
    autoUpdates: true,
  },
});
