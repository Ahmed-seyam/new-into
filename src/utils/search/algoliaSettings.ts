import algoliasearch from 'algoliasearch/lite';
import algoConfig from '../../../algolia.config.json';
export const indexName = algoConfig.prefix + 'products';
export const appId = algoConfig.appId;
export const apiKey = algoConfig.appKey;
export const searchClient = algoliasearch(appId, apiKey);
