import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'p4s7nr9h',
  dataset: 'production',
  useCdn: false, // set to true if you want cached responses
  apiVersion: '2025-10-16', // YYYY-MM-DD
})
