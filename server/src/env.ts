import dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();

assert.deepStrictEqual(typeof process.env.EMAIL, 'string');
assert.deepStrictEqual(typeof process.env.EMAIL_PASSWORD, 'string');

export const ENV = {
  EMAIL: process.env.EMAIL!,
  PASSWORD: process.env.EMAIL_PASSWORD!,
};
