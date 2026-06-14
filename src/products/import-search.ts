import { knex } from '../database/knex';
import logger, { benchmark } from '../logging';
import { SearchResult } from '../search/search';
import { parsePrice } from './parser';

export async function importSearchResult(searchResult: SearchResult) {
  logger.info(`Importing results for "${searchResult.term}"`);

  const start = benchmark.start();
  await knex('terms')
    .insert({
      text: searchResult.term,
    })
    .onConflict()
    .ignore();

  const term = await knex('terms').where('text', searchResult.term).first();

  const productSearchResult = searchResult.results.filter((entry) => !!entry.product);

  const datetime = new Date();
  const products = productSearchResult.map((result) => {
    return {
      url: result.url || 'N/A',
      name: result.product?.name || 'N/A',
      price: parsePrice(result.product?.price) || 0,
      term_id: term.id,
      created_at: datetime,
    };
  });
  logger.info({ products }, `Inserting ${products.length} products`);

  await knex('products').insert(products);

  const duration = benchmark.end(start);
  logger.info({ duration }, `Import finished! ${products.length} products inserted in ${benchmark.format(duration)}`);
}
