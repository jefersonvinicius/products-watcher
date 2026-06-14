import logger, { benchmark } from '../logging';
import type { BraveSearchResponse } from './brave-types';

export type SearchResult = {
  term: string;
  results: BraveSearchResponse['web']['results'];
};

export async function search(term: string): Promise<SearchResult> {
  logger.info({ term }, `Searching for term "${term}"`);

  const start = benchmark.start();
  const url = new URL('https://api.search.brave.com/res/v1/web/search');
  url.searchParams.set('q', term);
  url.searchParams.set('count', '20');
  url.searchParams.set('country', 'BR');
  url.searchParams.set('search_lang', 'pt-br');
  url.searchParams.set('result_filter', ['web'].join(','));

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY || '',
    },
  });
  const duration = benchmark.end(start);
  logger.info({ term, duration }, `Search for term "${term}" finished. It took ${benchmark.format(duration)}`);

  if (!response.ok) {
    throw new Error(`Search failed with status ${response.status}`, { cause: response });
  }

  const data = (await response.json()) as BraveSearchResponse;
  return { term, results: data.web.results };
}
