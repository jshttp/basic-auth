import { describe, test } from 'vitest';
import { parse } from './index.js';

describe('parse', () => {
  test('basic auth header', async ({ bench }) => {
    await bench('basic auth header', () => {
      const header = 'Basic dGVzdDpwYXNzd29yZA=='; // "test:password" in base64
      parse(header);
    }).run();
  });

  test('basic auth header with extra whitespace', async ({ bench }) => {
    await bench('basic auth header with extra whitespace', () => {
      const header = '   Basic   dGVzdDpwYXNzd29yZA==   '; // "test:password" in base64 with extra whitespace
      parse(header);
    }).run();
  });

  test('invalid basic auth header', async ({ bench }) => {
    await bench('invalid basic auth header', () => {
      const header = 'Basic invalidbase64'; // Invalid base64 string
      parse(header);
    }).run();
  });

  test('non-basic auth header', async ({ bench }) => {
    await bench('non-basic auth header', () => {
      const header = 'Bearer sometoken'; // Not a basic auth header
      parse(header);
    }).run();
  });
});
