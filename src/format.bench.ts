import { bench, describe } from 'vitest';
import { format } from './index';

describe('format', () => {
  bench('format with simple credentials', () => {
    const credentials = { name: 'user', pass: 'password' };
    format(credentials);
  });

  bench('format with long credentials', () => {
    const credentials = {
      name: 'verylongusernameforbasicauth',
      pass: 'verylongpasswordwithmanycharactersforbenchmark',
    };
    format(credentials);
  });

  bench('format with unicode credentials', () => {
    const credentials = { name: 'jürgen', pass: 'pässwörd' };
    format(credentials);
  });

  bench('format with special characters', () => {
    const credentials = { name: 'user@domain', pass: 'p@ss!word#123' };
    format(credentials);
  });
});
