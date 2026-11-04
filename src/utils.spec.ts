import { describe, expect, it } from 'vitest';
import { parseBasic } from './utils.js';

describe('parseBasic', () => {
  it.each([
    ['Basic Og==', 'Og=='],
    ['  bAsIc   Zm9vOmI=  ', 'Zm9vOmI='],
    ['Basic Zm9vOg', 'Zm9vOg'],
    ['Basic Zm9vOmI', 'Zm9vOmI'],
    ['Basic Zm9vOmJh', 'Zm9vOmJh'],
    ['Basic 77+/Og==', '77+/Og=='],
  ])('extracts %j', (header, encoded) => {
    expect(parseBasic(header)).toBe(encoded);
  });

  it.each([
    '',
    'Basic ',
    'Basic ==== ',
    'Basic Y',
    'Basic Zm9vOg=',
    'Basic Zm9vOmI==',
    'Basic Zm9vOmJh====',
    'Basic Zm9vOg==' + '='.repeat(100_000),
    'Basic\tOg==',
    '\tBasic Og==',
    'Basic Og==\n',
    'Basic Og==\r\n',
    'Basic Og==\t',
    'Basic Og== extra',
    'Bearer Og==',
  ])('rejects invalid header %#', (header) => {
    expect(parseBasic(header)).toBeUndefined();
  });
});
