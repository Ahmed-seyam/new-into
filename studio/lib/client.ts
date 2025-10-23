import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'p4s7nr9h',
  dataset: 'production',
  useCdn: false, // set to true if you want cached responses
  token: "skzu462dslyFyCPMS4j5yynDzQMAcj7ySh5kmBzokZk7rgmMfA1tEb3steY8Z9KTwzWpEeHmuUojcgQOmYM7G0mHwRXlcw9sy1Bwreqqv8kuHXSdM5JvMSPpDyhAZS8MUd8Wt6e5P0yAKUctzs7Unkjh70yeMSxrJ5UdqE9RAELRAmjAQTjR",
  apiVersion: '2025-10-16', // YYYY-MM-DD
})
