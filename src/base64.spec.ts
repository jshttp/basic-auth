import { afterAll, assert, beforeAll, describe, it, vi } from 'vitest';

const importBase64 = async () => {
  vi.resetModules();

  const { base64 } = await import('./base64.js');
  return base64;
};

describe('base64', async () => {
  let base64 = await importBase64();

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  describe.skipIf(!Buffer)('Buffer', async () => {
    it('should encode base64', () => {
      assert.strictEqual(base64.encode('foo:bar'), 'Zm9vOmJhcg==');
    });

    it('should decode base64', () => {
      assert.strictEqual(base64.decode('Zm9vOmJhcg=='), 'foo:bar');
    });
  });

  describe.skipIf(!Uint8Array.prototype.toBase64)('Uint8Array', async () => {
    beforeAll(async () => {
      vi.stubGlobal('Buffer', undefined);
      base64 = await importBase64();
    });

    it('should encode base64', () => {
      assert.strictEqual(base64.encode('foo:bar'), 'Zm9vOmJhcg==');
    });

    it('should decode base64', () => {
      assert.strictEqual(base64.decode('Zm9vOmJhcg=='), 'foo:bar');
    });
  });
});
