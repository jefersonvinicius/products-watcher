import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('terms', (table) => {
      table.increments('id');
      table.string('text', 100).notNullable().unique();
    })
    .createTable('products', (table) => {
      table.increments('id');
      table.string('url', 3000).notNullable();
      table.string('name', 2000).notNullable();
      table.bigInteger('price').notNullable();
      table.datetime('created_at').defaultTo(new Date());
      table.integer('term_id').unsigned();
      table.foreign('term_id').references('terms.id');
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('products').dropTable('terms');
}
