import { describe, bench } from 'vitest';
import { parse } from './index';

describe('parse', () => {
  bench('basic auth header', () => {
    const header = 'Basic dGVzdDpwYXNzd29yZA=='; // "test:password" in base64
    parse(header);
  });

  bench('basic auth header with extra whitespace', () => {
    const header = '   Basic   dGVzdDpwYXNzd29yZA==   '; // "test:password" in base64 with extra whitespace
    parse(header);
  });

  bench('invalid basic auth header', () => {
    const header = 'Basic invalidbase64'; // Invalid base64 string
    parse(header);
  });

  bench('non-basic auth header', () => {
    const header = 'Bearer sometoken'; // Not a basic auth header
    parse(header);
  });
});
