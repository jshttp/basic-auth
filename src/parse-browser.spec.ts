import { afterAll, assert, beforeAll, describe, it, vi } from 'vitest';

describe.skipIf(!Uint8Array.fromBase64)('parse without Buffer', () => {
  let parse: typeof import('./index.js').parse;

  beforeAll(async () => {
    vi.stubGlobal('Buffer', undefined);
    vi.resetModules();
    ({ parse } = await import('./index.js'));
  });

  afterAll(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('should return undefined for invalid base64 characters', () => {
    assert.strictEqual(parse('Basic .'), undefined);
    assert.strictEqual(parse('Basic ~'), undefined);
  });

  it('should return undefined for incomplete base64', () => {
    assert.strictEqual(parse('Basic Y'), undefined);
  });

  it('should parse valid credentials', () => {
    assert.deepEqual(parse('Basic Zm9vOmJhcg=='), {
      name: 'foo',
      pass: 'bar',
    });
  });
});
