import { knex } from '../database/knex';
import logger, { benchmark } from '../logging';
import { importSearchResult } from '../products/import-search';
import { search } from '../search/search';

type SearchTermsParams = {
  offset: number;
  limit: number;
};

export async function searchTermsUseCase(params: SearchTermsParams) {
  const { offset, limit } = params;
  const terms = await knex('terms').offset(offset).limit(limit);
  for (const term of terms) {
    try {
      const start = benchmark.start();
      const searchResult = await search(term.text);
      await importSearchResult(searchResult);
      const duration = benchmark.end(start);
      logger.info({ term, duration }, `Successfully processed term "${term.text}" in ${benchmark.format(duration)}`);
    } catch (error) {
      logger.error({ err: error, term }, `Failed to process term "${term.text}"`);
    }
  }
}
