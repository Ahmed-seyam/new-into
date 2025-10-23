import {sanityFetch} from '~/lib/sanity';

export async function useSanityQuery<T>({query, params = {}}) {
  const singleLineQuery = query.replace(/\n/g, ' ');
  return sanityFetch<T>(singleLineQuery, params);
}
