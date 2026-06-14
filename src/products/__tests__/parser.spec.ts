import { describe, expect, it } from 'vitest';
import { parsePrice } from '../parser';

describe('parsePrice', () => {
  it.each([
    { value: '3999.99', expected: 399999 },
    { value: '3999.00', expected: 399900 },
    { value: '3999', expected: 399900 },
    { value: 400, expected: 400 },
    { value: {}, expected: null },
  ])('should parse $value to $expected', ({ value, expected }) => {
    expect(parsePrice(value)).toBe(expected);
  });
});
