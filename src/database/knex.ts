import createKnex from 'knex';

export const knex = createKnex({
  client: 'better-sqlite3', // or 'better-sqlite3'
  connection: {
    filename: process.env.DB_FILENAME || '',
  },
  migrations: {
    tableName: 'migrations',
    directory: './src/database/migrations',
  },
});
