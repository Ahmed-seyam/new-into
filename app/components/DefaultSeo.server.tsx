import groq from 'groq';
import {sanityFetch} from '~/lib/sanity';
import type {MetaFunction} from 'react-router';

type SeoData = {
  description?: string;
  title: string;
};

// This should be called in your root loader
export async function getSeoDefaults(): Promise<SeoData> {
  const seo = await sanityFetch<SeoData>(QUERY_SANITY);
  return seo || {title: 'INTO Archive', description: ''};
}

const QUERY_SANITY = groq`
  *[_type == 'settings'][0].seo {
    title,
    description
  }
`;

// Helper function to merge default SEO with page-specific SEO
export function mergeSeo(
  defaults: SeoData,
  pageMeta?: {
    title?: string;
    description?: string;
  },
) {
  return {
    title: pageMeta?.title
      ? `${pageMeta.title} · ${defaults.title}`
      : defaults.title,
    description: pageMeta?.description || defaults.description,
  };
}
