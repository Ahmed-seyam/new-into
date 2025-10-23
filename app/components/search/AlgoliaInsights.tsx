/**
 * Mount Algolia insights middleware
 * https://www.algolia.com/doc/api-reference/widgets/insights/react-hooks/?client=js
 */
import {createInsightsMiddleware} from 'instantsearch.js/es/middlewares';
import {useEffect} from 'react';
import {useInstantSearch} from 'react-instantsearch';
import algoConfig from '~/../algolia.config.json';

export function Insights() {
  const {addMiddlewares} = useInstantSearch();

  useEffect(() => {
    const insightsClient = (window as any).aa;
    insightsClient('init', {
      appId: algoConfig.appId,
      apiKey: algoConfig.appKey,
      useCookie: true,
    });
    const middleware = createInsightsMiddleware({
      insightsClient,
    });

    return addMiddlewares(middleware);
  }, [addMiddlewares]);

  return null;
}