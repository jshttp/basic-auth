import { describe, test } from 'vitest';
import { format } from './index.js';

describe('format', () => {
  test('format with simple credentials', async ({ bench }) => {
    await bench('format with simple credentials', () => {
      const credentials = { name: 'user', pass: 'password' };
      format(credentials);
    }).run();
  });

  test('format with long credentials', async ({ bench }) => {
    await bench('format with long credentials', () => {
      const credentials = {
        name: 'verylongusernameforbasicauth',
        pass: 'verylongpasswordwithmanycharactersforbenchmark',
      };
      format(credentials);
    }).run();
  });

  test('format with unicode credentials', async ({ bench }) => {
    await bench('format with unicode credentials', () => {
      const credentials = { name: 'jürgen', pass: 'pässwörd' };
      format(credentials);
    }).run();
  });

  test('format with special characters', async ({ bench }) => {
    await bench('format with special characters', () => {
      const credentials = { name: 'user@domain', pass: 'p@ss!word#123' };
      format(credentials);
    }).run();
  });
});
