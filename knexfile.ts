import type { Knex } from 'knex';

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'better-sqlite3', // or 'better-sqlite3'
    connection: {
      filename: process.env.DB_FILENAME || '',
    },
    migrations: {
      tableName: 'migrations',
      directory: './src/database/migrations',
    },
  },
};

module.exports = config;
