import {createClient} from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'n12d4ngk',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// Export query helper
export async function sanityFetch<T = any>(query: string, params = {}) {
  return sanityClient.fetch<T>(query, params);
}
