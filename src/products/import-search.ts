import { knex } from '../database/knex';
import { SearchResult } from '../search/search';

export async function importSearchResult(searchResult: SearchResult) {
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
      price: result.product?.price ? parseInt(result.product?.price, 10) : 0,
      term_id: term.id,
      created_at: datetime,
    };
  });

  await knex('products').insert(products);
}
