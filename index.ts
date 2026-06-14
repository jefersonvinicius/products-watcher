import { SearchResult } from './src/search/search';
import data from './data/result.json';
import { importSearchResult } from './src/products/import-search';
import { knex } from './src/database/knex';

async function run() {
  const searchResult = { term: 'Playstation 5', results: data.web.results } as SearchResult;
  await importSearchResult(searchResult);
  await knex.destroy();
}

run();
