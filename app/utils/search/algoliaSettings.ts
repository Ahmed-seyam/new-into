// algoliaSettings.ts
import algoliasearch from 'algoliasearch';
import algoConfig from '../../../algolia.config.json';

export const indexName = algoConfig.prefix + 'products';
export const appId = algoConfig.appId;
export const apiKey = algoConfig.appKey;
export const searchClient: any = algoliasearch(appId, apiKey);
