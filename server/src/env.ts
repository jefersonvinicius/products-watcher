import dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();

assert.strictEqual(typeof process.env.SES_SECRET_ACCESS_KEY, 'string');
assert.strictEqual(typeof process.env.SES_ACCESS_KEY_ID, 'string');

export const ENV = {
  SES_SECRET_ACCESS_KEY: process.env.SES_SECRET_ACCESS_KEY!,
  SES_ACCESS_KEY_ID: process.env.SES_ACCESS_KEY_ID!,
};
